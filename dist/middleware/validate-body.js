import { createValidator, simplifyResults } from "../util/schema-validator";
import { BadRequest } from "../errors";
export default function validateBody(options) {
    const validator = createValidator(options.schema);
    return async function validateBody(next) {
        validate(validator, this.data.body, options);
        return next();
    };
}
function validate(validator, body, { optional = false, details = true, message, }) {
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
        throw details ? new ValidationError(errors) : new BadRequest(message);
    }
}
export class ValidationError extends BadRequest {
    details;
    constructor(details) {
        super(`${BadRequest.defaultMessage.replace(/\.$/, ":")} ${simplifyResults(details).join("; ")}`);
        this.details = details;
    }
    toJSON() {
        return { ...super.toJSON(), details: this.details };
    }
}
//# sourceMappingURL=validate-body.js.map