/// <reference types="node" />
import { inspect } from "util";
import Route from "./route";
export interface DefineOptions {
    prefix?: boolean;
}
export interface RouterMatch {
    handler?: object;
    params?: object;
    path?: string;
}
export default class Router {
    private readonly tree;
    constructor();
    define(method: string, pattern: string, handler: object, { prefix }?: DefineOptions): void;
    mount(pattern: string, router: Router): void;
    match(method: string, url: string): RouterMatch;
    get routes(): Array<[string, Route]>;
    get handlers(): object[];
    [inspect.custom](): string;
}
