"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
function parseQuery() {
    return async function parseQuery(next) {
        const search = this.url.split("?", 2)[1];
        const params = Object.fromEntries(new url_1.URLSearchParams(search));
        if (this.data.params) {
            Object.assign(this.data.params, params);
        }
        else {
            this.data.params = params;
        }
        return next();
    };
}
exports.default = parseQuery;
//# sourceMappingURL=parse-query.js.map