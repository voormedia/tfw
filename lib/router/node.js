"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeType = void 0;
var NodeType;
(function (NodeType) {
    NodeType[NodeType["BRANCH"] = 0] = "BRANCH";
    NodeType[NodeType["LEAF"] = 1] = "LEAF";
    NodeType[NodeType["PREFIX"] = 2] = "PREFIX";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
class Node {
    constructor(name = "", pattern) {
        this.pattern = undefined;
        this.children = new Map;
        this.patterns = new Map;
        this.handlers = new Map;
        this.type = NodeType.BRANCH;
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
    get leaf() {
        return this.type !== NodeType.BRANCH;
    }
    toString() {
        return this.pattern ? `{${this.name}}` : this.name;
    }
}
exports.default = Node;
//# sourceMappingURL=node.js.map