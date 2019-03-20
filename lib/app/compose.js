"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
function compose(stack, context) {
    const iterator = stack.values();
    return async function next() {
        const handler = iterator.next().value;
        /* Check if a handler is present and valid. */
        if (!handler) {
            throw new errors_1.NotFound("Endpoint does not exist");
        }
        /* tslint:disable-next-line: strict-type-predicates */
        if (typeof handler !== "function") {
            throw new errors_1.InternalServerError("Bad handler");
        }
        // ES7: return context::handler(next)
        return handler.call(context, next);
    };
}
exports.default = compose;
//# sourceMappingURL=compose.js.map