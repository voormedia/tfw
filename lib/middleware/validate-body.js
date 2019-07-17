"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_validator_1 = require("../util/schema-validator");
const errors_1 = require("../errors");
function validateBody(options) {
    const validator = schema_validator_1.createValidator(options.schema);
    /* TODO: This should probably be deprecated and any caller should provide
       a custom toError() function to create a new error instance. */
    if (options.details === false && !options.toError) {
        options.toError = () => new errors_1.BadRequest();
    }
    return async function validateBody(next) {
        validate(validator, this.data.body, options);
        return next();
    };
}
exports.default = validateBody;
function validate(validator, body, { optional = false, toError = details => new ValidationError(...details), }) {
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
        throw toError(errors);
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