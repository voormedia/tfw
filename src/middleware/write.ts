/* @flow */
/* eslint-disable no-unused-expressions */
import {Readable} from "stream"

import {Context, Middleware, Next} from "../middleware"

export default function write(): Middleware {
  return async function write(this: Context, next: Next) {
    await next()

    Object.freeze(this)

    if (this.sent) return

    /* tslint:disable-next-line: strict-type-predicates */
    if (this.body === null) {
      this.response.end()
    } else if (this.body instanceof Buffer) {
      this.response.end(this.body)
    } else if (this.body instanceof Readable) {
      this.body.pipe(this.response)
    } else if (typeof this.body === "string") {
      this.response.end(this.body, "utf8")
    } else {
      /* Treat as JSON. */
      this.set("Content-Type", "application/json")
      this.response.end(JSON.stringify(this.body), "utf8")
    }
  }
}
