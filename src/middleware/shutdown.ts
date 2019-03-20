import {Timer} from "../util/timer"

import {ServiceUnavailable} from "../errors"

import {ClosableServer} from "../app/closable-server"
import {Context, Middleware, Next} from "../middleware"

export default function shutdown(grace: number = 25): Middleware {
  return async function shutdown(this: Context, next: Next) {
    /* Cancel request if server is stopping, but only after a grace period.
       This allows a request to be handled if there is enough time. */
    const timer = new Timer(grace * 1000)
    const stop = async () => {
      await timer.sleep()

      const server = (this.request.socket as any).server as ClosableServer
      if (server.closing) {
        throw new ServiceUnavailable("Please retry the request")
      } else {
        return new Promise<void>(() => {})
      }
    }

    try {
      await Promise.race([stop(), next()])
    } finally {
      /* Clear timer. It frees setTimeout reference to this context, potentially
         conserving a lot of memory if most requests are short. */
      timer.clear()
    }
  }
}
