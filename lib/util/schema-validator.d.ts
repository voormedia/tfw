export declare type SimpleValidator = (body: object) => string[];
export declare type Validator = (body: object) => ValidationResult[];
export declare function createValidator(schema: object): Validator;
export declare function createSimpleValidator(schema: object): SimpleValidator;
export declare function simplifyResults(results: ValidationResult[], maxErrors?: number): string[];
interface Error {
    path?: string;
    error: string;
    message?: string;
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
export interface BlockedValue extends Error {
    error: "blocked_value";
    suggestion?: string;
}
export interface OtherFailure extends Error {
    error: "other_failure";
    suggestion?: string;
}
declare type Operator = "==" | "<=" | ">=" | "<" | ">";
interface RangeExpecation<T> {
    operator: Operator;
    limit: T;
}
export declare type ValidationResult = (UnknownField | RequiredField | InvalidType | InvalidFormat | InvalidRange | InvalidLength | InvalidOption | InvalidValue | BlockedValue | OtherFailure);
export {};
