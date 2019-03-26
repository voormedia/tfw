import {createValidator, simplifyResults, ValidationResult, Validator} from "../util/schema-validator"

import {BadRequest} from "../errors"

import {Body, Context, Middleware, Next} from "../middleware"

export interface ValidationOptions {
  schema: object,
  details?: boolean,
  optional?: boolean,
  message?: string,
}

export default function validateBody(options: ValidationOptions): Middleware {
  const validator = createValidator(options.schema)
  return async function validateBody(this: Context, next: Next) {
    validate(validator, this.data.body as Body, options)
    return next()
  }
}

function validate(validator: Validator, body: Body, {
  message = BadRequest.defaultMessage,
  details = true,
  optional = false,
}: ValidationOptions) {
  /* Don't validate non-JSON bodies if the request schema is optional. */
  /* tslint:disable-next-line: strict-type-predicates */
  if (body === undefined || Buffer.isBuffer(body)) {
    if (optional) return

    /* Validate empty body. */
    body = {}
  }

  const errors = validator(body as object)
  if (errors.length) {
    if (details) {
      throw new ValidationError(simplifyResults(errors).join("; "), errors)
    } else {
      throw new BadRequest(message)
    }
  }
}

export class ValidationError extends BadRequest {
  details: ValidationResult[]

  constructor(message: string, details: ValidationResult[]) {
    super(`${BadRequest.defaultMessage.replace(/\.$/, ":")} ${message}`)
    this.details = details
  }

  toJSON() {
    return {...super.toJSON(), details: this.details}
  }
}
