"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../../router");
function routerify(object) {
    if (!object.router) {
        Object.defineProperty(object, "router", {
            value: new router_1.default,
        });
    }
    return object.router;
}
exports.default = routerify;
//# sourceMappingURL=routerify.js.map