/* @flow */
import routerify from "./util/routerify"
import Application from "../application"

import type {ApplicationOptions} from "../application"

export function start(options: ApplicationOptions = Object.seal({})): Decorator {
  return (object: Object) => {
    options.router = routerify(object.prototype)
    Application.start(options)
  }
}
