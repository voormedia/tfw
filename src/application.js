/* @flow */
import "./util/polyfill"

import hostPkg from "./util/host-pkg"

import Logger from "./util/logger"
import ClosableServer from "./util/closable-server"
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

const description = `${hostPkg.name} service ${process.env.HOSTNAME || ""}`.trim()

export class Application {
  port: number
  router: Router
  logger: Logger
  stack: Stack

  description: string = description
  server: ClosableServer = new ClosableServer()

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
    const stopped = new Promise(resolve => {
      this.server.once("close", () => {
        resolve(this)
      })
    })

    this.logger.notice(`stopping ${this.description}`)

    this.server.close()

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
