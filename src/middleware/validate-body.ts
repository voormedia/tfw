import {createValidator, Validator} from "../util/schema-validator"

import {BadRequest} from "../errors"

import {Body, Context, Middleware, Next} from "../middleware"

export interface ValidationOptions {
  schema: object,
  message: string,
  details: boolean,
  optional: boolean,
}

export default function validateBody(options: ValidationOptions): Middleware {
  const validator = createValidator(options.schema)
  return function validateBody(this: Context, next: Next) {
    validate(validator, this.data.body, options)
    return next()
  }
}

function validate(validator: Validator, body: Body, {
  message = "Request is invalid",
  details = true,
  optional = false,
}) {
  /* Don't validate non-JSON bodies if the request schema is optional. */
  if (body === undefined || Buffer.isBuffer(body)) {
    if (optional) return

    /* Validate empty body. */
    body = {}
  }

  const errors = validator(body)
  if (errors.length) {
    if (details) {
      throw new BadRequest(`${message}: ${errors.join("; ")}`)
    } else {
      throw new BadRequest(message)
    }
  }
}
