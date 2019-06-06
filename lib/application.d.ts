/// <reference types="node" />
import { inspect } from "util";
import "./util/polyfill";
import Router from "./router";
import AbstractTask from "./util/abstract-task";
import Logger from "./util/logger";
import ClosableServer from "./app/closable-server";
import { Stack } from "./middleware";
export interface ApplicationOptions {
    port?: number;
    logger?: Logger;
    router?: Router;
    terminationGrace?: number;
}
export declare class Application extends AbstractTask {
    static start(options?: ApplicationOptions): Application;
    port: number;
    router: Router;
    stack: Stack;
    server: ClosableServer;
    constructor(options?: ApplicationOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    kill(): Promise<void>;
    [inspect.custom](): {
        router: Router;
        server: string;
        stack: import("./middleware").Middleware[];
    };
}
export default Application;
