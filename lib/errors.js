"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayTimeout = exports.ServiceUnavailable = exports.BadGateway = exports.NotImplemented = exports.InternalServerError = exports.UnavailableForLegalReasons = exports.RequestHeaderFieldsTooLarge = exports.TooManyRequests = exports.PreconditionRequired = exports.UpgradeRequired = exports.FailedDependency = exports.Locked = exports.UnprocessableEntity = exports.MisdirectedRequest = exports.ImATeapot = exports.ExpectationFailed = exports.RangeNotSatisfiable = exports.UnsupportedMediaType = exports.RequestURITooLong = exports.RequestEntityTooLarge = exports.PreconditionFailed = exports.LengthRequired = exports.Gone = exports.Conflict = exports.RequestTimeout = exports.ProxyAuthenticationRequired = exports.NotAcceptable = exports.MethodNotAllowed = exports.NotFound = exports.Forbidden = exports.PaymentRequired = exports.Unauthorized = exports.BadRequest = exports.ServiceError = void 0;
class ServiceError extends Error {
    constructor() {
        super();
        this.expose = true;
        Error.captureStackTrace(this, this.constructor);
        Object.freeze(this.stack);
    }
    static define(options) {
        return define(options);
    }
    toJSON() {
        return { error: this.error, message: this.message };
    }
    toString() {
        return `${this.status} ${this.message}`;
    }
}
exports.ServiceError = ServiceError;
function define({ status = 500, error, message = "Internal error", }) {
    var _a;
    message = addPeriod(message);
    return _a = class HttpError extends ServiceError {
            constructor(msg) {
                super();
                this.status = status;
                this.error = error;
                this.message = message;
                if (msg)
                    this.message = addPeriod(msg);
            }
        },
        _a.defaultMessage = message,
        _a;
}
/* https://github.com/nodejs/node/blob/master/lib/_http_server.js */
/* tslint:disable:variable-name */
exports.BadRequest = define({
    status: 400,
    error: "invalid_request",
    message: "Request is invalid",
});
exports.Unauthorized = define({
    status: 401,
    error: "unauthorized",
    message: "Unauthorized",
});
exports.PaymentRequired = define({
    status: 402,
    error: "payment_required",
    message: "Payment required",
});
exports.Forbidden = define({
    status: 403,
    error: "forbidden",
    message: "Forbidden",
});
exports.NotFound = define({
    status: 404,
    error: "not_found",
    message: "Resource not found",
});
exports.MethodNotAllowed = define({
    status: 405,
    error: "method_not_allowed",
    message: "Method not allowed",
});
exports.NotAcceptable = define({
    status: 406,
    error: "not_acceptable",
    message: "Not acceptable",
});
exports.ProxyAuthenticationRequired = define({
    status: 407,
    error: "proxy_authentication_required",
    message: "Proxy authentication required",
});
exports.RequestTimeout = define({
    status: 408,
    error: "request_timeout",
    message: "Request timeout",
});
exports.Conflict = define({
    status: 409,
    error: "conflict",
    message: "Conflict",
});
exports.Gone = define({
    status: 410,
    error: "gone",
    message: "Gone",
});
exports.LengthRequired = define({
    status: 411,
    error: "length_required",
    message: "Length required",
});
exports.PreconditionFailed = define({
    status: 412,
    error: "precondition_failed",
    message: "Precondition failed",
});
exports.RequestEntityTooLarge = define({
    status: 413,
    error: "request_entity_too_large",
    message: "Request entity too large",
});
exports.RequestURITooLong = define({
    status: 414,
    error: "request_uri_too_long",
    message: "Request URI too long",
});
exports.UnsupportedMediaType = define({
    status: 415,
    error: "unsupported_media_type",
    message: "Unsupported media type",
});
exports.RangeNotSatisfiable = define({
    status: 416,
    error: "range_not_satisfiable",
    message: "Range not satisfiable",
});
exports.ExpectationFailed = define({
    status: 417,
    error: "expectation_failed",
    message: "Expectation failed",
});
exports.ImATeapot = define({
    status: 418,
    error: "im_a_teapot",
    message: "I'm a teapot",
});
exports.MisdirectedRequest = define({
    status: 421,
    error: "misdirected_request",
    message: "Misdirected request",
});
exports.UnprocessableEntity = define({
    status: 422,
    error: "unprocessable_entity",
    message: "Unprocessable entity",
});
exports.Locked = define({
    status: 423,
    error: "locked",
    message: "Locked",
});
exports.FailedDependency = define({
    status: 424,
    error: "failed_dependency",
    message: "Failed dependency",
});
exports.UpgradeRequired = define({
    status: 426,
    error: "upgrade_required",
    message: "Upgrade required",
});
exports.PreconditionRequired = define({
    status: 428,
    error: "precondition_required",
    message: "Precondition required",
});
exports.TooManyRequests = define({
    status: 429,
    error: "too_many_requests",
    message: "Too many requests",
});
exports.RequestHeaderFieldsTooLarge = define({
    status: 431,
    error: "request_header_fields_too_large",
    message: "Request header fields too large",
});
exports.UnavailableForLegalReasons = define({
    status: 451,
    error: "unavailable_for_legal_reasons",
    message: "Unavailable for legal reasons",
});
exports.InternalServerError = define({
    status: 500,
    error: "internal_error",
    message: "Internal server error",
});
exports.NotImplemented = define({
    status: 501,
    error: "not_implemented",
    message: "Not implemented",
});
exports.BadGateway = define({
    status: 502,
    error: "bad_gateway",
    message: "Bad gateway",
});
exports.ServiceUnavailable = define({
    status: 503,
    error: "service_unavailable",
    message: "Service unavailable",
});
exports.GatewayTimeout = define({
    status: 504,
    error: "gateway_timeout",
    message: "Gateway timeout",
});
function addPeriod(message) {
    return message.replace(/([^!?.])$/, "$1.");
}
//# sourceMappingURL=errors.js.map