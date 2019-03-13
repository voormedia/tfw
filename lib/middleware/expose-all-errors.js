"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
function exposeAllErrors() {
    return async function exposeAllErrors(next) {
        try {
            await next();
        }
        catch (err) {
            if (err instanceof Error) {
                /* Add specific JSON serialization to the error and make it exposable. */
                if (!err.toJSON) {
                    err.toJSON = toJSON;
                }
                err.expose = true;
                throw err;
            }
            else {
                /* Wrap anything that's not an Error but that pretends to be one. */
                throw new errors_1.InternalServerError(err.message || err.Message || err);
            }
        }
    };
}
exports.default = exposeAllErrors;
const { error } = new errors_1.InternalServerError();
function toJSON() {
    /* TODO: Include stack? {stack: this.stack.split(/\n\s+/)} */
    return { error, message: this.message };
}
//# sourceMappingURL=expose-all-errors.js.map