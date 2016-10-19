/* @flow */
import Route, {RouteError} from "./route"
import Tree from "./tree"
import Node from "./node"

export default class Router {
  tree: Tree = new Tree

  constructor() {
    Object.freeze(this)
  }

  define(method: string, pattern: string, handler: ?Object = null) {
    const route = Route.parse(method, pattern)
    define(this.tree.insert(route), route, handler)
  }

  mount(pattern: string, router: Router) {
    for (const [{handler}, path] of router.tree.traverse()) {
      const route = Route.create(path).prefix(pattern)
      define(this.tree.insert(route), route, handler)
    }
  }

  match(method: string, url: string): {handler?: ?Object, params?: Object} {
    const {node, params} = this.tree.match(parse(method, url))
    if (!node) return {}
    return {handler: node.handler, params}
  }

  get routes(): Route[] {
    const routes = new Set
    for (const [ , path] of this.tree.traverse()) {
      routes.add(Route.create(path))
    }
    return Array.from(routes)
  }

  get handlers(): Object[] {
    const handlers = new Set
    for (const [node] of this.tree.traverse()) {
      if (node.handler) handlers.add(node.handler)
    }
    return Array.from(handlers)
  }

  inspect(): string {
    const routes = this.routes.map(route => route.inspect())
    return "[ " + routes.join(",\n  ") + " ]"
  }
}

function define(node: Node, route: Route, handler: ?Object) {
  if (node.leaf) throw new RouteError(route, "already exists")
  node.leaf = true
  node.handler = handler
}

function parse(method: string, url: string) {
  /* Remove leading slash. */
  if (url[0] === "/") url = url.slice(1)

  /* Remove query string. */
  url = url.split("?").shift()

  /* Split url into path segments. */
  const parts = url.split("/").filter(part => part !== "")
  return [method.toUpperCase()].concat(parts)
}
