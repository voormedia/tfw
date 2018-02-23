/* @flow */
/* eslint-disable no-unused-expressions */
import type {Context, Next, Middleware} from "../middleware"

import {Unauthorized} from "../errors"

export default function requireAuthorization(credentials: {[username: string]: string}): Middleware {
  return function requireAuthorization(next: Next) {
    (this: Context)

    const {username, password} = this.data
    if (username && password === credentials[username]) {
      return next()
    } else {
      throw new Unauthorized
    }
  }
}
