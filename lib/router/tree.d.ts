import Node from "./node";
import Route from "./route";
export interface NodeMatch {
    node?: Node;
    params?: object;
    path?: string;
}
export default class Tree {
    private readonly root;
    constructor();
    match(parts: string[]): NodeMatch;
    insert(method: string, route: Route): Node;
    traverse(): Iterable<[Node, Node[]]>;
}
