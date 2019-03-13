import Logger from "./logger";
export declare class AbstractTask {
    description: string;
    logger: Logger;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    kill(): Promise<void>;
    inspect(): {};
}
export default AbstractTask;
