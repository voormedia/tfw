import {randomBytes} from "crypto"
import {IncomingMessage as Request, ServerResponse as Response} from "http"
import {inspect} from "util"
import {Stack} from "../middleware"

export {Request, Response}

export type Body = Buffer | object | string
type AsyncBody = Promise<Body>

export interface Data {
  [key: string]: any
}

export class Context {
  stack: Stack
  request: Request
  response: Response

  body: Body | AsyncBody = ""
  data: Data = Object.create(null) as Data

  #traceId?: string

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

  // If user sends x-forwarded-for IP address, get the second to last IP address
  // which is original client IP
  get remoteIp(): string {
    const forwarded = this.get("x-forwarded-for")
    if (forwarded) {
      const ips = forwarded.split(",")
      return ips.length > 1 ? ips[ips.length - 2].trim() : ips[0].trim()
    }
    return this.request.socket.remoteAddress!
  }

  get traceId(): string {
    const findOrGenerate = () => {
      /* Request ID as forwarded by nginx. */
      const requestId = this.get("x-request-id")
      if (requestId) return requestId

      /* Trace context from GCP load balancers contains trace context in the
         form: <trace-id>/<span-id>. */
      const traceId = this.get("x-cloud-trace-context")?.split("/", 1)[0]
      if (traceId) return traceId

      /* Generate a request ID if none is forwarded to us. */
      return randomBytes(16).toString("hex")
    }

    if (!this.#traceId) {
      this.#traceId = findOrGenerate()
    }

    return this.#traceId
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
