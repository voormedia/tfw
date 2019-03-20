"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
function parseQuery() {
    return async function parseQuery(next) {
        const search = this.url.split("?", 2)[1];
        const params = querystring.parse(search);
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