/* @flow */
/* eslint-disable no-unused-expressions */
import type {Context, Next, Middleware} from "../middleware"

import {NotFound} from "../errors"

export default function requireHost(...hosts: string[]): Middleware {
  return function requireHost(next: Next) {
    (this: Context)

    const host: string = this.request.headers.host

    if (hosts.includes(host)) return next()

    throw new NotFound("Endpoint does not exist")
  }
}
