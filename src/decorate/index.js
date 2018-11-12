/* @flow */
export * from "./resource"
export * from "./route"
export * from "./start"
export * from "./use"
export * from "./when"

import {use} from "./use"

import connectMiddleware from "../middleware/connect"
import exposeAllErrorsMiddleware from "../middleware/expose-all-errors"
import parseAuthorizationMiddleware from "../middleware/parse-authorization"
import parseBodyMiddleware from "../middleware/parse-body"
import parseQueryMiddleware from "../middleware/parse-query"
import parseSessionMiddleware from "../middleware/parse-session"
import requireAuthorizationMiddleware from "../middleware/require-authorization"
import requireHostMiddleware from "../middleware/require-host"
import requireTLSMiddleware from "../middleware/require-tls"
import validateBodyMiddleware from "../middleware/validate-body"
import validateContentTypeMiddleware from "../middleware/validate-content-type"

export function connect(...args: any[]) {
  return use(connectMiddleware(...args))
}

export function exposeAllErrors(...args: any[]) {
  return use(exposeAllErrorsMiddleware(...args))
}

export function parseAuthorization(...args: any[]) {
  return use(parseAuthorizationMiddleware(...args))
}

export function parseBody(...args: any[]) {
  return use(parseBodyMiddleware(...args))
}

export function parseQuery(...args: any[]) {
  return use(parseQueryMiddleware(...args))
}

export function parseSession(...args: any[]) {
  return use(parseSessionMiddleware(...args))
}

export function requireAuthorization(...args: any[]) {
  return use(requireAuthorizationMiddleware(...args))
}

export function requireHost(...args: any[]) {
  return use(requireHostMiddleware(...args))
}

export function requireTLS(...args: any[]) {
  return use(requireTLSMiddleware(...args))
}

export function validateBody(...args: any[]) {
  return use(validateBodyMiddleware(...args))
}

export function validateContentType(...args: any[]) {
  return use(validateContentTypeMiddleware(...args))
}
