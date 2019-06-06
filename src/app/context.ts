import {IncomingMessage as Request, ServerResponse as Response} from "http"
import {inspect} from "util"
import {Stack} from "../middleware"

export {Request, Response}

export type Body = Buffer | object | string
type AsyncBody = Promise<Body>

export interface Data {
  [key: string]: any,
}

export class Context {
  stack: Stack
  request: Request
  response: Response

  body: Body | AsyncBody = ""
  data: Data = Object.create(null) as Data

  constructor(stack: Stack, request: Request, response: Response) {
    this.stack = stack
    this.request = request
    this.response = response
  }

  get(header: string): string | undefined {
    return this.request.headers[header.toLowerCase()] as string
  }

  get method(): string {
    return this.request.method!
  }

  get url(): string {
    return this.request.url!
  }

  set(header: string, value: string | number) {
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

  [inspect.custom]() {
    return {
      data: this.data,
      req: "<node req>",
      res: "<node res>",
      stack: this.stack,
    }
  }
}

export default Context
