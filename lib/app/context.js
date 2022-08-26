"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Context_traceId;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.Response = exports.Request = void 0;
const crypto_1 = require("crypto");
const http_1 = require("http");
Object.defineProperty(exports, "Request", { enumerable: true, get: function () { return http_1.IncomingMessage; } });
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return http_1.ServerResponse; } });
const util_1 = require("util");
class Context {
    constructor(stack, request, response) {
        this.body = "";
        this.data = Object.create(null);
        _Context_traceId.set(this, void 0);
        this.stack = stack;
        this.request = request;
        this.response = response;
    }
    get(header) {
        return this.request.headers[header.toLowerCase()];
    }
    get method() {
        return this.request.method;
    }
    get url() {
        return this.request.url;
    }
    get remoteIp() {
        const forwarded = this.get("x-forwarded-for");
        return forwarded ?
            forwarded.split(",").shift() :
            this.request.socket.remoteAddress;
    }
    get traceId() {
        const findOrGenerate = () => {
            var _a;
            /* Request ID as forwarded by nginx. */
            const requestId = this.get("x-request-id");
            if (requestId)
                return requestId;
            /* Trace context from GCP load balancers contains trace context in the
               form: <trace-id>/<span-id>. */
            const traceId = (_a = this.get("x-cloud-trace-context")) === null || _a === void 0 ? void 0 : _a.split("/", 1)[0];
            if (traceId)
                return traceId;
            /* Generate a request ID if none is forwarded to us. */
            return (0, crypto_1.randomBytes)(16).toString("hex");
        };
        if (!__classPrivateFieldGet(this, _Context_traceId, "f")) {
            __classPrivateFieldSet(this, _Context_traceId, findOrGenerate(), "f");
        }
        return __classPrivateFieldGet(this, _Context_traceId, "f");
    }
    set(header, value) {
        this.response.setHeader(header, value);
    }
    set status(value) {
        if (value < 100 || value > 999) {
            throw new RangeError(`Invalid status code ${value}`);
        }
        this.response.statusCode = value;
    }
    get sent() {
        return this.response.headersSent;
    }
    [(_Context_traceId = new WeakMap(), util_1.inspect.custom)]() {
        return {
            data: this.data,
            req: "<node req>",
            res: "<node res>",
            stack: this.stack,
        };
    }
}
exports.Context = Context;
exports.default = Context;
//# sourceMappingURL=context.js.map