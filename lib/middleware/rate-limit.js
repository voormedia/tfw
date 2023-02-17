"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
function rateLimit({ consume, message, if: iif }) {
    return async function rateLimit(next) {
        if (iif && !iif(this))
            return next();
        const ok = await consume(this.remoteIp);
        if (ok)
            return next();
        throw new errors_1.TooManyRequests(message);
    };
}
exports.default = rateLimit;
//# sourceMappingURL=rate-limit.js.map