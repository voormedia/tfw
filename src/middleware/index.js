/* @flow */
import log from "./log"
import route from "./route"
import write from "./write"

export {
  log,
  route,
  write,
}

import parseAuthorization from "./parse-authorization"
import parseBody from "./parse-body"
import parseSession from "./parse-session"
import requireTLS from "./require-tls"
import validateBody from "./validate-body"
import validateContentType from "./validate-content-type"

export {
  parseAuthorization,
  parseBody,
  parseSession,
  requireTLS,
  validateBody,
  validateContentType,
}

import type MiddlewareContext from "../context"

export type Next = () => Promise<void>
export type Middleware = (next: Next) => Promise<void>
export type Stack = Middleware[]
export type Context = MiddlewareContext
