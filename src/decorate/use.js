/* @flow */
import type {Middleware} from "../middleware"

export function use(middleware: Middleware): Decorator {
  if (typeof middleware !== "function") {
    throw new TypeError("Middleware must be function")
  }

  if (middleware.length !== 1) {
    throw new TypeError("Middleware must take exactly 1 argument")
  }

  const fn = (object: Object, key: ?string, descriptor: ?PropertyDescriptor<string>) => {
    if (descriptor) {
      attach(descriptor.value, middleware)
    } else {
      attachRecursively(object.prototype, middleware)
    }
  }

  Object.defineProperty(fn, "name", {value: middleware.name})
  return fn
}

function attachRecursively(object: Object, middleware: Middleware) {
  if (object.router) {
    for (const handler of object.router.handlers) {
      attach(handler, middleware)
    }
  }
}

function attach(handler: mixed, middleware: Middleware) {
  if (typeof handler === "function") {
    stackify(handler).unshift(middleware)
  } else {
    throw new TypeError("Expected descriptor to be a function")
  }
}

function stackify(object: Function) {
  if (!object.stack) {
    Object.defineProperty(object, "stack", {
      value: [],
    })
  }

  return object.stack
}
