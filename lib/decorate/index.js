"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./resource"));
__export(require("./route"));
__export(require("./start"));
__export(require("./use"));
__export(require("./when"));
const use_1 = require("./use");
const allow_cors_1 = require("../middleware/allow-cors");
const connect_1 = require("../middleware/connect");
const expose_all_errors_1 = require("../middleware/expose-all-errors");
const parse_authorization_1 = require("../middleware/parse-authorization");
const parse_body_1 = require("../middleware/parse-body");
const parse_query_1 = require("../middleware/parse-query");
const parse_session_1 = require("../middleware/parse-session");
const require_authorization_1 = require("../middleware/require-authorization");
const require_host_1 = require("../middleware/require-host");
const require_tls_1 = require("../middleware/require-tls");
const validate_body_1 = require("../middleware/validate-body");
const validate_content_type_1 = require("../middleware/validate-content-type");
function allowCors(options) {
    return use_1.use(allow_cors_1.default(options));
}
exports.allowCors = allowCors;
function connect(middleware) {
    return use_1.use(connect_1.default(middleware));
}
exports.connect = connect;
function exposeAllErrors() {
    return use_1.use(expose_all_errors_1.default());
}
exports.exposeAllErrors = exposeAllErrors;
function parseAuthorization() {
    return use_1.use(parse_authorization_1.default());
}
exports.parseAuthorization = parseAuthorization;
function parseBody() {
    return use_1.use(parse_body_1.default());
}
exports.parseBody = parseBody;
function parseQuery() {
    return use_1.use(parse_query_1.default());
}
exports.parseQuery = parseQuery;
function parseSession(options) {
    return use_1.use(parse_session_1.default(options));
}
exports.parseSession = parseSession;
function requireAuthorization(realm, credentials) {
    return use_1.use(require_authorization_1.default(realm, credentials));
}
exports.requireAuthorization = requireAuthorization;
function requireHost(...hosts) {
    return use_1.use(require_host_1.default(...hosts));
}
exports.requireHost = requireHost;
function requireTLS() {
    return use_1.use(require_tls_1.default());
}
exports.requireTLS = requireTLS;
function validateBody(options) {
    return use_1.use(parse_body_1.default(), validate_body_1.default(options));
}
exports.validateBody = validateBody;
function validateContentType(expected) {
    return use_1.use(validate_content_type_1.default(expected));
}
exports.validateContentType = validateContentType;
//# sourceMappingURL=index.js.map