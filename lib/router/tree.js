"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const route_1 = require("./route");
class Tree {
    constructor() {
        this.root = new node_1.default;
        Object.freeze(this);
    }
    match(parts) {
        /* Create object without prototype. */
        const params = Object.create(null);
        let node = this.root;
        for (const part of parts) {
            node = node.find(part);
            if (!node)
                break;
            if (node.pattern)
                params[node.name] = part;
        }
        if (!node || !node.leaf)
            return {};
        return { node, params };
    }
    insert(route) {
        let node = this.root;
        for (const part of route.parts) {
            node = node.insert(part.clone());
            if (node.name !== part.name) {
                throw new route_1.RouteError(route, `redefines existing parameter {${node.name}} as {${part.name}}`);
            }
        }
        return node;
    }
    *traverse() {
        const stack = [[this.root]];
        while (stack.length) {
            const path = stack.pop();
            const node = path[path.length - 1];
            const children = [
                ...Array.from(node.children.values()),
                ...Array.from(node.patterns.values()),
            ];
            for (const node of children) {
                stack.push(path.concat([node]));
            }
            if (node.leaf)
                yield [node, path.slice(1)];
        }
    }
}
exports.default = Tree;
//# sourceMappingURL=tree.js.map