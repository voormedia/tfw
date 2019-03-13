import {InternalServerError} from "../errors"

import {Context, Middleware, Next} from "../middleware"

export default function rescue(): Middleware {
  return async function rescue(this: Context, next: Next) {
    this.response.on("pipe", (stream) => {
      stream.on("error", (err) => {
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

function error(this: Context, err: Error) {
  this.data.error = err

  if (!(err as any).expose) {
    if (process.env.NODE_ENV === "test") throw err
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
