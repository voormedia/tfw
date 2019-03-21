import {Middleware} from "../middleware"

type Decorator = (
  object: any,
  key?: string,
  descriptor?: PropertyDescriptor,
) => void

export function use(middleware: Middleware): Decorator {
  /* tslint:disable-next-line: strict-type-predicates */
  if (typeof middleware !== "function") {
    throw new TypeError("Middleware must be function")
  }

  if (middleware.length !== 1) {
    throw new TypeError("Middleware must take exactly 1 argument")
  }

  const fn = (object: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      attach(descriptor.value, middleware)
      return descriptor
    } else {
      attachRecursively(object.prototype, middleware)
    }
  }

  Object.defineProperty(fn, "name", {value: middleware.name})
  return fn
}

function attachRecursively(object: any, middleware: Middleware) {
  if (object.router) {
    for (const handler of object.router.handlers) {
      attach(handler, middleware)
    }
  }
}

function attach(handler: any, middleware: Middleware) {
  if (typeof handler === "function") {
    stackify(handler).unshift(middleware)
  } else {
    throw new TypeError("Expected descriptor to be a function")
  }
}

function stackify(object: any) {
  if (!object.stack) {
    Object.defineProperty(object, "stack", {
      value: [],
    })
  }

  return object.stack
}
