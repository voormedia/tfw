"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = exports.POST = exports.PATCH = exports.DELETE = exports.GET = exports.mount = exports.route = void 0;
const routerify_1 = require("./util/routerify");
function route(pattern, { method }) {
    return (object, key, descriptor) => {
        if (!descriptor)
            throw new TypeError("Property expected");
        descriptor.enumerable = true;
        routerify_1.default(object).define(method, pattern, descriptor.value);
        return descriptor;
    };
}
exports.route = route;
function mount(pattern, controller) {
    return (object) => {
        const router = routerify_1.default(controller.prototype);
        routerify_1.default(object.prototype).mount(pattern, router);
    };
}
exports.mount = mount;
function defineMethod(method) {
    return (pattern) => route(pattern, { method });
}
exports.GET = defineMethod("GET");
exports.DELETE = defineMethod("DELETE");
exports.PATCH = defineMethod("PATCH");
exports.POST = defineMethod("POST");
exports.PUT = defineMethod("PUT");
//# sourceMappingURL=route.js.map