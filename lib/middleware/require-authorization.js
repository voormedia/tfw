"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const errors_1 = require("../errors");
function requireAuthorization(realm, credentials) {
    return async function requireAuthorization(next) {
        const { username, password } = this.data;
        if (username) {
            const expected = credentials[username];
            if (safeEqual(password, expected)) {
                return next();
            }
        }
        this.set("WWW-Authenticate", `Basic realm="${realm}"`);
        throw new errors_1.Unauthorized;
    };
}
exports.default = requireAuthorization;
function safeEqual(a, b) {
    return a !== undefined && b !== undefined && a.length === b.length &&
        crypto_1.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
//# sourceMappingURL=require-authorization.js.map