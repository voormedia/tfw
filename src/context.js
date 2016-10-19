/* @flow */
import type {Stack} from "./middleware"
import type {Application} from "./application"
import type {IncomingMessage, ServerResponse} from "http"

export type Request = IncomingMessage
export type Response = ServerResponse

export class Context {
  app: Application
  stack: Stack
  req: Request
  res: Response

  data: Object = {}
  status: number = 200
  headers: Map<string, string> = new Map
  body: Object | string = ""
  stream: Function = () => {}

  constructor(app: Application, stack: Stack, req: Request, res: Response) {
    this.app = app
    this.stack = stack
    this.req = req
    this.res = res

    Object.seal(this)
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
