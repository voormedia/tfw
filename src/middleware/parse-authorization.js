/* @flow */
import type {Context, Next, Middleware} from "../middleware"

export default function parseAuthorization(): Middleware {
  return function parseAuthorization(next: Next) {
    const ctx: Context = this

    const auth = this.req.headers.authorization

    if (auth) {
      const [type, credentials] = auth.split(/\s+/)

      if (type.toLowerCase() === "basic" && credentials) {
        const [username, password] = Buffer.from(credentials, "base64").toString().split(":")
        ctx.data.username = username || ""
        ctx.data.password = password || ""
      }
    }

    return next()
  }
}
