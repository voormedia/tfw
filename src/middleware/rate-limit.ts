import {Context, Middleware, Next} from "../middleware"

import {TooManyRequests} from "../errors"

export interface RateLimitOptions {
  consume(ip: string): Promise<boolean>
  message?: string
  if?(ctx: Context): boolean
}

export default function rateLimit({
  consume,
  message,
  if: iif,
}: RateLimitOptions): Middleware {
  return async function rateLimit(this: Context, next: Next) {
    if (iif && !iif(this)) return next()

    const ok = await consume(this.remoteIp)

    if (ok) return next()
    throw new TooManyRequests(message)
  }
}
