export default class Node {
    name: string;
    pattern: RegExp | undefined;
    children: Map<string, Node>;
    patterns: Map<string, Node>;
    handler: object | undefined;
    leaf: boolean;
    constructor(name?: string, pattern?: RegExp);
    clone(): Node;
    find(part: string): Node | undefined;
    insert(node: Node): Node;
    readonly key: string;
    toString(): string;
}
