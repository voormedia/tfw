"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
function requireHost(...hosts) {
    return function requireHost(next) {
        const host = this.request.headers.host;
        if (host && hosts.includes(host))
            return next();
        throw new errors_1.NotFound("Endpoint does not exist");
    };
}
exports.default = requireHost;
//# sourceMappingURL=require-host.js.map