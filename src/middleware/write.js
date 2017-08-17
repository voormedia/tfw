/* @flow */
/* eslint-disable no-ex-assign */
import {InternalServerError} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

export default function write(): Middleware {
  return async function write(next: Next) {
    const ctx: Context = this

    try {
      let streaming = false
      ctx.stream = stream => {
        setHeaders(ctx)
        ctx.res.writeHead(ctx.status)
        stream.pipe(ctx.res)
        streaming = true
      }

      await next()

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
