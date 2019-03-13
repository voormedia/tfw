export default class Node {
  public name: string
  public pattern: RegExp | undefined = undefined

  public children: Map<string, Node> = new Map
  public patterns: Map<string, Node> = new Map

  public handler: object | undefined = undefined
  public leaf: boolean = false

  constructor(name: string = "", pattern?: RegExp) {
    this.name = name
    this.pattern = pattern

    Object.seal(this)
  }

  public clone(): Node {
    return new Node(this.name, this.pattern)
  }

  public find(part: string): Node | undefined {
    const node = this.children.get(part)
    if (node) return node

    for (const node of this.patterns.values()) {
      if (node.pattern && node.pattern.test(part)) return node
    }
  }

  public insert(node: Node): Node {
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

  public toString(): string {
    return this.pattern ? `{${this.name}}` : this.name
  }
}
