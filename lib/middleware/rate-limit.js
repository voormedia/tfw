"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
function rateLimit({ consume, message }) {
    return async function rateLimit(next) {
        const ok = await consume(this.remoteIp);
        if (ok)
            return next();
        throw new errors_1.TooManyRequests(message);
    };
}
exports.default = rateLimit;
//# sourceMappingURL=rate-limit.js.map