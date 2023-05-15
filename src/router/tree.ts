import Node, {NodeType} from "./node"
import Route, {RouteError} from "./route"

export interface NodeMatch {
  node?: Node
  params?: object
  path?: string
}

export default class Tree {
  private readonly root: Node = new Node()

  constructor() {
    Object.freeze(this)
  }

  match(parts: string[]): NodeMatch {
    /* Create object without prototype. */
    const params = Object.create(null)

    let node: Node | undefined = this.root
    let prefix = false
    let path = "/"

    for (const part of parts) {
      const next: Node | undefined = node.find(part)
      if (!next) {
        prefix = true
        break
      }

      node = next
      if (node.pattern) params[node.name] = part
      path = path.concat("/", part)
    }

    if (!node || node.type === NodeType.BRANCH) return {}
    if (prefix && node.type !== NodeType.PREFIX) return {}

    return {node, params, path}
  }

  insert(method: string, route: Route): Node {
    let node = this.root
    for (const part of route.parts) {
      node = node.insert(part.clone())
      if (node.name !== part.name) {
        throw new RouteError(
          method,
          route,
          `redefines existing parameter {${node.name}} as {${part.name}}`,
        )
      }
    }

    return node
  }

  *traverse(): Iterable<[Node, Node[]]> {
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
