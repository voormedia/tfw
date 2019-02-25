/* @flow */
/* eslint-disable no-unused-expressions */

import type {Context, Next, Middleware} from "../middleware"

type AllowCorsOptions = {
  origin?: string | Array<string>,
  methods?: Array<string>,
  requestHeaders?: Array<string>,
  responseHeaders?: Array<string>,
  maxAge?: number,
}

export default function allowCors(options: AllowCorsOptions = {}): Middleware {
  if (!options.methods) options.methods = ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"]

  const origin = Array.isArray(options.origin) ?
    options.origin.join(", ") : options.origin

  const methods = Array.isArray(options.methods) ?
    options.methods.join(", ") : options.methods

  const requestHeaders = Array.isArray(options.requestHeaders) ?
    options.requestHeaders.join(", ") : options.requestHeaders

  const responseHeaders = Array.isArray(options.responseHeaders) ?
    options.responseHeaders.join(", ") : options.responseHeaders

  const {maxAge} = options

  return function cors(next: Next) {
    (this: Context)

    if (origin) {
      this.set("Access-Control-Allow-Origin", origin)
      if (methods) this.set("Access-Control-Allow-Methods", methods)
      if (requestHeaders) this.set("Access-Control-Allow-Headers", requestHeaders)
      if (responseHeaders) this.set("Access-Control-Expose-Headers", responseHeaders)
      if (maxAge) this.set("Access-Control-Max-Age", maxAge)
    }

    return next()
  }
}
