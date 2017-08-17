/* @flow */
/* eslint-disable no-ex-assign */
import Timer from "../util/timer"

import {ServiceUnavailable, InternalServerError} from "../errors"

import type {Context, Next, Middleware} from "../middleware"
import type {Request} from "../context"

type CancellingRequest = Request & {
  cancelled?: boolean,
}

type WriteOptions = {
  terminationGrace: number,
}

export default function write({terminationGrace = 25}: WriteOptions = {}): Middleware {
  return async function write(next: Next) {
    const ctx: Context = this

    /* Cancel request if server is stopping, but only after a grace period.
       This allows a request to be handled if there is enough time. */
    const timer = new Timer(terminationGrace * 1000)
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
      let streaming = false
      ctx.stream = stream => {
        setHeaders(ctx)
        ctx.res.writeHead(ctx.status)
        stream.pipe(ctx.res)
        streaming = true
      }

      await Promise.race([stop(), next()])
      if (streaming) return
      setHeaders(ctx)
    } catch (err) {
      ctx.data.error = err

      if (!err.expose) {
        if (process.env.NODE_ENV === "test") throw err
        err = new InternalServerError
      }

      ctx.body = err
      ctx.status = err.status
    } finally {
      /* Clear timer. It frees setTimeout reference to this context, potentially
         conserving a lot of memory if most requests are short. */
      timer.clear()
    }

    setResponse(ctx)
  }
}

function setHeaders(ctx) {
  for (const [name, value] of ctx.headers) {
    ctx.res.setHeader(name, value)
  }
}

function setResponse(ctx) {
  if (ctx.body === null) {
    ctx.body = Buffer.alloc(0)
  } else if (typeof ctx.body === "string") {
    ctx.body = Buffer.from(ctx.body, "utf8")
  } else if (ctx.body instanceof Buffer) {
    /* Use as is. */
  } else {
    /* Treat as JSON. */
    ctx.res.setHeader("Content-Type", "application/json")
    ctx.body = Buffer.from(JSON.stringify(ctx.body), "utf8")
  }

  if (ctx.body.length) {
    ctx.res.setHeader("Content-Length", Buffer.byteLength(ctx.body).toString())
  }

  ctx.res.writeHead(ctx.status)
  ctx.res.end(ctx.body)
}
