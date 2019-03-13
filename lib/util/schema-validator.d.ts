export declare type Validator = (body: any) => string[];
export declare function createValidator(schema: object): Validator;
