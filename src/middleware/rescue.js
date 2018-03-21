/* @flow */
/* eslint-disable no-unused-expressions */
import {InternalServerError} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

export default function rescue(): Middleware {
  return async function rescue(next: Next) {
    (this: Context)

    this.response.on("pipe", stream => {
      stream.on("error", err => {
        stream.unpipe()

        // ES7 this::error(err)
        error.call(this, err)
      })
    })

    try {
      await next()
    } catch (err) {
      // ES7 this::error(err)
      return error.call(this, err)
    }
  }
}

function error(err: Error) {
  (this: Context)

  this.data.error = err

  if (!(err: any).expose) {
    if (process.env.NODE_ENV === "test") throw err
    err = new InternalServerError
  }

  if (this.sent) {
    if (!this.finished) this.response.end()
    return
  }

  this.set("Content-Type", "application/json")

  this.status = (err: any).status || 500
  this.response.end(JSON.stringify(err), "utf8")
}
