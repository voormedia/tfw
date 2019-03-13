declare type Decorator = (object: any, key?: string, descriptor?: PropertyDescriptor) => PropertyDescriptor | void;
export declare function when(condition: boolean, decorator: Decorator): Decorator;
export {};
