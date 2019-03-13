"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function use(middleware) {
    if (typeof middleware !== "function") {
        throw new TypeError("Middleware must be function");
    }
    if (middleware.length !== 1) {
        throw new TypeError("Middleware must take exactly 1 argument");
    }
    const fn = (object, key, descriptor) => {
        if (descriptor) {
            attach(descriptor.value, middleware);
            return descriptor;
        }
        else {
            attachRecursively(object.prototype, middleware);
        }
    };
    Object.defineProperty(fn, "name", { value: middleware.name });
    return fn;
}
exports.use = use;
function attachRecursively(object, middleware) {
    if (object.router) {
        for (const handler of object.router.handlers) {
            attach(handler, middleware);
        }
    }
}
function attach(handler, middleware) {
    if (typeof handler === "function") {
        stackify(handler).unshift(middleware);
    }
    else {
        throw new TypeError("Expected descriptor to be a function");
    }
}
function stackify(object) {
    if (!object.stack) {
        Object.defineProperty(object, "stack", {
            value: [],
        });
    }
    return object.stack;
}
//# sourceMappingURL=use.js.map