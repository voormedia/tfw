import {Context, Middleware, Next} from "../middleware"

import {TooManyRequests} from "../errors"

export interface RateLimitOptions {
  consume(ip: string): Promise<boolean>,
  message?: string,
}

export default function rateLimit({consume, message}: RateLimitOptions): Middleware {
  return async function rateLimit(this: Context, next: Next) {
    const ok = await consume(this.remoteIp)

    if (ok) return next()
    throw new TooManyRequests(message)
  }
}
