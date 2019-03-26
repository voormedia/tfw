export declare type SimpleValidator = (body: object) => string[];
export declare type Validator = (body: object) => ValidationResult[];
export declare function createValidator(schema: object): Validator;
export declare function createSimpleValidator(schema: object): SimpleValidator;
export declare function simplifyResults(results: ValidationResult[]): string[];
export interface Success {
    error: undefined;
}
interface Error {
    path?: string;
    error: string;
    message?: string;
}
export interface UnknownField extends Error {
    error: "unknown";
}
export interface RequiredField extends Error {
    error: "required";
}
export interface InvalidType extends Error {
    error: "invalid_type";
    expected: string;
}
export interface InvalidValue extends Error {
    error: "invalid_value";
    expected?: string[];
    suggestion?: string;
}
export interface InvalidFormat extends Error {
    error: "invalid_format";
    expected: string;
}
export interface InvalidRange extends Error {
    error: "invalid_range";
    limit: string | number;
    operator: string;
}
export interface InvalidLength extends Error {
    error: "invalid_length";
    limit: number;
    operator: string;
}
export interface BlockedValue extends Error {
    error: "blocked_value";
}
export interface OtherFailure extends Error {
    error: "other";
}
export declare type ValidationResult = (Success | UnknownField | RequiredField | InvalidType | InvalidValue | InvalidFormat | InvalidRange | InvalidLength | BlockedValue | OtherFailure);
export {};
