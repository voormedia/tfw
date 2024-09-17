import log from "./log"
import rescue from "./rescue"
import route from "./route"
import shutdown from "./shutdown"
import write from "./write"

export {log, route, shutdown, rescue, write}

import addHeaders from "./add-headers"
import allowCors from "./allow-cors"
import bufferBody from "./buffer-body"
import connect from "./connect"
import exposeAllErrors from "./expose-all-errors"
import parseAuthorization from "./parse-authorization"
import parseBody from "./parse-body"
import parseQuery from "./parse-query"
import parseSession from "./parse-session"
import rateLimit from "./rate-limit"
import requireAuthorization from "./require-authorization"
import requireHost from "./require-host"
import requireTLS from "./require-tls"
import validateBody from "./validate-body"
import validateContentType from "./validate-content-type"

export {
  addHeaders,
  allowCors,
  bufferBody,
  connect,
  exposeAllErrors,
  parseAuthorization,
  parseBody,
  parseQuery,
  parseSession,
  rateLimit,
  requireAuthorization,
  requireHost,
  requireTLS,
  validateBody,
  validateContentType,
}

import MiddlewareContext, {Body} from "../app/context"

export type Next = () => Promise<void>
export type Middleware = (next: Next) => Promise<void>
export type Stack = Middleware[]
export type Context = MiddlewareContext
export {Body}
