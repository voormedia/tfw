import Node from "./node";
import Route from "./route";
export default class Tree {
    private readonly root;
    constructor();
    match(parts: string[]): {
        node?: Node;
        params?: object;
    };
    insert(route: Route): Node;
    traverse(): Iterable<[Node, Node[]]>;
}
