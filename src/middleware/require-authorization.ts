import {timingSafeEqual} from "crypto"
import {Context, Middleware, Next} from "../middleware"

import {Unauthorized} from "../errors"

export interface Credentials {[username: string]: string}

export default function requireAuthorization(realm: string, credentials: Credentials): Middleware {
  return async function requireAuthorization(this: Context, next: Next) {
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

function safeEqual(a: string | undefined, b: string | undefined): boolean {
  return a !== undefined && b !== undefined && a.length === b.length &&
    timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
