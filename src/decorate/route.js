/* @flow */
import routerify from "./util/routerify"

export type RouteOptions = {|
  method: string,
|}

export function route(pattern: string, {method}: RouteOptions): Decorator {
  return (object: Object, key: ?string, descriptor: ?PropertyDescriptor<string>) => {
    if (!descriptor) throw new TypeError("Property expected")
    descriptor.enumerable = true
    routerify(object).define(method, pattern, descriptor.value)
    return descriptor
  }
}

export function mount(pattern: string, controller: Object) {
  return (object: Object) => {
    const router = routerify(controller.prototype)
    routerify(object.prototype).mount(pattern, router)
  }
}

function defineMethod(method) {
  return (pattern: string) => route(pattern, {method})
}

export const GET = defineMethod("GET")
export const DELETE = defineMethod("DELETE")
export const PATCH = defineMethod("PATCH")
export const POST = defineMethod("POST")
export const PUT = defineMethod("PUT")
