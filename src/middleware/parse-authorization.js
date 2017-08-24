/* @flow */
/* eslint-disable no-unused-expressions */
import {BadRequest} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

export default function parseAuthorization(): Middleware {
  return function parseAuthorization(next: Next) {
    (this: Context)

    const auth = this.get("authorization")

    if (auth) {
      const [type, credentials] = auth.split(/\s+/)

      if (type.toLowerCase() === "basic" && credentials) {
        const decoded = Buffer.from(credentials, "base64").toString("utf8")

        /* https://tools.ietf.org/html/rfc7617#section-2.1:
           "The user-id and password MUST NOT contain any control characters" */
        if (decoded.search(/[\x00-\x1F]/) >= 0) {
          throw new BadRequest("Bad authorization header")
        }

        const [username, password] = decoded.split(":")
        this.data.username = username || ""
        this.data.password = password || ""
      }
    }

    return next()
  }
}
