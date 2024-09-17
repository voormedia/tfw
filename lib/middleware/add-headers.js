"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addHeaders(headers = {}) {
    return async function addHeaders(next) {
        for (const [key, value] of Object.entries(headers)) {
            this.set(key, value);
        }
        return next();
    };
}
exports.default = addHeaders;
//# sourceMappingURL=add-headers.js.map