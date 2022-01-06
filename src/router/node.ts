export enum NodeType {
  BRANCH,
  LEAF,
  PREFIX,
}

export default class Node {
  name: string
  pattern: RegExp | undefined = undefined

  children: Map<string, Node> = new Map
  patterns: Map<string, Node> = new Map
  handlers: Map<string, object> = new Map

  type = NodeType.BRANCH

  constructor(name: string = "", pattern?: RegExp) {
    this.name = name
    this.pattern = pattern

    Object.seal(this)
  }

  clone(): Node {
    return new Node(this.name, this.pattern)
  }

  find(part: string): Node | undefined {
    const node = this.children.get(part)
    if (node) return node

    for (const node of this.patterns.values()) {
      if (node.pattern && node.pattern.test(part)) return node
    }
  }

  insert(node: Node): Node {
    const {key} = node
    const collection = node.pattern ? this.patterns : this.children

    const orig = collection.get(key)
    if (orig) return orig

    collection.set(key, node)
    return node
  }

  get key(): string {
    return this.pattern ? this.pattern.source : this.name
  }

  get leaf(): boolean {
    return this.type !== NodeType.BRANCH
  }

  toString(): string {
    return this.pattern ? `{${this.name}}` : this.name
  }
}
