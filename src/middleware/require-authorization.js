/* @flow */
/* eslint-disable no-unused-expressions */
import {timingSafeEqual} from "crypto"
import type {Context, Next, Middleware} from "../middleware"

import {Unauthorized} from "../errors"

export default function requireAuthorization(realm: string, credentials: {[username: string]: string}): Middleware {
  return function requireAuthorization(next: Next) {
    (this: Context)

    const {username, password} = this.data
    if (username) {
      const expected = credentials[username]
      if (safeEqual(password, expected)) {
        return next()
      }
    }

    this.set("WWW-Authenticate", `Basic realm="${realm}"`)
    throw new Unauthorized
  }
}

function safeEqual(a: string | void, b: string | void): boolean {
  return a !== undefined && b !== undefined && a.length === b.length &&
    timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
