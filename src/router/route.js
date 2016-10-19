/* @flow */
import Node from "./node"

export class RouteError extends Error {
  constructor(route: Route, message: string) {
    super(`Route '${route.toString()}' ${message}`)

    Error.captureStackTrace(this, this.constructor)
    Object.freeze(this)
  }
}

export class ParseError extends Error {
  constructor(pattern: string, message: string) {
    super(`Pattern '${pattern}' ${message}`)

    Error.captureStackTrace(this, this.constructor)
    Object.freeze(this)
  }
}

export default class Route {
  static parse(method: string, route: string): Route {
    method = method.toUpperCase()
    const parts = [new Node(method)].concat(parse(route))
    return new Route(parts)
  }

  static create(path: Node[]): Route {
    const parts = path.map(node => node.clone())
    return new Route(parts)
  }

  parts: Node[]

  constructor(parts: Node[]) {
    this.parts = parts

    for (const part of this.parts) Object.freeze(part)
    Object.freeze(this)
  }

  prefix(prefix: string): Route {
    const path = this.parts.slice(1)
    const parts = [this.parts[0]].concat(parse(prefix)).concat(path)
    return new Route(parts)
  }

  get method(): string {
    return this.parts[0].toString()
  }

  get path(): string {
    return "/" + this.parts.slice(1).map(part => part.toString()).join("/")
  }

  inspect(): string {
    return this.toString()
  }

  toString(): string {
    return `${this.method} ${this.path}`
  }
}

function parse(route: string) {
  const nodes: Node[] = []
  const params = new Set

  for (const part of route.split("/")) {
    if (!part.length) continue

    let node: Node
    if (part[0] === "{" && part[part.length - 1] === "}") {
      const param = part.substring(1, part.length - 1)
      if (params.has(param)) {
        throw new ParseError(route, `has duplicate param {${param}}`)
      }

      params.add(param)
      node = new Node(param, /.+/)
    } else {
      node = new Node(part)
    }

    nodes.push(node)
  }

  return nodes
}
