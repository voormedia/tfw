"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(name = "", pattern) {
        this.pattern = undefined;
        this.children = new Map;
        this.patterns = new Map;
        this.handler = undefined;
        this.leaf = false;
        this.name = name;
        this.pattern = pattern;
        Object.seal(this);
    }
    clone() {
        return new Node(this.name, this.pattern);
    }
    find(part) {
        const node = this.children.get(part);
        if (node)
            return node;
        for (const node of this.patterns.values()) {
            if (node.pattern && node.pattern.test(part))
                return node;
        }
    }
    insert(node) {
        const { key } = node;
        const collection = node.pattern ? this.patterns : this.children;
        const orig = collection.get(key);
        if (orig)
            return orig;
        collection.set(key, node);
        return node;
    }
    get key() {
        return this.pattern ? this.pattern.source : this.name;
    }
    toString() {
        return this.pattern ? `{${this.name}}` : this.name;
    }
}
exports.default = Node;
//# sourceMappingURL=node.js.map