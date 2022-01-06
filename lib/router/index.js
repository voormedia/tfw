"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const node_1 = require("./node");
const route_1 = require("./route");
const tree_1 = require("./tree");
class Router {
    constructor() {
        this.tree = new tree_1.default;
        Object.freeze(this);
    }
    define(method, pattern, handler, { prefix } = {}) {
        method = method.toUpperCase();
        const route = route_1.default.parse(pattern);
        const type = prefix ? node_1.NodeType.PREFIX : node_1.NodeType.LEAF;
        define(this.tree.insert(method, route), route, method, handler, type);
    }
    mount(pattern, router) {
        for (const [{ handlers, type }, path] of router.tree.traverse()) {
            const route = route_1.default.create(path).prefix(pattern);
            for (const [method, handler] of handlers) {
                define(this.tree.insert(method, route), route, method, handler, type);
            }
        }
    }
    match(method, url) {
        method = method.toUpperCase();
        const { node, params, path } = this.tree.match(parse(url));
        if (!node)
            return {};
        const handler = node.handlers.get(method);
        if (!handler)
            return {};
        return { handler, params, path };
    }
    get routes() {
        const routes = new Set();
        for (const [{ handlers }, path] of this.tree.traverse()) {
            for (const method of handlers.keys()) {
                routes.add([method, route_1.default.create(path)]);
            }
        }
        return Array.from(routes);
    }
    get handlers() {
        const handlers = new Set();
        for (const [node] of this.tree.traverse()) {
            for (const handler of node.handlers.values()) {
                handlers.add(handler);
            }
        }
        return Array.from(handlers);
    }
    [util_1.inspect.custom]() {
        /* tslint:disable-next-line: no-unnecessary-callback-wrapper */
        const routes = this.routes.map(([method, route]) => `${method} ${route.toString()}`);
        return `[ ${routes.join(",\n  ")} ]`;
    }
}
exports.default = Router;
function define(node, route, method, handler, type) {
    if (node.leaf && node.handlers.has(method)) {
        throw new route_1.RouteError(method, route, "already exists");
    }
    node.type = type;
    node.handlers.set(method, handler);
}
function parse(url) {
    /* Remove leading slash. */
    if (url[0] === "/")
        url = url.slice(1);
    /* Remove query string. */
    url = url.split("?").shift();
    /* Split url into path segments. */
    return url.split("/").filter(part => part !== "");
}
//# sourceMappingURL=index.js.map