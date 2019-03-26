export declare type SimpleValidator = (body: object) => string[];
export declare type Validator = (body: object) => ValidationResult[];
export declare function createValidator(schema: object): Validator;
export declare function createSimpleValidator(schema: object): SimpleValidator;
export declare function simplifyResults(results: ValidationResult[]): string[];
export interface Unknown {
    error: "unknown";
    path?: string;
}
export interface Required {
    error: "required";
    path?: string;
}
export interface InvalidType {
    error: "invalid_type";
    path?: string;
    expected: string;
}
export interface InvalidValue {
    error: "invalid_value";
    path?: string;
    expected: string[];
}
export interface InvalidFormat {
    error: "invalid_format";
    path?: string;
    expected: string;
}
export interface InvalidRange {
    error: "invalid_range";
    path?: string;
    limit: string | number;
    operator: string;
}
export interface InvalidLength {
    error: "invalid_length";
    path?: string;
    limit: number;
    operator: string;
}
export interface Other {
    error: "other";
    path?: string;
}
export declare type ValidationResult = (Unknown | Required | InvalidType | InvalidValue | InvalidFormat | InvalidRange | InvalidLength | Other);
