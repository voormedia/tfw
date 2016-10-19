/* @flow */
// import {Readable} from "stream"

import type {Context, Next, Middleware} from "../middleware"


export default function write(): Middleware {
  return async function write(next: Next) {
    function setHeaders() {
      for (const [name, value] of ctx.headers) {
        ctx.res.setHeader(name, value)
      }
    }

    const ctx: Context = this

    let streaming = false

    /* https://github.com/facebook/flow/issues/285 */
    ctx.stream = stream => {
      // if (stream instanceof Readable) throw new Error
      setHeaders()
      ctx.res.writeHead(ctx.status)
      stream.pipe(ctx.res)
      streaming = true
    }

    await next()

    if (streaming) return

    if (ctx.body === null) {
      ctx.body = Buffer.alloc(0)
    } else if (typeof ctx.body === "string") {
      ctx.body = Buffer.from(ctx.body, "utf8")
    } else if (ctx.body instanceof Buffer) {
      /* Use as is. */
    } else {
      /* Treat as JSON. */
      ctx.headers.set("Content-Type", "application/json")
      ctx.body = Buffer.from(JSON.stringify(ctx.body), "utf8")
    }

    setHeaders()

    if (ctx.body.length) {
      ctx.res.setHeader("Content-Length", Buffer.byteLength(ctx.body).toString())
    }

    ctx.res.writeHead(ctx.status)
    ctx.res.end(ctx.body)
  }
}
