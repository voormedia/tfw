import Node from "./node"
import Route, {RouteError} from "./route"

export default class Tree {
  private root: Node = new Node

  constructor() {
    Object.freeze(this)
  }

  public match(parts: string[]): {node?: Node, params?: object} {
    /* Create object without prototype. */
    const params = Object.create(null)

    let node: Node | undefined = this.root
    for (const part of parts) {
      node = node.find(part)
      if (!node) break
      if (node.pattern) params[node.name] = part
    }

    if (!node || !node.leaf) return {}
    return {node, params}
  }

  public insert(route: Route): Node {
    let node = this.root
    for (const part of route.parts) {
      node = node.insert(part.clone())
      if (node.name !== part.name) {
        throw new RouteError(route, `redefines existing parameter {${node.name}} as {${part.name}}`)
      }
    }

    return node
  }

  public *traverse(): Iterable<[Node, Node[]]> {
    const stack = [[this.root]]

    while (stack.length) {
      const path = stack.pop()!
      const node = path[path.length - 1]

      const children = [
        ...Array.from(node.children.values()),
        ...Array.from(node.patterns.values()),
      ]

      for (const node of children) {
        stack.push(path.concat([node]))
      }

      if (node.leaf) yield [node, path.slice(1)]
    }
  }
}
