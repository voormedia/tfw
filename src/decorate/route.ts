import proxyHandler from "./util/proxy-handler"
import routerify from "./util/routerify"

export interface RouteOptions {
  method: string
}

export interface ProxyOptions {
  methods?: string[]
  prepend?: boolean
}

type Decorator = (
  object: any,
  key?: string,
  descriptor?: PropertyDescriptor,
) => PropertyDescriptor

export function route(pattern: string, {method}: RouteOptions): Decorator {
  return (object: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) throw new TypeError("Property expected")
    descriptor.enumerable = true
    routerify(object).define(method, pattern, descriptor.value)
    return descriptor
  }
}

export function mount(pattern: string, controller: any) {
  return (object: any) => {
    const router = routerify(controller.prototype)
    routerify(object.prototype).mount(pattern, router)
  }
}

const DEFAULT_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
]

export function proxy(
  pattern: string,
  target: string,
  {methods = DEFAULT_METHODS, prepend = true}: ProxyOptions = {},
) {
  return (object: any) => {
    const handler = proxyHandler(target, {prepend})
    for (const method of methods) {
      routerify(object.prototype).define(method, pattern, handler, {
        prefix: true,
      })
    }
  }
}

function defineMethod(method: string) {
  return (pattern: string) => route(pattern, {method})
}

export const GET = defineMethod("GET")
export const DELETE = defineMethod("DELETE")
export const PATCH = defineMethod("PATCH")
export const POST = defineMethod("POST")
export const PUT = defineMethod("PUT")
