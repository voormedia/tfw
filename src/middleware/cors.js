/* @flow */
/* eslint-disable no-unused-expressions */

import type {Context, Next, Middleware} from "../middleware"

export default function cors(): Middleware {
  return function cors(next: Next) {
    (this: Context)

    this.set("Access-Control-Allow-Origin", "*")
    this.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    this.set("Access-Control-Allow-Headers",
      "DNT, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Range")
    this.set("Access-Control-Expose-Headers", "Content-Length, Content-Range")

    return next()
  }
}
