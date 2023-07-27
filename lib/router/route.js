"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseError = exports.RouteError = void 0;
const util_1 = require("util");
const node_1 = require("./node");
class RouteError extends Error {
    constructor(method, route, message) {
        super(`Route '${method} ${route.toString()}' ${message}`);
        Error.captureStackTrace(this, this.constructor);
        Object.freeze(this);
    }
}
exports.RouteError = RouteError;
class ParseError extends Error {
    constructor(pattern, message) {
        super(`Pattern '${pattern}' ${message}`);
        Error.captureStackTrace(this, this.constructor);
        Object.freeze(this);
    }
}
exports.ParseError = ParseError;
class Route {
    static parse(route) {
        return new Route(parse(route));
    }
    static create(path) {
        const parts = path.map(node => node.clone());
        return new Route(parts);
    }
    constructor(parts) {
        this.parts = parts;
        for (const part of this.parts)
            Object.freeze(part);
        Object.freeze(this);
    }
    prefix(prefix) {
        return new Route(parse(prefix).concat(this.parts));
    }
    get path() {
        return "/" + this.parts.map(part => part.toString()).join("/");
    }
    [util_1.inspect.custom]() {
        return this.toString();
    }
    toString() {
        return this.path;
    }
}
exports.default = Route;
function parse(route) {
    const nodes = [];
    const params = new Set;
    for (const part of route.split("/")) {
        if (!part.length)
            continue;
        let node;
        if (part[0] === "{" && part[part.length - 1] === "}") {
            const param = part.substring(1, part.length - 1);
            if (params.has(param)) {
                throw new ParseError(route, `has duplicate param {${param}}`);
            }
            params.add(param);
            node = new node_1.default(param, /.+/);
        }
        else {
            node = new node_1.default(part);
        }
        nodes.push(node);
    }
    return nodes;
}
//# sourceMappingURL=route.js.map