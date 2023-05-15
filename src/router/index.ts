import {inspect} from "util"

import Node, {NodeType} from "./node"
import Route, {RouteError} from "./route"
import Tree from "./tree"

export interface DefineOptions {
  prefix?: boolean
}

export interface RouterMatch {
  handler?: object
  params?: object
  path?: string
}

export default class Router {
  private readonly tree: Tree = new Tree()

  constructor() {
    Object.freeze(this)
  }

  define(
    method: string,
    pattern: string,
    handler: object,
    {prefix}: DefineOptions = {},
  ) {
    method = method.toUpperCase()
    const route = Route.parse(pattern)
    const type = prefix ? NodeType.PREFIX : NodeType.LEAF
    define(this.tree.insert(method, route), route, method, handler, type)
  }

  mount(pattern: string, router: Router) {
    for (const [{handlers, type}, path] of router.tree.traverse()) {
      const route = Route.create(path).prefix(pattern)
      for (const [method, handler] of handlers) {
        define(this.tree.insert(method, route), route, method, handler, type)
      }
    }
  }

  match(method: string, url: string): RouterMatch {
    method = method.toUpperCase()
    const {node, params, path} = this.tree.match(parse(url))
    if (!node) return {}

    const handler = node.handlers.get(method)
    if (!handler) return {}

    return {handler, params, path}
  }

  get routes(): Array<[string, Route]> {
    const routes = new Set<[string, Route]>()
    for (const [{handlers}, path] of this.tree.traverse()) {
      for (const method of handlers.keys()) {
        routes.add([method, Route.create(path)])
      }
    }

    return Array.from(routes)
  }

  get handlers(): object[] {
    const handlers = new Set<object>()
    for (const [node] of this.tree.traverse()) {
      for (const handler of node.handlers.values()) {
        handlers.add(handler)
      }
    }

    return Array.from(handlers)
  }

  [inspect.custom](): string {
    /* tslint:disable-next-line: no-unnecessary-callback-wrapper */
    const routes = this.routes.map(
      ([method, route]) => `${method} ${route.toString()}`,
    )
    return `[ ${routes.join(",\n  ")} ]`
  }
}

function define(
  node: Node,
  route: Route,
  method: string,
  handler: object,
  type: NodeType,
) {
  if (node.leaf && node.handlers.has(method)) {
    throw new RouteError(method, route, "already exists")
  }

  node.type = type
  node.handlers.set(method, handler)
}

function parse(url: string) {
  /* Remove leading slash. */
  if (url[0] === "/") url = url.slice(1)

  /* Remove query string. */
  url = url.split("?").shift()!

  /* Split url into path segments. */
  return url.split("/").filter(part => part !== "")
}
