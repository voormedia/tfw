/* @flow */
class HttpError extends Error {
  status: number
  error: string
  message: string
  expose: boolean = true

  constructor(message?: string) {
    super()

    /* Error message without trailing period. */
    if (message == null) {
      this.message = "Unknown reason"
    } else {
      this.message = message.replace(/\.?$/, "")
    }

    Error.captureStackTrace(this, this.constructor)
    Object.freeze(this.stack)
  }

  toJSON() {
    return {error: this.error, message: this.message}
  }

  toString() {
    return `${this.status} ${this.message}`
  }
}

function defineError(status: number, error: string) {
  return class extends HttpError {
    status: number = status
    error: string = error

    constructor(message: string = error) {
      super(message)
    }
  }
}

/* https://github.com/nodejs/node/blob/master/lib/_http_server.js */
export const BadRequest = defineError(400, "Bad request")
export const Unauthorized = defineError(401, "Unauthorized")
export const PaymentRequired = defineError(402, "Payment required")
export const Forbidden = defineError(403, "Forbidden")
export const NotFound = defineError(404, "Not found")
export const MethodNotAllowed = defineError(405, "Method not allowed")
export const NotAcceptable = defineError(406, "Not acceptable")
export const ProxyAuthenticationRequired = defineError(407, "Proxy authentication required")
export const RequestTimeout = defineError(408, "Request timeout")
export const Conflict = defineError(409, "Conflict")
export const Gone = defineError(410, "Gone")
export const LengthRequired = defineError(411, "Length required")
export const PreconditionFailed = defineError(412, "Precondition failed")
export const RequestEntityTooLarge = defineError(413, "Request entity too large")
export const RequestURITooLong = defineError(414, "Request URI too long")
export const UnsupportedMediaType = defineError(415, "Unsupported media type")
export const RangeNotSatisfiable = defineError(416, "Range not satisfiable")
export const ExpectationFailed = defineError(417, "Expectation failed")
export const ImATeapot = defineError(418, "I'm a teapot")
export const MisdirectedRequest = defineError(421, "Misdirected request")
export const UnprocessableEntity = defineError(422, "Unprocessable entity")
export const Locked = defineError(423, "Locked")
export const FailedDependency = defineError(424, "Failed dependency")
export const UpgradeRequired = defineError(426, "Upgrade required")
export const PreconditionRequired = defineError(428, "Precondition required")
export const TooManyRequests = defineError(429, "Too many requests")
export const RequestHeaderFieldsTooLarge = defineError(431, "Request header fields too large")
export const UnavailableForLegalReasons = defineError(451, "Unavailable for legal reasons")

export const InternalServerError = defineError(500, "Internal server error")
export const NotImplemented = defineError(501, "Not implemented")
export const BadGateway = defineError(502, "Bad gateway")
export const ServiceUnavailable = defineError(503, "Service unavailable")
export const GatewayTimeout = defineError(504, "Gateway timeout")
