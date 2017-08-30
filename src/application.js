/* @flow */
import "./util/polyfill"

import http from "http"

import hostPkg from "./util/host-pkg"

import Logger from "./util/logger"
import Router from "./router"
import Context from "./context"

import {NotFound, InternalServerError} from "./errors"
import * as middleware from "./middleware"

import type {Next, Stack} from "./middleware"
import type {Request, Response} from "./context"

import sleep from "./util/sleep"

export type ApplicationOptions = {|
  port?: number,
  logger?: Logger,
  router?: Router,
  terminationGrace?: number,
|}

type ClosingServer = http.Server & {
  closing?: boolean,
}

type Socket = net$Socket

const description = `${hostPkg.name} service ${process.env.HOSTNAME || ""}`.trim()

export class Application {
  port: number
  router: Router
  logger: Logger
  stack: Stack

  description: string = description
  server: ClosingServer = http.createServer()
  sockets: Map<Socket, number> = new Map

  /* Start a new application with the given options in next tick. */
  static start(options: ApplicationOptions = Object.seal({})) {
    const app = new Application(options)
    process.nextTick(() => {app.start()})
    return app
  }

  constructor(options: ApplicationOptions = Object.seal({})) {
    const {
      port = 3000,
      router = new Router,
      logger = new Logger,
      terminationGrace = 25,
    } = options

    /* Assign default env. */
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = "development"
    }

    this.port = port
    this.router = router
    this.logger = logger

    /* Bare minimum stack to do anything useful. */
    this.stack = [
      middleware.log(logger),
      middleware.write(),
      middleware.rescue(),
      middleware.shutdown(terminationGrace),
      middleware.route(router),
    ]

    Object.freeze(this)
  }

  start(): Promise<Application> {
    this.server.closing = false
    this.server.timeout = 0

    process.on("SIGTERM", async () => {
      await this.stop()
      process.exit(0)
    })

    process.on("SIGINT", async () => {
      await this.stop()
      process.exit(0)
    })

    if (process.env.NODE_ENV !== "test") {
      process.on("uncaughtException", async (err: Error) => {
        this.logger.critical(`uncaught ${err.stack}`)

        /* Don't wait for server to quite gracefully, but quit after short delay.
           This avoids processes hanging for a long time because a
           request failed to finish. We sacrifice all running requests for a
           more speedy recovery because the server will restart. */
        this.stop()

        await sleep(500)
        this.logger.warning(`forcefully stopped ${this.description}`)

        process.exit(1)
      })
    }

    this.server.on("connection", (socket: net$Socket) => {
      this.sockets.set(socket, 0)

      socket.on("close", () => {
        this.sockets.delete(socket)
      })
    })

    this.server.on("request", (request: Request, response: Response) => {
      const socket = request.socket
      this.sockets.set(socket, +this.sockets.get(socket) + 1)

      if (this.server.closing) {
        response.setHeader("Connection", "close")
      }

      response.on("finish", () => {
        const pending = +this.sockets.get(socket) - 1
        this.sockets.set(socket, pending)

        if (this.server.closing && pending === 0) {
          this.logger.debug(`closing connection ${socket.remoteAddress || "unknown"}:${socket.remotePort}`)
          socket.end()
        }
      })
    })

    // ES7: this.server.on("request", ::this.dispatch)
    this.server.on("request", this.dispatch.bind(this))

    const started = new Promise(resolve => {
      this.server.once("listening", () => {
        resolve(this)
      })
    })

    this.logger.notice(`starting ${this.description}`)

    this.server.listen(this.port)

    return started
  }

  stop(): Promise<Application> {
    this.logger.notice(`stopping ${this.description}`)

    this.server.closing = true

    const stopped = new Promise(resolve => {
      this.server.close(err => {
        if (err) {
          this.logger.error(err)
        }

        this.logger.notice(`gracefully stopped ${this.description}`)
        resolve(this)
      })
    })

    for (const [socket, pending] of this.sockets) {
      if (pending === 0) {
        this.logger.debug(`closing idle connection ${socket.remoteAddress || "unknown"}:${socket.remotePort}`)
        socket.end()
      }
    }

    return stopped
  }

  dispatch(req: Request, res: Response): void {
    const stack = this.stack.slice(0)
    const context = new Context(stack, req, res)
    const handler = compose(stack, context)

    Promise.resolve(handler()).catch(err => {
      process.nextTick(() => {throw err})
    })
  }

  inspect() {
    return {
      router: this.router,
      stack: this.stack,
      server: "<node server>",
    }
  }
}

export default Application

function compose(stack: Stack, context: Context): Next {
  const iterator = stack.values()

  return function next() {
    const handler = iterator.next().value

    /* Check if a handler is present and valid. */
    if (!handler) {
      throw new NotFound("Endpoint does not exist")
    }

    if (typeof handler !== "function") {
      throw new InternalServerError("Bad handler")
    }

    // ES7: return context::handler(next)
    return handler.call(context, next)
  }
}
