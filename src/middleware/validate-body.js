/* @flow */
/* eslint-disable no-unused-expressions */
import {createValidator} from "../util/schema-validator"

import {BadRequest} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

export type ValidationOptions = {
  schema: Object,
  message: string,
  details: boolean,
  optional: boolean,
}

export default function validateBody(options: ValidationOptions): Middleware {
  const validator = createValidator(options.schema)
  return function validateBody(next: Next) {
    (this: Context)

    validate(validator, this.data.body, options)
    return next()
  }
}

function validate(validator, body, {message = "Request is invalid", details = true, optional = false}) {
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
