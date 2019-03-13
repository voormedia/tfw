export interface RouteOptions {
    method: string;
}
declare type Decorator = (object: any, key?: string, descriptor?: PropertyDescriptor) => PropertyDescriptor;
export declare function route(pattern: string, { method }: RouteOptions): Decorator;
export declare function mount(pattern: string, controller: any): (object: any) => void;
export declare const GET: (pattern: string) => Decorator;
export declare const DELETE: (pattern: string) => Decorator;
export declare const PATCH: (pattern: string) => Decorator;
export declare const POST: (pattern: string) => Decorator;
export declare const PUT: (pattern: string) => Decorator;
export {};
