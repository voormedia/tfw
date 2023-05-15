import {inspect} from "util"

import Node from "./node"

export class RouteError extends Error {
  constructor(method: string, route: Route, message: string) {
    super(`Route '${method} ${route.toString()}' ${message}`)

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
  static parse(route: string): Route {
    return new Route(parse(route))
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
    return new Route(parse(prefix).concat(this.parts))
  }

  get path(): string {
    return "/" + this.parts.map(part => part.toString()).join("/")
  }

  [inspect.custom](): string {
    return this.toString()
  }

  toString(): string {
    return this.path
  }
}

function parse(route: string) {
  const nodes: Node[] = []
  const params = new Set()

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
