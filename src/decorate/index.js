/* @flow */
export * from "./resource"
export * from "./route"
export * from "./start"
export * from "./use"
export * from "./when"

import {use} from "./use"

import requireTLSMiddleware from "../middleware/require-tls"
import parseAuthorizationMiddleware from "../middleware/parse-authorization"
import parseBodyMiddleware from "../middleware/parse-body"
import parseSessionMiddleware from "../middleware/parse-session"
import validateBodyMiddleware from "../middleware/validate-body"
import validateContentTypeMiddleware from "../middleware/validate-content-type"

export function requireTLS(...args) {
  return use(requireTLSMiddleware(...args))
}

export function parseAuthorization(...args) {
  return use(parseAuthorizationMiddleware(...args))
}

export function parseBody(...args) {
  return use(parseBodyMiddleware(...args))
}

export function parseSession(...args) {
  return use(parseSessionMiddleware(...args))
}

export function validateBody(...args) {
  return use(validateBodyMiddleware(...args))
}

export function validateContentType(...args) {
  return use(validateContentTypeMiddleware(...args))
}
