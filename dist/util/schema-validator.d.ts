export type SimpleValidator = (body: object) => string[];
export type Validator = (body: object) => ValidationResult[];
export declare function createValidator(schema: object, { maxErrors }?: {
    maxErrors?: number;
}): Validator;
export declare function createSimpleValidator(schema: object): SimpleValidator;
export declare function simplifyResults(results: ValidationResult[]): string[];
interface Error {
    path?: string;
    error: string;
    message?: string;
}
export interface TooManyErrors extends Error {
    error: "too_many_errors";
}
export interface UnknownField extends Error {
    error: "unknown_field";
}
export interface RequiredField extends Error {
    error: "required_field";
}
export interface InvalidType extends Error {
    error: "invalid_type";
    expected: string;
    suggestion?: string;
}
export interface InvalidFormat extends Error {
    error: "invalid_format";
    expected: string;
    suggestion?: string;
}
export interface InvalidRange extends Error {
    error: "invalid_range";
    expected: RangeExpecation<string | number>;
    suggestion?: string;
}
export interface InvalidLength extends Error {
    error: "invalid_length";
    expected: RangeExpecation<number>;
    suggestion?: string;
}
export interface InvalidOption extends Error {
    error: "invalid_option";
    expected: string[];
    suggestion?: string;
}
export interface InvalidValue extends Error {
    error: "invalid_value";
    suggestion?: string;
}
export interface DuplicateValue extends Error {
    error: "duplicate_value";
    suggestion?: string;
}
export interface BlockedValue extends Error {
    error: "blocked_value";
    suggestion?: string;
}
export interface OtherFailure extends Error {
    error: "other_failure";
    suggestion?: string;
}
type Operator = "==" | "<=" | ">=" | "<" | ">";
interface RangeExpecation<T> {
    operator: Operator;
    limit: T;
}
export type ValidationResult = (TooManyErrors | UnknownField | RequiredField | InvalidType | InvalidFormat | InvalidRange | InvalidLength | InvalidOption | InvalidValue | DuplicateValue | BlockedValue | OtherFailure);
export {};
