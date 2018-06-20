/* @flow */
/* eslint-disable no-unused-expressions */
import * as validator from "../util/schema-validator"

import {BadRequest} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

type ValidationOptions = {
  schema: Object,
  message: string,
  details: boolean,
  optional: boolean,
}

export default function validateBody(options: ValidationOptions): Middleware {
  return function validateBody(next: Next) {
    (this: Context)

    validate(this.data.body, options)
    return next()
  }
}

function validate(body, {schema, message = "Request is invalid", details = true, optional = false}) {
  /* Don't validate non-JSON bodies if the request schema is optional. */
  if (body === undefined || Buffer.isBuffer(body)) {
    if (optional) return

    /* Validate empty body. */
    body = {}
  }

  const errors = validator.validate(schema, body)
  if (errors.length) {
    if (details) {
      throw new BadRequest(`${message}: ${errors.join("; ")}`)
    } else {
      throw new BadRequest(message)
    }
  }
}
