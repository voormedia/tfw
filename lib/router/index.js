import { inspect } from "util";
import { NodeType } from "./node";
import Route, { RouteError } from "./route";
import Tree from "./tree";
export default class Router {
    tree = new Tree();
    constructor() {
        Object.freeze(this);
    }
    define(method, pattern, handler, { prefix } = {}) {
        method = method.toUpperCase();
        const route = Route.parse(pattern);
        const type = prefix ? NodeType.PREFIX : NodeType.LEAF;
        define(this.tree.insert(method, route), route, method, handler, type);
    }
    mount(pattern, router) {
        for (const [{ handlers, type }, path] of router.tree.traverse()) {
            const route = Route.create(path).prefix(pattern);
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
                routes.add([method, Route.create(path)]);
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
    [inspect.custom]() {
        /* tslint:disable-next-line: no-unnecessary-callback-wrapper */
        const routes = this.routes.map(([method, route]) => `${method} ${route.toString()}`);
        return `[ ${routes.join(",\n  ")} ]`;
    }
}
function define(node, route, method, handler, type) {
    if (node.leaf && node.handlers.has(method)) {
        throw new RouteError(method, route, "already exists");
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