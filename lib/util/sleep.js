"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timer_1 = require("./timer");
function sleep(time) {
    return new timer_1.default(time).sleep();
}
exports.default = sleep;
//# sourceMappingURL=sleep.js.map