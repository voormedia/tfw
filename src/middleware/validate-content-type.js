/* @flow */
import contentType from "content-type"

import {UnsupportedMediaType} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

export default function validateContentType(expected: string): Middleware {
  return function validateContentType(next: Next) {
    const ctx: Context = this

    if (ctx.req.headers["content-length"] || ctx.req.headers["content-encoding"]) {
      /* If there is a body and no Content-Type, we are allowed to assume
         application/octet-stream: https://tools.ietf.org/html/rfc7231#section-3.1.1.5 */
      const {type} = contentType.parse(ctx.req.headers["content-type"] || "application/octet-stream")
      if (type !== expected) {
        throw new UnsupportedMediaType(`Please use ${expected} content type`)
      }
    }

    return next()
  }
}
