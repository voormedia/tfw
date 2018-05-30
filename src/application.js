/* @flow */
import "./util/polyfill"

import AbstractTask from "./util/abstract-task"
import Logger from "./util/logger"
import Router from "./router"

import ClosableServer from "./app/closable-server"
import dispatch from "./app/dispatch"

import * as middleware from "./middleware"

import type {Stack} from "./middleware"

/* $Shape<T> makes every property optional. */
export type ApplicationOptions = $Shape<{
  port: number,
  logger: Logger,
  router: Router,
  terminationGrace: number,
}>

export class Application extends AbstractTask {
  port: number
  router: Router
  stack: Stack

  server: ClosableServer = new ClosableServer()

  /* Start a new application with the given options in next tick. */
  static start(options: ApplicationOptions = {}) {
    const app = new Application(options)
    process.nextTick(() => {app.start()})
    return app
  }

  constructor(options: ApplicationOptions = {}) {
    const {
      port = 3000,
      router = new Router,
      logger = new Logger,
      terminationGrace = 25,
    } = options

    super()

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

  async start(): Promise<void> {
    await super.start()

    this.server.timeout = 0

    // ES7: this.server.on("request", ::this.dispatch)
    this.server.on("request", dispatch(this.stack))

    this.server.listen(this.port)

    return new Promise(resolve => {
      this.server.once("listening", () => resolve())
    })
  }

  async stop(): Promise<void> {
    await super.stop()

    this.server.close()

    return new Promise(resolve => {
      this.server.once("close", () => resolve())
    })
  }

  async kill(): Promise<void> {
    await super.kill()

    /* Don't wait for server to quite gracefully, but quit after short delay.
       This avoids processes hanging for a long time because a
       request failed to finish. We sacrifice all running requests for a
       more speedy recovery because the server will restart. */
    this.server.close()
    this.server.unref()

    return new Promise(resolve => {
      setTimeout(() => resolve(), 500)
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
