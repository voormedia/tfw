/* @flow */
/* eslint-disable no-ex-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import sleep from "../util/sleep"

import {ServiceUnavailable, InternalServerError} from "../errors"

import type {Context, Next, Middleware} from "../middleware"
import type {Request} from "../context"

type CancellingRequest = Request & {
  cancelled?: boolean,
}

type RescueOptions = {
  terminationGrace: number,
}

export default function rescue({terminationGrace = 25000}: RescueOptions = {}): Middleware {
  return async function rescue(next: Next) {
    const ctx: Context = this

    /* Cancel request if server is stopping, but only after a grace period.
       This allows a request to be handled if there is enough time. */
    const stop = async () => {
      await sleep(terminationGrace)

      let req: CancellingRequest = ctx.req
      if (req.cancelled) {
        throw new ServiceUnavailable("Please retry the request")
      } else {
        await sleep(600000)
      }
    }

    try {
      return await Promise.race([stop(), next()])
    } catch (err) {
      if (!err.expose) {
        if (process.env.NODE_ENV === "test") throw err

        ctx.data.error = err
        err = new InternalServerError
      }

      ctx.body = err
      ctx.status = err.status
    }
  }
}
