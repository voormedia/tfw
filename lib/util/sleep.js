"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timer_1 = require("./timer");
async function sleep(time) {
    return new timer_1.Timer(time).sleep();
}
exports.default = sleep;
//# sourceMappingURL=sleep.js.map