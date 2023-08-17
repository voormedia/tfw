export interface ResourceOptions {
    singular: boolean;
}
type Decorator = (object: any) => void;
export declare function resource({ singular }?: ResourceOptions): Decorator;
export {};
