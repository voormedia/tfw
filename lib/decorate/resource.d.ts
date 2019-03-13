export interface ResourceOptions {
    singular: boolean;
}
declare type Decorator = (object: any) => void;
export declare function resource({ singular }?: ResourceOptions): Decorator;
export {};
