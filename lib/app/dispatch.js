"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compose_1 = require("./compose");
const context_1 = require("./context");
function dispatch(initialStack) {
    return function dispatch(request, response) {
        const stack = initialStack.slice(0);
        const handler = compose_1.default(stack, new context_1.Context(stack, request, response));
        Promise.resolve(handler()).catch(err => {
            process.nextTick(() => { throw err; });
        });
    };
}
exports.default = dispatch;
//# sourceMappingURL=dispatch.js.map