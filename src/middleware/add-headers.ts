import {Context, Middleware, Next} from "../middleware"

export default function addHeaders(
  headers: Record<string, string | number> = {},
): Middleware {
  return async function addHeaders(this: Context, next: Next) {
    for (const [key, value] of Object.entries(headers)) {
      this.set(key, value)
    }

    return next()
  }
}
