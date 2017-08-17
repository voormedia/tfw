/* @flow */
/* eslint-disable no-ex-assign */
import Timer from "../util/timer"

import {ServiceUnavailable} from "../errors"

import type {Context, Next, Middleware} from "../middleware"
import type {Request} from "../context"

type CancellingRequest = Request & {
  cancelled?: boolean,
}

export default function shutdown(grace: number = 25): Middleware {
  return async function write(next: Next) {
    const ctx: Context = this

    /* Cancel request if server is stopping, but only after a grace period.
       This allows a request to be handled if there is enough time. */
    const timer = new Timer(grace * 1000)
    const stop = async () => {
      await timer.sleep()

      const req: CancellingRequest = ctx.req
      if (req.cancelled) {
        throw new ServiceUnavailable("Please retry the request")
      } else {
        return new Promise(() => {})
      }
    }

    try {
      return await Promise.race([stop(), next()])
    } finally {
      /* Clear timer. It frees setTimeout reference to this context, potentially
         conserving a lot of memory if most requests are short. */
      timer.clear()
    }
  }
}
