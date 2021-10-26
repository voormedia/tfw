export * from "./resource"
export * from "./route"
export * from "./start"
export * from "./use"
export * from "./when"

import {use} from "./use"

import allowCorsMiddleware, {AllowCorsOptions} from "../middleware/allow-cors"
import bufferBodyMiddleware from "../middleware/buffer-body"
import connectMiddleware, {ConnectMiddleware} from "../middleware/connect"
import exposeAllErrorsMiddleware from "../middleware/expose-all-errors"
import parseAuthorizationMiddleware from "../middleware/parse-authorization"
import parseBodyMiddleware, {BodyOptions} from "../middleware/parse-body"
import parseQueryMiddleware from "../middleware/parse-query"
import parseSessionMiddleware, {SessionOptions} from "../middleware/parse-session"
import requireAuthorizationMiddleware, {Credentials} from "../middleware/require-authorization"
import requireHostMiddleware from "../middleware/require-host"
import requireTLSMiddleware from "../middleware/require-tls"
import validateBodyMiddleware, {ValidationOptions} from "../middleware/validate-body"
import validateContentTypeMiddleware from "../middleware/validate-content-type"

export function allowCors(options: AllowCorsOptions) {
  return use(allowCorsMiddleware(options))
}

export function bufferBody() {
  return use(bufferBodyMiddleware())
}

export function connect(middleware: ConnectMiddleware) {
  return use(connectMiddleware(middleware))
}

export function exposeAllErrors() {
  return use(exposeAllErrorsMiddleware())
}

export function parseAuthorization() {
  return use(parseAuthorizationMiddleware())
}

export function parseQuery() {
  return use(parseQueryMiddleware())
}

export function parseSession(options: SessionOptions) {
  return use(parseSessionMiddleware(options))
}

export function requireAuthorization(realm: string, credentials: Credentials) {
  return use(requireAuthorizationMiddleware(realm, credentials))
}

export function requireHost(...hosts: string[]) {
  return use(requireHostMiddleware(...hosts))
}

export function requireTLS() {
  return use(requireTLSMiddleware())
}

export function validateBody(options: ValidationOptions & BodyOptions) {
  return use(bufferBodyMiddleware(), parseBodyMiddleware(options), validateBodyMiddleware(options))
}

export function validateContentType(expected: string) {
  return use(validateContentTypeMiddleware(expected))
}
