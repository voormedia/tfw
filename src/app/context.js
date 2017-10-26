/* @flow */
import type {Stack} from "../middleware"
import type {IncomingMessage as Request, ServerResponse as Response} from "http"

export type {Request, Response}

export class Context {
  stack: Stack
  request: Request
  response: Response

  body: Object | string = ""
  data: Object = Object.create(null)

  constructor(stack: Stack, request: Request, response: Response) {
    this.stack = stack
    this.request = request
    this.response = response

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
      req: "<node req>",
      res: "<node res>",
    }
  }
}

export default Context
