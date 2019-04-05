"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
exports.Request = http_1.IncomingMessage;
exports.Response = http_1.ServerResponse;
class Context {
    constructor(stack, request, response) {
        this.body = "";
        this.data = Object.create(null);
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
    inspect() {
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