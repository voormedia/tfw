import {InternalServerError} from "../errors"

import {Context, Middleware, Next} from "../middleware"

export default function rescue(): Middleware {
  return async function rescue(this: Context, next: Next) {
    this.response.on("pipe", stream => {
      stream.on("error", err => {
        stream.unpipe()
        error.call(this, err)
      })
    })

    try {
      await next()
    } catch (err) {
      error.call(this, err)
      return
    }
  }
}

function error(this: Context, err: Error) {
  this.data.error = err

  if (!(err as any).expose) {
    if (process.env.NODE_ENV === "test" && !process.env.NODE_RESCUE_TEST) throw err
    err = new InternalServerError
  }

  if (this.sent) {
    this.response.end()
    return
  }

  this.set("Content-Type", "application/json")

  this.status = (err as any).status || 500
  this.response.end(JSON.stringify(err), "utf8")
}
