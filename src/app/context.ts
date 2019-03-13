import {IncomingMessage as Request, ServerResponse as Response} from "http"
import {Stack} from "../middleware"

export {Request, Response}

export type Body = Buffer | object | string

export interface Data {
  [key: string]: any,
}

export class Context {
  public stack: Stack
  public request: Request
  public response: Response

  public body: Body = ""
  public data: Data = Object.create(null)

  constructor(stack: Stack, request: Request, response: Response) {
    this.stack = stack
    this.request = request
    this.response = response

    Object.seal(this)
  }

  public get(header: string): string | undefined {
    return this.request.headers[header.toLowerCase()] as string
  }

  get method(): string {
    return this.request.method!
  }

  get url(): string {
    return this.request.url!
  }

  public set(header: string, value: string | number) {
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

  public inspect() {
    return {
      data: this.data,
      req: "<node req>",
      res: "<node res>",
      stack: this.stack,
    }
  }
}

export default Context
