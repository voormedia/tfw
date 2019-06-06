import {Context, Middleware, Next} from "../middleware"

import {InternalServerError} from "../errors"

export default function exposeAllErrors(): Middleware {
  return async function exposeAllErrors(this: Context, next: Next) {
    try {
      await next()
    } catch (err) {
      if (err instanceof Error) {
        /* Add specific JSON serialization to the error and make it exposable. */
        if (!(err as any).toJSON) {
          (err as any).toJSON = toJSON
        }

        (err as any).expose = true

        throw err
      }

      /* Wrap anything that's not an Error but that pretends to be one. */
      throw new InternalServerError(err.message || err.Message || err)
    }
  }
}

const {error} = new InternalServerError()
function toJSON(this: Error) {
  /* TODO: Include stack? {stack: this.stack.split(/\n\s+/)} */
  return {error, message: this.message}
}
