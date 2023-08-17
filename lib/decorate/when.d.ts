type Decorator = (object: any, key?: string, descriptor?: PropertyDescriptor) => void;
export declare function when(condition: boolean, decorator: Decorator): Decorator;
export {};
