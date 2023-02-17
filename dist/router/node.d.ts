export declare enum NodeType {
    BRANCH = 0,
    LEAF = 1,
    PREFIX = 2
}
export default class Node {
    name: string;
    pattern: RegExp | undefined;
    children: Map<string, Node>;
    patterns: Map<string, Node>;
    handlers: Map<string, object>;
    type: NodeType;
    constructor(name?: string, pattern?: RegExp);
    clone(): Node;
    find(part: string): Node | undefined;
    insert(node: Node): Node;
    get key(): string;
    get leaf(): boolean;
    toString(): string;
}
