import routerify from "./util/routerify"

export interface RouteOptions {
  method: string,
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

function defineMethod(method: string) {
  return (pattern: string) => route(pattern, {method})
}

export const GET = defineMethod("GET")
export const DELETE = defineMethod("DELETE")
export const PATCH = defineMethod("PATCH")
export const POST = defineMethod("POST")
export const PUT = defineMethod("PUT")
