export * from "./resource";
export * from "./route";
export * from "./start";
export * from "./use";
export * from "./when";
import { use } from "./use";
import allowCorsMiddleware from "../middleware/allow-cors";
import bufferBodyMiddleware from "../middleware/buffer-body";
import connectMiddleware from "../middleware/connect";
import exposeAllErrorsMiddleware from "../middleware/expose-all-errors";
import parseAuthorizationMiddleware from "../middleware/parse-authorization";
import parseBodyMiddleware from "../middleware/parse-body";
import parseQueryMiddleware from "../middleware/parse-query";
import parseSessionMiddleware from "../middleware/parse-session";
import rateLimitMiddleware from "../middleware/rate-limit";
import requireAuthorizationMiddleware from "../middleware/require-authorization";
import requireHostMiddleware from "../middleware/require-host";
import requireTLSMiddleware from "../middleware/require-tls";
import validateBodyMiddleware from "../middleware/validate-body";
import validateContentTypeMiddleware from "../middleware/validate-content-type";
export function allowCors(options) {
    return use(allowCorsMiddleware(options));
}
export function bufferBody() {
    return use(bufferBodyMiddleware());
}
export function connect(middleware) {
    return use(connectMiddleware(middleware));
}
export function exposeAllErrors() {
    return use(exposeAllErrorsMiddleware());
}
export function parseAuthorization() {
    return use(parseAuthorizationMiddleware());
}
export function parseBody() {
    return use(bufferBodyMiddleware(), parseBodyMiddleware());
}
export function parseQuery() {
    return use(parseQueryMiddleware());
}
export function parseSession(options) {
    return use(parseSessionMiddleware(options));
}
export function rateLimit(options) {
    return use(rateLimitMiddleware(options));
}
export function requireAuthorization(realm, credentials) {
    return use(requireAuthorizationMiddleware(realm, credentials));
}
export function requireHost(...hosts) {
    return use(requireHostMiddleware(...hosts));
}
export function requireTLS() {
    return use(requireTLSMiddleware());
}
export function validateBody(options) {
    return use(bufferBodyMiddleware(), parseBodyMiddleware(options), validateBodyMiddleware(options));
}
export function validateContentType(expected) {
    return use(validateContentTypeMiddleware(expected));
}
//# sourceMappingURL=index.js.map