import {createValidator, simplifyResults, ValidationResult, Validator} from "../util/schema-validator"

import {BadRequest} from "../errors"
import {Body, Context, Middleware, Next} from "../middleware"

export {ValidationResult}

export interface ValidationOptions {
  schema: object,
  optional?: boolean,
  details?: boolean,
  toError?(details: ValidationResult[]): Error,
}

export default function validateBody(options: ValidationOptions): Middleware {
  const validator = createValidator(options.schema)

  /* TODO: This should probably be deprecated and any caller should provide
     a custom toError() function to create a new error instance. */
  if (options.details === false && !options.toError) {
    options.toError = () => new BadRequest()
  }

  return async function validateBody(this: Context, next: Next) {
    validate(validator, this.data.body as Body, options)
    return next()
  }
}

function validate(validator: Validator, body: Body, {
  optional = false,
  toError = details => new ValidationError(...details),
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
    throw toError(errors)
  }
}

export class ValidationError extends BadRequest {
  details: ValidationResult[]

  constructor(...details: ValidationResult[]) {
    super(`${BadRequest.defaultMessage.replace(/\.$/, ":")} ${simplifyResults(details).join("; ")}`)
    this.details = details
  }

  toJSON() {
    return {...super.toJSON(), details: this.details}
  }
}
