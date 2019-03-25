import {Socket} from "net"
import {TLSSocket} from "tls"

import {Context, Middleware, Next} from "../middleware"

import {Forbidden} from "../errors"

export default function requireTLS(): Middleware {
  return async function requireTLS(this: Context, next: Next) {
    const socket: TLSSocket | Socket = this.request.socket

    if ((socket as TLSSocket).encrypted) return next()
    if (this.get("x-forwarded-proto") === "https") return next()
    if (process.env.NODE_ENV === "development") return next()

    throw new Forbidden("TLS required")
  }
}
