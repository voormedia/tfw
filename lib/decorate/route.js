"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = exports.POST = exports.PATCH = exports.DELETE = exports.GET = exports.proxy = exports.mount = exports.route = void 0;
const proxy_handler_1 = require("./util/proxy-handler");
const routerify_1 = require("./util/routerify");
function route(pattern, { method }) {
    return (object, key, descriptor) => {
        if (!descriptor)
            throw new TypeError("Property expected");
        descriptor.enumerable = true;
        (0, routerify_1.default)(object).define(method, pattern, descriptor.value);
        return descriptor;
    };
}
exports.route = route;
function mount(pattern, controller) {
    return (object) => {
        const router = (0, routerify_1.default)(controller.prototype);
        (0, routerify_1.default)(object.prototype).mount(pattern, router);
    };
}
exports.mount = mount;
const DEFAULT_METHODS = ["get", "post", "put", "patch", "delete", "head", "options"];
function proxy(pattern, target, { methods = DEFAULT_METHODS, prepend = true } = {}) {
    return (object) => {
        const handler = (0, proxy_handler_1.default)(target, { prepend });
        for (const method of methods) {
            (0, routerify_1.default)(object.prototype).define(method, pattern, handler, { prefix: true });
        }
    };
}
exports.proxy = proxy;
function defineMethod(method) {
    return (pattern) => route(pattern, { method });
}
exports.GET = defineMethod("GET");
exports.DELETE = defineMethod("DELETE");
exports.PATCH = defineMethod("PATCH");
exports.POST = defineMethod("POST");
exports.PUT = defineMethod("PUT");
//# sourceMappingURL=route.js.map