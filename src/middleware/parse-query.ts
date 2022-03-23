import {URLSearchParams} from "url"

import {Context, Middleware, Next} from "../middleware"

export default function parseQuery(): Middleware {
  return async function parseQuery(this: Context, next: Next) {
    const search = this.url.split("?").slice(1).join("?")
    const params = Object.fromEntries(new URLSearchParams(search))

    if (this.data.params) {
      Object.assign(this.data.params, params)
    } else {
      this.data.params = params
    }

    return next()
  }
}
