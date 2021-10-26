"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const routerify_1 = require("./util/routerify");
const application_1 = require("../application");
function start(options = {}) {
    return (object) => {
        options.router = (0, routerify_1.default)(object.prototype);
        object.instance = application_1.default.start(options);
    };
}
exports.start = start;
//# sourceMappingURL=start.js.map