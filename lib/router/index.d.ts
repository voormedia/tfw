/// <reference types="node" />
import { inspect } from "util";
import Route from "./route";
export default class Router {
    private readonly tree;
    constructor();
    define(method: string, pattern: string, handler?: object): void;
    mount(pattern: string, router: Router): void;
    match(method: string, url: string): {
        handler?: object;
        params?: object;
    };
    readonly routes: Route[];
    readonly handlers: object[];
    [inspect.custom](): string;
}
