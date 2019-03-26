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
    return body => {
        if (validate(body))
            return [];
        const results = [];
        for (const error of validate.errors) {
            const path = fmtPath(error.dataPath);
            switch (error.keyword) {
                case "type": {
                    const expected = error.params.type.split(",")[0];
                    results.push({ error: "invalid_type", path, expected });
                    break;
                }
                case "format": {
                    const expected = error.params.format;
                    results.push({ error: "invalid_format", path, expected });
                    break;
                }
                case "enum": {
                    const expected = error.params.allowedValues;
                    results.push({ error: "invalid_value", path, expected });
                    break;
                }
                case "additionalProperties": {
                    const unknown = error.params.additionalProperty;
                    results.push({ error: "unknown", path: path ? `${path}.${unknown}` : unknown });
                    break;
                }
                case "required": {
                    const required = error.params.missingProperty;
                    results.push({ error: "required", path: path ? `${path}.${required}` : required });
                    break;
                }
                case "minimum":
                case "exclusiveMinimum":
                case "maximum":
                case "exclusiveMaximum": {
                    const { limit, comparison: operator } = error.params;
                    results.push({ error: "invalid_range", path, limit, operator });
                    break;
                }
                case "minLength": {
                    const limit = error.params.limit;
                    results.push({ error: "invalid_length", path, limit, operator: ">=" });
                    break;
                }
                case "maxLength": {
                    const limit = error.params.limit;
                    results.push({ error: "invalid_length", path, limit, operator: "<=" });
                    break;
                }
                /* Ignore spurious errors regarding failing if/then/else. */
                case "if": break;
                default: {
                    results.push({ error: "other", path });
                }
            }
        }
        return results;
    };
}
exports.createValidator = createValidator;
function createSimpleValidator(schema) {
    const validate = createValidator(schema);
    return body => simplifyResults(validate(body));
}
exports.createSimpleValidator = createSimpleValidator;
const fmtProp = (prop) => `'${prop}'`;
const fmtPath = (path) => path ? path.slice(1) : undefined;
const fmtPlural = (word, count) => `${word}${count > 1 ? "s" : ""}`;
const fmtOperator = (input) => {
    switch (input) {
        case ">=": return "at least";
        case "<=": return "at most";
        case ">": return "more than";
        case "<": return "less than";
        default: return "";
    }
};
function simplifyResults(results) {
    const simplified = [];
    const requireds = new Map();
    const unknowns = new Map();
    for (const result of results) {
        switch (result.error) {
            case "unknown":
            case "required": {
                const [key, ...parts] = (result.path || "").split(".").reverse();
                const parent = parts.length ? `'${parts.reverse().join(".")}'` : "request body";
                const map = result.error === "unknown" ? unknowns : requireds;
                if (map.has(parent)) {
                    map.get(parent).push(`'${key}'`);
                }
                else {
                    map.set(parent, [`'${key}'`]);
                }
                break;
            }
            default:
                const path = result.path ? `'${result.path}'` : "request body";
                simplified.push(`${path} ${messageForError(result)}`);
        }
    }
    for (const [path, keys] of requireds) {
        simplified.push(`${path} requires key${keys.length > 1 ? "s" : ""} ${keys.join(", ")}`);
    }
    for (const [path, keys] of unknowns) {
        simplified.push(`${path} has unknown key${keys.length > 1 ? "s" : ""} ${keys.join(", ")}`);
    }
    return simplified;
}
exports.simplifyResults = simplifyResults;
function messageForError(result, length = 1) {
    switch (result.error) {
        case "unknown":
            return `requires ${fmtPlural("key", length)}`;
        case "required":
            return `has unknown ${fmtPlural("key", length)}`;
        case "invalid_type":
            return `should be ${result.expected}`;
        case "invalid_value":
            return `should be ${result.expected.length > 1 ? "one of " : ""}${result.expected.map(fmtProp).join(", ")}`;
        case "invalid_format":
            let format = result.expected;
            switch (format) {
                case "email":
                    format = "email address";
                    break;
                case "rfc2822-datetime":
                    format = "rfc 2822 date-time";
                    break;
                default:
            }
            return `should be formatted as ${format}`;
        case "invalid_range":
            return `should be ${fmtOperator(result.operator)} ${result.limit}`;
        case "invalid_length":
            return `should be ${fmtOperator(result.operator)} ${result.limit} ${fmtPlural("character", result.limit)}`;
        default:
            return "failed constraint";
    }
}
//# sourceMappingURL=schema-validator.js.map