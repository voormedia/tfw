/// <reference types="node" />
import { inspect } from "util";
import Node from "./node";
export declare class RouteError extends Error {
    constructor(method: string, route: Route, message: string);
}
export declare class ParseError extends Error {
    constructor(pattern: string, message: string);
}
export default class Route {
    static parse(route: string): Route;
    static create(path: Node[]): Route;
    parts: Node[];
    constructor(parts: Node[]);
    prefix(prefix: string): Route;
    get path(): string;
    [inspect.custom](): string;
    toString(): string;
}
