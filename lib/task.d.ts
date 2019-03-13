import "./util/polyfill";
import AbstractTask from "./util/abstract-task";
import Logger from "./util/logger";
export interface TaskOptions {
    logger?: Logger;
}
export declare class Task extends AbstractTask {
    static start(options?: TaskOptions): Task;
    constructor(options?: TaskOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    run(): Promise<void>;
}
export default Task;
