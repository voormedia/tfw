"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
function requireTLS() {
    return async function requireTLS(next) {
        const socket = this.request.socket;
        if (socket.encrypted)
            return next();
        if (this.get("x-forwarded-proto") === "https")
            return next();
        if (process.env.NODE_ENV === "development")
            return next();
        throw new errors_1.Forbidden("TLS required");
    };
}
exports.default = requireTLS;
//# sourceMappingURL=require-tls.js.map