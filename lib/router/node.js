export var NodeType;
(function (NodeType) {
    NodeType[NodeType["BRANCH"] = 0] = "BRANCH";
    NodeType[NodeType["LEAF"] = 1] = "LEAF";
    NodeType[NodeType["PREFIX"] = 2] = "PREFIX";
})(NodeType || (NodeType = {}));
export default class Node {
    name;
    pattern = undefined;
    children = new Map();
    patterns = new Map();
    handlers = new Map();
    type = NodeType.BRANCH;
    constructor(name = "", pattern) {
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
//# sourceMappingURL=node.js.map