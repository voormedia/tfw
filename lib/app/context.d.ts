/// <reference types="node" />
import { IncomingMessage as Request, ServerResponse as Response } from "http";
import { inspect } from "util";
import { Stack } from "../middleware";
export { Request, Response };
export declare type Body = Buffer | object | string;
declare type AsyncBody = Promise<Body>;
export interface Data {
    [key: string]: any;
}
export declare class Context {
    #private;
    stack: Stack;
    request: Request;
    response: Response;
    body: Body | AsyncBody;
    data: Data;
    constructor(stack: Stack, request: Request, response: Response);
    get(header: string): string | undefined;
    get method(): string;
    get url(): string;
    get remoteIp(): string;
    get traceId(): string;
    set(header: string, value: string | number): void;
    set status(value: number);
    get sent(): boolean;
    [inspect.custom](): {
        data: Data;
        req: string;
        res: string;
        stack: Stack;
    };
}
export default Context;
