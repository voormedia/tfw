import { Middleware } from "../middleware";
declare type Decorator = (object: any, key?: string, descriptor?: PropertyDescriptor) => void;
export declare function use(...middlewares: Middleware[]): Decorator;
export {};
