"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(message) {
        super();
        this.expose = true;
        /* Error message without trailing period. */
        this.message = message ? message.replace(/\.?$/, "") : "Unknown reason";
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
function defineError(status, error) {
    return class extends HttpError {
        constructor(message = error) {
            super(message);
            this.status = status;
            this.error = error;
        }
    };
}
/* https://github.com/nodejs/node/blob/master/lib/_http_server.js */
/* tslint:disable:variable-name */
exports.BadRequest = defineError(400, "Bad request");
exports.Unauthorized = defineError(401, "Unauthorized");
exports.PaymentRequired = defineError(402, "Payment required");
exports.Forbidden = defineError(403, "Forbidden");
exports.NotFound = defineError(404, "Not found");
exports.MethodNotAllowed = defineError(405, "Method not allowed");
exports.NotAcceptable = defineError(406, "Not acceptable");
exports.ProxyAuthenticationRequired = defineError(407, "Proxy authentication required");
exports.RequestTimeout = defineError(408, "Request timeout");
exports.Conflict = defineError(409, "Conflict");
exports.Gone = defineError(410, "Gone");
exports.LengthRequired = defineError(411, "Length required");
exports.PreconditionFailed = defineError(412, "Precondition failed");
exports.RequestEntityTooLarge = defineError(413, "Request entity too large");
exports.RequestURITooLong = defineError(414, "Request URI too long");
exports.UnsupportedMediaType = defineError(415, "Unsupported media type");
exports.RangeNotSatisfiable = defineError(416, "Range not satisfiable");
exports.ExpectationFailed = defineError(417, "Expectation failed");
exports.ImATeapot = defineError(418, "I'm a teapot");
exports.MisdirectedRequest = defineError(421, "Misdirected request");
exports.UnprocessableEntity = defineError(422, "Unprocessable entity");
exports.Locked = defineError(423, "Locked");
exports.FailedDependency = defineError(424, "Failed dependency");
exports.UpgradeRequired = defineError(426, "Upgrade required");
exports.PreconditionRequired = defineError(428, "Precondition required");
exports.TooManyRequests = defineError(429, "Too many requests");
exports.RequestHeaderFieldsTooLarge = defineError(431, "Request header fields too large");
exports.UnavailableForLegalReasons = defineError(451, "Unavailable for legal reasons");
exports.InternalServerError = defineError(500, "Internal server error");
exports.NotImplemented = defineError(501, "Not implemented");
exports.BadGateway = defineError(502, "Bad gateway");
exports.ServiceUnavailable = defineError(503, "Service unavailable");
exports.GatewayTimeout = defineError(504, "Gateway timeout");
//# sourceMappingURL=errors.js.map