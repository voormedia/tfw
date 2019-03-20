"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contentType = require("content-type");
const errors_1 = require("../errors");
function validateContentType(expected) {
    return async function validateContentType(next) {
        if (this.request.headers["content-length"] || this.request.headers["content-encoding"]) {
            /* If there is a body and no Content-Type, we are allowed to assume
               application/octet-stream: https://tools.ietf.org/html/rfc7231#section-3.1.1.5 */
            const { type } = contentType.parse(this.request.headers["content-type"] || "application/octet-stream");
            if (type !== expected) {
                throw new errors_1.UnsupportedMediaType(`Please use ${expected} content type`);
            }
        }
        return next();
    };
}
exports.default = validateContentType;
//# sourceMappingURL=validate-content-type.js.map