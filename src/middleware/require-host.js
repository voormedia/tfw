/* @flow */
import type {Context, Next, Middleware} from "../middleware"

import {NotFound} from "../errors"

export default function requireHost(...hosts: string[]): Middleware {
  return function requireHost(next: Next) {
    const ctx: Context = this
    const host: string = ctx.req.headers.host

    if (hosts.includes(host)) return next()

    throw new NotFound("Endpoint does not exist")
  }
}
