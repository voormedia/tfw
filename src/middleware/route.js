/* @flow */
/* eslint-disable no-unused-expressions */
import Router from "../router"

import type {Context, Next, Middleware} from "../middleware"

export default function route(router: Router): Middleware {
  return function route(next: Next) {
    (this: Context)

    const url = this.url
    let method = this.method
    if (method === "HEAD") {
      /* Treat HEAD requests as GET. */
      method = "GET"
    }

    const {handler, params} = router.match(method, url)

    if (handler) {
      this.data.params = params

      if (handler.stack) this.stack.push(...handler.stack)
      this.stack.push(handler)
    }

    return next()
  }
}
