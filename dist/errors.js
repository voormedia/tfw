export class ServiceError extends Error {
    static define(options) {
        return define(options);
    }
    expose = true;
    constructor() {
        super();
        Error.captureStackTrace(this, this.constructor);
        Object.freeze(this.stack);
    }
    toJSON() {
        return { error: this.error, message: this.message };
    }
    toString() {
        return `${this.status} ${this.message}`;
    }
}
function define({ status = 500, error, message = "Internal error", }) {
    message = addPeriod(message);
    return class HttpError extends ServiceError {
        static defaultMessage = message;
        status = status;
        error = error;
        message = message;
        constructor(msg) {
            super();
            if (msg)
                this.message = addPeriod(msg);
        }
    };
}
/* https://github.com/nodejs/node/blob/master/lib/_http_server.js */
/* tslint:disable:variable-name */
export const BadRequest = define({
    status: 400,
    error: "invalid_request",
    message: "Request is invalid",
});
export const Unauthorized = define({
    status: 401,
    error: "unauthorized",
    message: "Unauthorized",
});
export const PaymentRequired = define({
    status: 402,
    error: "payment_required",
    message: "Payment required",
});
export const Forbidden = define({
    status: 403,
    error: "forbidden",
    message: "Forbidden",
});
export const NotFound = define({
    status: 404,
    error: "not_found",
    message: "Resource not found",
});
export const MethodNotAllowed = define({
    status: 405,
    error: "method_not_allowed",
    message: "Method not allowed",
});
export const NotAcceptable = define({
    status: 406,
    error: "not_acceptable",
    message: "Not acceptable",
});
export const ProxyAuthenticationRequired = define({
    status: 407,
    error: "proxy_authentication_required",
    message: "Proxy authentication required",
});
export const RequestTimeout = define({
    status: 408,
    error: "request_timeout",
    message: "Request timeout",
});
export const Conflict = define({
    status: 409,
    error: "conflict",
    message: "Conflict",
});
export const Gone = define({
    status: 410,
    error: "gone",
    message: "Gone",
});
export const LengthRequired = define({
    status: 411,
    error: "length_required",
    message: "Length required",
});
export const PreconditionFailed = define({
    status: 412,
    error: "precondition_failed",
    message: "Precondition failed",
});
export const RequestEntityTooLarge = define({
    status: 413,
    error: "request_entity_too_large",
    message: "Request entity too large",
});
export const RequestURITooLong = define({
    status: 414,
    error: "request_uri_too_long",
    message: "Request URI too long",
});
export const UnsupportedMediaType = define({
    status: 415,
    error: "unsupported_media_type",
    message: "Unsupported media type",
});
export const RangeNotSatisfiable = define({
    status: 416,
    error: "range_not_satisfiable",
    message: "Range not satisfiable",
});
export const ExpectationFailed = define({
    status: 417,
    error: "expectation_failed",
    message: "Expectation failed",
});
export const ImATeapot = define({
    status: 418,
    error: "im_a_teapot",
    message: "I'm a teapot",
});
export const MisdirectedRequest = define({
    status: 421,
    error: "misdirected_request",
    message: "Misdirected request",
});
export const UnprocessableEntity = define({
    status: 422,
    error: "unprocessable_entity",
    message: "Unprocessable entity",
});
export const Locked = define({
    status: 423,
    error: "locked",
    message: "Locked",
});
export const FailedDependency = define({
    status: 424,
    error: "failed_dependency",
    message: "Failed dependency",
});
export const UpgradeRequired = define({
    status: 426,
    error: "upgrade_required",
    message: "Upgrade required",
});
export const PreconditionRequired = define({
    status: 428,
    error: "precondition_required",
    message: "Precondition required",
});
export const TooManyRequests = define({
    status: 429,
    error: "too_many_requests",
    message: "Too many requests",
});
export const RequestHeaderFieldsTooLarge = define({
    status: 431,
    error: "request_header_fields_too_large",
    message: "Request header fields too large",
});
export const UnavailableForLegalReasons = define({
    status: 451,
    error: "unavailable_for_legal_reasons",
    message: "Unavailable for legal reasons",
});
export const InternalServerError = define({
    status: 500,
    error: "internal_error",
    message: "Internal server error",
});
export const NotImplemented = define({
    status: 501,
    error: "not_implemented",
    message: "Not implemented",
});
export const BadGateway = define({
    status: 502,
    error: "bad_gateway",
    message: "Bad gateway",
});
export const ServiceUnavailable = define({
    status: 503,
    error: "service_unavailable",
    message: "Service unavailable",
});
export const GatewayTimeout = define({
    status: 504,
    error: "gateway_timeout",
    message: "Gateway timeout",
});
function addPeriod(message) {
    return message.replace(/([^!?.])$/, "$1.");
}
//# sourceMappingURL=errors.js.map