export function use(...middlewares) {
    for (const middleware of middlewares) {
        /* tslint:disable-next-line: strict-type-predicates */
        if (typeof middleware !== "function") {
            throw new TypeError("Middleware must be function");
        }
        if (middleware.length !== 1) {
            throw new TypeError("Middleware must take exactly 1 argument");
        }
    }
    const fn = (object, key, descriptor) => {
        if (descriptor) {
            attach(descriptor.value, middlewares);
            return descriptor;
        }
        attachRecursively(object.prototype, middlewares);
    };
    Object.defineProperty(fn, "name", { value: middlewares.map(mw => mw.name).join("/") });
    return fn;
}
function attachRecursively(object, middlewares) {
    if (object.router) {
        for (const handler of object.router.handlers) {
            attach(handler, middlewares);
        }
    }
}
function attach(handler, middlewares) {
    if (typeof handler === "function") {
        stackify(handler).unshift(...middlewares);
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