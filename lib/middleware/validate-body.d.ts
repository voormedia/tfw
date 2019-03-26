import { ValidationResult } from "../util/schema-validator";
import { BadRequest } from "../errors";
import { Middleware } from "../middleware";
export { ValidationResult };
export interface ValidationOptions {
    schema: object;
    details?: boolean;
    optional?: boolean;
    message?: string;
}
export default function validateBody(options: ValidationOptions): Middleware;
export declare class ValidationError extends BadRequest {
    details: ValidationResult[];
    constructor(details: ValidationResult[]);
    toJSON(): {
        details: (import("../util/schema-validator").Success | import("../util/schema-validator").UnknownField | import("../util/schema-validator").RequiredField | import("../util/schema-validator").InvalidType | import("../util/schema-validator").InvalidValue | import("../util/schema-validator").InvalidFormat | import("../util/schema-validator").InvalidRange | import("../util/schema-validator").InvalidLength | import("../util/schema-validator").BlockedValue | import("../util/schema-validator").OtherFailure)[];
        error: "invalid_request";
        message: string;
    };
}
