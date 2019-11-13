import { ValidationResult } from "../util/schema-validator";
import { BadRequest } from "../errors";
import { Middleware } from "../middleware";
export { ValidationResult };
export interface ValidationOptions {
    schema: object;
    optional?: boolean;
    details?: boolean;
    message?: string;
}
export default function validateBody(options: ValidationOptions): Middleware;
export declare class ValidationError extends BadRequest {
    details: ValidationResult[];
    constructor(details: ValidationResult[]);
    toJSON(): {
        details: ValidationResult[];
        error: "invalid_request";
        message: string;
    };
}
