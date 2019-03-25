import {Context, Middleware, Next} from "../middleware"

import {NotFound} from "../errors"

export default function requireHost(...hosts: string[]): Middleware {
  return async function requireHost(this: Context, next: Next) {
    const host: string | undefined = this.request.headers.host

    if (host && hosts.includes(host)) return next()

    throw new NotFound("Endpoint does not exist")
  }
}
