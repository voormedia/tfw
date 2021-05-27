/* eslint-disable no-unused-expressions */
import {ServerResponse} from "http"
import {Stream} from "stream"

import {Body, Context, Middleware, Next} from "../middleware"

export default function write(): Middleware {
  return async function write(this: Context, next: Next) {
    await next()

    Object.freeze(this)

    if (this.sent) return

    if (this.body instanceof Promise) {
      await sendAsync(this.response, this.body)
    } else {
      send(this.response, this.body)
    }
  }
}

async function sendAsync(response: ServerResponse, body: Promise<Body>) {
  response.writeHead(response.statusCode)
  send(response, await body)
}

function send(response: ServerResponse, body: Body) {
  /* tslint:disable-next-line: strict-type-predicates */
  if (body === null) {
    response.end()
  } else if (body instanceof Buffer) {
    response.end(body)
  } else if (body instanceof Stream) {
    body.pipe(response)
  } else if (typeof body === "string") {
    response.end(body, "utf8")
  } else {
    /* Treat as JSON. */
    if (!response.headersSent) {
      response.setHeader("Content-Type", "application/json")
    }

    response.end(JSON.stringify(body), "utf8")
  }
}
