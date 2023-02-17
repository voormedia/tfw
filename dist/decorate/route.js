import proxyHandler from "./util/proxy-handler";
import routerify from "./util/routerify";
export function route(pattern, { method }) {
    return (object, key, descriptor) => {
        if (!descriptor)
            throw new TypeError("Property expected");
        descriptor.enumerable = true;
        routerify(object).define(method, pattern, descriptor.value);
        return descriptor;
    };
}
export function mount(pattern, controller) {
    return (object) => {
        const router = routerify(controller.prototype);
        routerify(object.prototype).mount(pattern, router);
    };
}
const DEFAULT_METHODS = ["get", "post", "put", "patch", "delete", "head", "options"];
export function proxy(pattern, target, { methods = DEFAULT_METHODS, prepend = true } = {}) {
    return (object) => {
        const handler = proxyHandler(target, { prepend });
        for (const method of methods) {
            routerify(object.prototype).define(method, pattern, handler, { prefix: true });
        }
    };
}
function defineMethod(method) {
    return (pattern) => route(pattern, { method });
}
export const GET = defineMethod("GET");
export const DELETE = defineMethod("DELETE");
export const PATCH = defineMethod("PATCH");
export const POST = defineMethod("POST");
export const PUT = defineMethod("PUT");
//# sourceMappingURL=route.js.map