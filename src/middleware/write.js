/* @flow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import {Readable} from "stream"

import {InternalServerError} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

export default function write(): Middleware {
  return async function write(next: Next) {
    (this: Context)

    this.response.on("pipe", stream => {
      this.body = stream

      stream.on("error", err => {
        stream.unpipe()

        // ES7 this::error(err)
        error.call(this, err)

        // ES7 this::send()
        send.call(this)

        this.response.end()
      })
    })

    try {
      await next()
    } catch (err) {
      // ES7 this::error(err)
      error.call(this, err)
    }

    // ES7 this::send()
    send.call(this)
  }
}

function error(err: Error) {
  (this: Context)

  this.data.error = err

  if (!err.expose) {
    if (process.env.NODE_ENV === "test") throw err
    err = new InternalServerError
  }

  this.body = err
  this.status = err.status || 500
}

function send() {
  (this: Context)

  if (this.sent) return

  if (this.body === null) {
    this.body = Buffer.alloc(0)
  } else if (this.body instanceof Buffer) {
    /* Use as is. */
  } else if (this.body instanceof Readable) {
    this.body.pipe(this.response)
    return
  } else if (typeof this.body === "string") {
    this.body = Buffer.from(this.body, "utf8")
  } else {
    /* Treat as JSON. */
    this.set("content-type", "application/json")
    this.body = Buffer.from(JSON.stringify(this.body), "utf8")
  }

  this.set("content-length", Buffer.byteLength(this.body))
  this.response.end(this.body)
}
