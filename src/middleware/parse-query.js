/* @flow */
/* eslint-disable no-unused-expressions */
import querystring from "querystring"

import type {Context, Next, Middleware} from "../middleware"

export default function parseQuery(): Middleware {
  return function parseQuery(next: Next) {
    (this: Context)

    const search = this.url.split("?", 2)[1]
    const params = querystring.parse(search)

    if (this.data.params) {
      Object.assign(this.data.params, params)
    } else {
      this.data.params = params
    }

    return next()
  }
}
