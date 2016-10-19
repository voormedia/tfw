/* @flow */
import Router from "../../router"

export default function routerify(object: Object) {
  if (!object.router) {
    Object.defineProperty(object, "router", {
      value: new Router,
    })
  }

  return object.router
}
