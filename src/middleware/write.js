/* @flow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import {Readable} from "stream"

import {InternalServerError} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

export default function write(): Middleware {
  return async function write(next: Next) {
    (this: Context)

    try {
      await next()
    } catch (err) {
      // ES7 this::error(err)
      return error.call(this, err)
    }

    Object.freeze(this)

    if (this.sent) return

    if (this.body === null) {
      this.response.end()
    } else if (this.body instanceof Buffer) {
      this.response.end(this.body)
    } else if (this.body instanceof Readable) {
      this.body.on("error", err => {
        this.body.unpipe()

        // ES7 this::error(err)
        return error.call(this, err)
      })

      this.body.pipe(this.response)
    } else if (typeof this.body === "string") {
      this.response.end(this.body, "utf8")
    } else {
      /* Treat as JSON. */
      this.set("content-type", "application/json")
      this.response.end(JSON.stringify(this.body), "utf8")
    }
  }
}

function error(err: Error) {
  (this: Context)

  this.data.error = err

  if (!err.expose) {
    if (process.env.NODE_ENV === "test") throw err
    err = new InternalServerError
  }

  if (this.sent) {
    if (!this.finished) this.response.end()
    return
  }

  this.set("content-type", "application/json")

  this.status = err.status || 500
  this.response.end(JSON.stringify(err), "utf8")
}
