"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContentType = exports.validateBody = exports.requireTLS = exports.requireHost = exports.requireAuthorization = exports.rateLimit = exports.parseSession = exports.parseQuery = exports.parseBody = exports.parseAuthorization = exports.exposeAllErrors = exports.connect = exports.bufferBody = exports.allowCors = void 0;
__exportStar(require("./resource"), exports);
__exportStar(require("./route"), exports);
__exportStar(require("./start"), exports);
__exportStar(require("./use"), exports);
__exportStar(require("./when"), exports);
const use_1 = require("./use");
const allow_cors_1 = require("../middleware/allow-cors");
const buffer_body_1 = require("../middleware/buffer-body");
const connect_1 = require("../middleware/connect");
const expose_all_errors_1 = require("../middleware/expose-all-errors");
const parse_authorization_1 = require("../middleware/parse-authorization");
const parse_body_1 = require("../middleware/parse-body");
const parse_query_1 = require("../middleware/parse-query");
const parse_session_1 = require("../middleware/parse-session");
const rate_limit_1 = require("../middleware/rate-limit");
const require_authorization_1 = require("../middleware/require-authorization");
const require_host_1 = require("../middleware/require-host");
const require_tls_1 = require("../middleware/require-tls");
const validate_body_1 = require("../middleware/validate-body");
const validate_content_type_1 = require("../middleware/validate-content-type");
function allowCors(options) {
    return (0, use_1.use)((0, allow_cors_1.default)(options));
}
exports.allowCors = allowCors;
function bufferBody() {
    return (0, use_1.use)((0, buffer_body_1.default)());
}
exports.bufferBody = bufferBody;
function connect(middleware) {
    return (0, use_1.use)((0, connect_1.default)(middleware));
}
exports.connect = connect;
function exposeAllErrors() {
    return (0, use_1.use)((0, expose_all_errors_1.default)());
}
exports.exposeAllErrors = exposeAllErrors;
function parseAuthorization() {
    return (0, use_1.use)((0, parse_authorization_1.default)());
}
exports.parseAuthorization = parseAuthorization;
function parseBody() {
    return (0, use_1.use)((0, buffer_body_1.default)(), (0, parse_body_1.default)());
}
exports.parseBody = parseBody;
function parseQuery() {
    return (0, use_1.use)((0, parse_query_1.default)());
}
exports.parseQuery = parseQuery;
function parseSession(options) {
    return (0, use_1.use)((0, parse_session_1.default)(options));
}
exports.parseSession = parseSession;
function rateLimit(options) {
    return (0, use_1.use)((0, rate_limit_1.default)(options));
}
exports.rateLimit = rateLimit;
function requireAuthorization(realm, credentials) {
    return (0, use_1.use)((0, require_authorization_1.default)(realm, credentials));
}
exports.requireAuthorization = requireAuthorization;
function requireHost(...hosts) {
    return (0, use_1.use)((0, require_host_1.default)(...hosts));
}
exports.requireHost = requireHost;
function requireTLS() {
    return (0, use_1.use)((0, require_tls_1.default)());
}
exports.requireTLS = requireTLS;
function validateBody(options) {
    return (0, use_1.use)((0, buffer_body_1.default)(), (0, parse_body_1.default)(options), (0, validate_body_1.default)(options));
}
exports.validateBody = validateBody;
function validateContentType(expected) {
    return (0, use_1.use)((0, validate_content_type_1.default)(expected));
}
exports.validateContentType = validateContentType;
//# sourceMappingURL=index.js.map