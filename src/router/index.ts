import Node from "./node"
import Route, {RouteError} from "./route"
import Tree from "./tree"

export default class Router {
  private tree: Tree = new Tree

  constructor() {
    Object.freeze(this)
  }

  public define(method: string, pattern: string, handler?: object) {
    const route = Route.parse(method, pattern)
    define(this.tree.insert(route), route, handler)
  }

  public mount(pattern: string, router: Router) {
    for (const [{handler}, path] of router.tree.traverse()) {
      const route = Route.create(path).prefix(pattern)
      define(this.tree.insert(route), route, handler)
    }
  }

  public match(method: string, url: string): {handler?: object, params?: object} {
    const {node, params} = this.tree.match(parse(method, url))
    if (!node) return {}
    return {handler: node.handler || undefined, params}
  }

  get routes(): Route[] {
    const routes = new Set
    for (const [ , path] of this.tree.traverse()) {
      routes.add(Route.create(path))
    }
    return Array.from(routes)
  }

  get handlers(): object[] {
    const handlers = new Set
    for (const [node] of this.tree.traverse()) {
      if (node.handler) handlers.add(node.handler)
    }
    return Array.from(handlers)
  }

  public inspect(): string {
    const routes = this.routes.map((route) => route.inspect())
    return "[ " + routes.join(",\n  ") + " ]"
  }
}

function define(node: Node, route: Route, handler?: object) {
  if (node.leaf) throw new RouteError(route, "already exists")
  node.leaf = true
  node.handler = handler
}

function parse(method: string, url: string) {
  /* Remove leading slash. */
  if (url[0] === "/") url = url.slice(1)

  /* Remove query string. */
  url = url.split("?").shift()!

  /* Split url into path segments. */
  const parts = url.split("/").filter((part) => part !== "")
  return [method.toUpperCase()].concat(parts)
}
