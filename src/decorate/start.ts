import routerify from "./util/routerify"

import Application, {ApplicationOptions} from "../application"

type Decorator = (object: any) => void

export function start(options: ApplicationOptions = {}): Decorator {
  return (object: any) => {
    options.router = routerify(object.prototype)
    object.instance = Application.start(options)
  }
}
