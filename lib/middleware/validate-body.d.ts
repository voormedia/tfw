import { ValidationResult } from "../util/schema-validator";
import { BadRequest } from "../errors";
import { Middleware } from "../middleware";
export interface ValidationOptions {
    schema: object;
    message: string;
    details: boolean;
    optional: boolean;
}
export default function validateBody(options: ValidationOptions): Middleware;
export declare class ValidationError extends BadRequest {
    details: ValidationResult[];
    constructor(message: string, details: ValidationResult[]);
    toJSON(): {
        details: (import("../util/schema-validator").Unknown | import("../util/schema-validator").Required | import("../util/schema-validator").InvalidType | import("../util/schema-validator").InvalidValue | import("../util/schema-validator").InvalidFormat | import("../util/schema-validator").InvalidRange | import("../util/schema-validator").InvalidLength | import("../util/schema-validator").Other)[];
        error: "invalid_request";
        message: string;
    };
}
