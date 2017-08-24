/* @flow */
/* eslint-disable no-unused-expressions */
import type {Context, Next, Middleware} from "../middleware"

import {Forbidden} from "../errors"

export default function requireTLS(): Middleware {
  return function requireTLS(next: Next) {
    (this: Context)

    const socket: tls$TLSSocket | net$Socket = this.request.socket

    if (socket.encrypted) return next()
    if (this.get("x-forwarded-proto") === "https") return next()
    if (process.env.NODE_ENV === "development") return next()

    throw new Forbidden("TLS required")
  }
}
