/* @flow */
import Node from "./node"
import Route from "./route"

export default class Tree {
  root: Node = new Node

  constructor() {
    Object.freeze(this)
  }

  match(parts: string[]): {node?: Node, params?: Object} {
    const params = Object.create(null)

    let node = this.root
    for (const part of parts) {
      node = node.find(part)
      if (!node) break
      if (node.pattern) params[node.name] = part
    }

    if (!node || !node.leaf) return {}
    return {node, params}
  }

  insert(route: Route): Node {
    let node = this.root
    for (const part of route.parts) {
      node = node.insert(part.clone())
    }

    return node
  }

  *traverse(): Iterable<[Node, Node[]]> {
    const stack = [[this.root]]

    while (stack.length) {
      const path = stack.pop()
      const node = path[path.length - 1]

      const children = [...Array.from(node.children.values()), ...Array.from(node.patterns.values())]
      for (const node of children) {
        stack.push(path.concat([node]))
      }

      if (node.leaf) yield [node, path.slice(1)]
    }
  }
}
