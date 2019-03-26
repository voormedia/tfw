import {Socket} from "net"
import {TLSSocket} from "tls"

import {Context, Middleware, Next} from "../middleware"

import {Forbidden, ServiceError} from "../errors"

export default function requireTLS(): Middleware {
  return async function requireTLS(this: Context, next: Next) {
    const socket: TLSSocket | Socket = this.request.socket

    if ((socket as TLSSocket).encrypted) return next()
    if (this.get("x-forwarded-proto") === "https") return next()
    if (process.env.NODE_ENV === "development") return next()

    throw new TlsRequired()
  }
}

/* tslint:disable-next-line: variable-name */
const TlsRequired = ServiceError.define({
  status: 403,
  error: "tls_required",
  message: "TLS is required to connect",
})
