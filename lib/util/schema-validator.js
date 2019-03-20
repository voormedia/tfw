"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajv = require("ajv");
const instance = ajv({
    allErrors: true,
});
instance.addFormat("rfc2822-datetime", 
/* Based on http://regexlib.com/REDetails.aspx?regexp_id=969 */
/^((Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+)?(0?[1-9]|[1-2][0-9]|3[01])\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(19[0-9]{2}|[2-9][0-9]{3}|[0-9]{2})\s+(2[0-3]|[0-1][0-9]):([0-5][0-9])(:(60|[0-5][0-9]))?\s+([-+][0-9]{2}[0-5][0-9]|(UT|GMT|(E|C|M|P)(ST|DT)|[A-IK-Z]))$/);
/* Force default metadata schema to be computed to avoid warnings when
   adding the select and switch keywords. */
instance.validateSchema({});
function createValidator(schema) {
    const validate = instance.compile(schema);
    return (body) => {
        if (validate(body))
            return [];
        const grouped = groupErrors(validate);
        const messages = new Set;
        for (const [, errors] of grouped) {
            const [error] = errors;
            const path = fmtPath(error.dataPath);
            switch (error.keyword) {
                case "type": {
                    const type = error.params.type;
                    messages.add(`${path} should be ${type}`);
                    break;
                }
                case "enum": {
                    const allowedValues = error.params.allowedValues;
                    const values = allowedValues.map(fmtProp).join(", ");
                    messages.add(`${path} should be ${allowedValues.length > 1 ? "one of " : ""}${values}`);
                    break;
                }
                case "additionalProperties": {
                    const unknown = errors.map((err) => fmtProp(err.params.additionalProperty)).join(", ");
                    messages.add(`${path} has unknown ${fmtPlural("key", errors.length)} ${unknown}`);
                    break;
                }
                case "required": {
                    const missing = errors.map((err) => fmtProp(err.params.missingProperty)).join(", ");
                    messages.add(`${path} requires ${fmtPlural("key", errors.length)} ${missing}`);
                    break;
                }
                case "minimum": {
                    const limit = error.params.limit;
                    messages.add(`${path} should be at least ${limit}`);
                    break;
                }
                case "exclusiveMinimum": {
                    const limit = error.params.limit;
                    messages.add(`${path} should be more than ${limit}`);
                    break;
                }
                case "maximum": {
                    const limit = error.params.limit;
                    messages.add(`${path} should be at most ${limit}`);
                    break;
                }
                case "exclusiveMaximum": {
                    const limit = error.params.limit;
                    messages.add(`${path} should be less than ${limit}`);
                    break;
                }
                case "format": {
                    let format = error.params.format;
                    switch (format) {
                        case "email":
                            format = "email address";
                            break;
                        case "rfc2822-datetime":
                            format = "rfc 2822 date-time";
                            break;
                        default:
                    }
                    messages.add(`${path} should be formatted as ${format}`);
                    break;
                }
                case "minLength": {
                    const limit = error.params.limit;
                    messages.add(`${path} should be at least ${limit} ${fmtPlural("character", limit)}`);
                    break;
                }
                case "maxLength": {
                    const limit = error.params.limit;
                    messages.add(`${path} should be at most ${limit} ${fmtPlural("character", limit)}`);
                    break;
                }
                /* Ignore spurious errors regarding failing if/then/else. */
                case "if": break;
                default:
                    messages.add(`${path} failed constraint`);
            }
        }
        return [...messages];
    };
}
exports.createValidator = createValidator;
function groupErrors(validate) {
    const grouped = new Map();
    for (const error of validate.errors || []) {
        const key = `${error.schemaPath}:${error.dataPath}`;
        let set = grouped.get(key);
        if (!set) {
            set = [];
            grouped.set(key, set);
        }
        set.push(error);
    }
    return grouped;
}
const fmtProp = (prop) => `'${prop}'`;
const fmtPath = (path) => path ? `'${path.slice(1)}'` : "request body";
const fmtPlural = (word, count) => `${word}${count > 1 ? "s" : ""}`;
//# sourceMappingURL=schema-validator.js.map