/* @flow */
import Router from "../router"

import type {Context, Next, Middleware} from "../middleware"

export default function route(router: Router): Middleware {
  return function route(next: Next) {
    const ctx: Context = this

    let {method, url} = ctx.req

    if (method === "HEAD") {
      /* Treat HEAD requests as GET. */
      method = "GET"
    }

    const {handler, params} = router.match(method, url)

    if (handler) {
      ctx.data.params = params

      if (handler.stack) ctx.stack.push(...handler.stack)
      ctx.stack.push(handler)
    }

    return next()
  }
}
