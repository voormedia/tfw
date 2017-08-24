/* @flow */
import type {Stack} from "./middleware"
import type {Application} from "./application"
import type {IncomingMessage, ServerResponse} from "http"

export type Request = IncomingMessage
export type Response = ServerResponse

export class Context {
  app: Application
  stack: Stack

  request: Request
  response: Response

  body: Object | string = ""
  data: Object = {}

  constructor(app: Application, stack: Stack, req: IncomingMessage, res: ServerResponse) {
    this.app = app
    this.stack = stack

    this.request = req
    this.response = res

    Object.seal(this)
  }

  get(header: string) {
    return this.request.headers[header.toLowerCase()]
  }

  get method(): string {
    return this.request.method
  }

  get url(): string {
    return this.request.url
  }

  set(header: string, value: string) {
    this.response.setHeader(header, value)
  }

  set status(value: number) {
    if (value < 100 || value > 999) {
      throw new RangeError(`Invalid status code ${value}`)
    }

    this.response.statusCode = value
  }

  get sent(): boolean {
    return this.response.headersSent
  }

  inspect() {
    return {
      stack: this.stack,
      data: this.data,
      app: "<app>",
      req: "<node req>",
      res: "<node res>",
    }
  }
}

export default Context
