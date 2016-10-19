/* @flow */
import type {Context, Next, Middleware} from "../middleware"

import {Forbidden} from "../errors"

export default function requireTLS(): Middleware {
  return function requireTLS(next: Next) {
    const ctx: Context = this
    const socket: tls$TLSSocket | net$Socket = ctx.req.socket

    if (socket.encrypted) return next()
    if (ctx.req.headers["x-forwarded-proto"] === "https") return next()
    if (process.env.NODE_ENV === "development") return next()

    throw new Forbidden("TLS required")
  }
}
