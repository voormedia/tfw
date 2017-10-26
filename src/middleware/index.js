/* @flow */
import log from "./log"
import route from "./route"
import shutdown from "./shutdown"
import rescue from "./rescue"
import write from "./write"

export {
  log,
  route,
  shutdown,
  rescue,
  write,
}

import connect from "./connect"
import parseAuthorization from "./parse-authorization"
import parseBody from "./parse-body"
import parseQuery from "./parse-query"
import parseSession from "./parse-session"
import requireHost from "./require-host"
import requireTLS from "./require-tls"
import validateBody from "./validate-body"
import validateContentType from "./validate-content-type"

export {
  connect,
  parseAuthorization,
  parseBody,
  parseQuery,
  parseSession,
  requireHost,
  requireTLS,
  validateBody,
  validateContentType,
}

import type MiddlewareContext from "../app/context"

export type Next = () => Promise<void>
export type Middleware = (next: Next) => Promise<void>
export type Stack = Middleware[]
export type Context = MiddlewareContext
