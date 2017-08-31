/* @flow */
import "./util/polyfill"

import hostPkg from "./util/host-pkg"

import Logger from "./util/logger"
import Router from "./router"

import ClosableServer from "./app/closable-server"
import dispatch from "./app/dispatch"

import * as middleware from "./middleware"

import type {Stack} from "./middleware"

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

    process.on("SIGINT", async () => {
      await this.stop()
      process.exit(128 + 2)
    })

    process.on("SIGTERM", async () => {
      await this.stop()
      process.exit(128 + 15)
    })

    if (process.env.NODE_ENV !== "test") {
      process.on("uncaughtException", async (err: Error) => {
        this.logger.critical(`uncaught ${err.stack}`)
        await this.kill()
        process.exit(1)
      })

      process.on("unhandledRejection", async (err: Error, promise: Promise<any>) => {
        this.logger.critical(`unhandled ${err.stack} from ${promise.toString()}`)
        await this.kill()
        process.exit(2)
      })
    }

    // ES7: this.server.on("request", ::this.dispatch)
    this.server.on("request", dispatch(this.stack))

    this.logger.notice(`starting ${this.description}`)

    this.server.listen(this.port)

    return new Promise(resolve => {
      this.server.once("listening", () => resolve(this))
    })
  }

  stop(): Promise<Application> {
    this.logger.notice(`stopping ${this.description}`)

    this.server.close()

    return new Promise(resolve => {
      this.server.once("close", () => resolve(this))
    })
  }

  kill(): Promise<Application> {
    this.logger.warning(`forcefully stopped ${this.description}`)

    /* Don't wait for server to quite gracefully, but quit after short delay.
       This avoids processes hanging for a long time because a
       request failed to finish. We sacrifice all running requests for a
       more speedy recovery because the server will restart. */
    this.server.close()
    this.server.unref()

    return new Promise(resolve => {
      setTimeout(() => resolve(this), 500)
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
