/// <reference types="node" />
import { inspect } from "util";
import Logger from "./logger";
export declare abstract class AbstractTask {
    description: string;
    logger: Logger;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    kill(): Promise<void>;
    abstract [inspect.custom](): any;
}
export default AbstractTask;
