import Router from "../router"

import {Context, Middleware, Next} from "../middleware"

export default function route(router: Router): Middleware {
  return async function route(this: Context, next: Next) {
    const url = this.url
    let method = this.method
    if (method === "HEAD") {
      /* Treat HEAD requests as GET. */
      method = "GET"
    }

    const {handler, params} = router.match(method, url)

    if (handler) {
      this.data.params = params

      if ((handler as any).stack) {
        this.stack.push(...(handler as any).stack)
      }

      this.stack.push(handler as Middleware)
    }

    return next()
  }
}
