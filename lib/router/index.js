"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const tree_1 = require("./tree");
class Router {
    constructor() {
        this.tree = new tree_1.default;
        Object.freeze(this);
    }
    define(method, pattern, handler) {
        const route = route_1.default.parse(method, pattern);
        define(this.tree.insert(route), route, handler);
    }
    mount(pattern, router) {
        for (const [{ handler }, path] of router.tree.traverse()) {
            const route = route_1.default.create(path).prefix(pattern);
            define(this.tree.insert(route), route, handler);
        }
    }
    match(method, url) {
        const { node, params } = this.tree.match(parse(method, url));
        if (!node)
            return {};
        return { handler: node.handler || undefined, params };
    }
    get routes() {
        const routes = new Set();
        for (const [, path] of this.tree.traverse()) {
            routes.add(route_1.default.create(path));
        }
        return Array.from(routes);
    }
    get handlers() {
        const handlers = new Set();
        for (const [node] of this.tree.traverse()) {
            if (node.handler)
                handlers.add(node.handler);
        }
        return Array.from(handlers);
    }
    inspect() {
        const routes = this.routes.map(route => route.inspect());
        return `[ ${routes.join(",\n  ")} ]`;
    }
}
exports.default = Router;
function define(node, route, handler) {
    if (node.leaf)
        throw new route_1.RouteError(route, "already exists");
    node.leaf = true;
    node.handler = handler;
}
function parse(method, url) {
    /* Remove leading slash. */
    if (url[0] === "/")
        url = url.slice(1);
    /* Remove query string. */
    url = url.split("?").shift();
    /* Split url into path segments. */
    const parts = url.split("/").filter(part => part !== "");
    return [method.toUpperCase()].concat(parts);
}
//# sourceMappingURL=index.js.map