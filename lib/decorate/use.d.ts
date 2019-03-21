import { Middleware } from "../middleware";
declare type Decorator = (object: any, key?: string, descriptor?: PropertyDescriptor) => void;
export declare function use(middleware: Middleware): Decorator;
export {};
