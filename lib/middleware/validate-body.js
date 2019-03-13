"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_validator_1 = require("../util/schema-validator");
const errors_1 = require("../errors");
function validateBody(options) {
    const validator = schema_validator_1.createValidator(options.schema);
    return function validateBody(next) {
        validate(validator, this.data.body, options);
        return next();
    };
}
exports.default = validateBody;
function validate(validator, body, { message = "Request is invalid", details = true, optional = false, }) {
    /* Don't validate non-JSON bodies if the request schema is optional. */
    if (body === undefined || Buffer.isBuffer(body)) {
        if (optional)
            return;
        /* Validate empty body. */
        body = {};
    }
    const errors = validator(body);
    if (errors.length) {
        if (details) {
            throw new errors_1.BadRequest(`${message}: ${errors.join("; ")}`);
        }
        else {
            throw new errors_1.BadRequest(message);
        }
    }
}
//# sourceMappingURL=validate-body.js.map