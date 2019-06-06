"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_validator_1 = require("../util/schema-validator");
const errors_1 = require("../errors");
function validateBody(options) {
    const validator = schema_validator_1.createValidator(options.schema);
    return async function validateBody(next) {
        validate(validator, this.data.body, options);
        return next();
    };
}
exports.default = validateBody;
function validate(validator, body, { message = errors_1.BadRequest.defaultMessage, details = true, optional = false, }) {
    /* Don't validate non-JSON bodies if the request schema is optional. */
    /* tslint:disable-next-line: strict-type-predicates */
    if (body === undefined || Buffer.isBuffer(body)) {
        if (optional)
            return;
        /* Validate empty body. */
        body = {};
    }
    const errors = validator(body);
    if (errors.length) {
        throw details ? new ValidationError(...errors) : new errors_1.BadRequest(message);
    }
}
class ValidationError extends errors_1.BadRequest {
    constructor(...details) {
        super(`${errors_1.BadRequest.defaultMessage.replace(/\.$/, ":")} ${schema_validator_1.simplifyResults(details).join("; ")}`);
        this.details = details;
    }
    toJSON() {
        return Object.assign({}, super.toJSON(), { details: this.details });
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validate-body.js.map