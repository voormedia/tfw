/* @flow */
/* eslint-disable no-unused-expressions */
import type {Context, Next, Middleware} from "../middleware"

import {InternalServerError} from "../errors"

export default function exposeAllErrors(): Middleware {
  return async function exposeAllErrors(next: Next) {
    (this: Context)

    try {
      await next()
    } catch (err) {
      if (!err.toJSON) {
        err.toJSON = toJSON
      }

      err.expose = true
      throw err
    }
  }
}

const {error} = new InternalServerError()
function toJSON() {
  (this: Error)

  /* TODO: Include stack? {stack: this.stack.split(/\n\s+/)} */
  return {error, message: this.message}
}
