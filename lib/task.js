import { inspect } from "util";
import "./util/polyfill";
import AbstractTask from "./util/abstract-task";
import Logger from "./util/logger";
export class Task extends AbstractTask {
    /* Start a new task with the given options in next tick. */
    static start(options = {}) {
        const task = new this(options);
        process.nextTick(() => { task.start().catch(err => { throw err; }); });
        return task;
    }
    constructor(options = {}) {
        super();
        const { logger = new Logger, } = options;
        this.logger = logger;
        Object.freeze(this);
    }
    async start() {
        await super.start();
        await this.run();
        await this.stop();
    }
    async stop() {
        await super.stop();
        process.exit();
    }
    /* tslint:disable-next-line: prefer-function-over-method */
    async run() {
    }
    /* tslint:disable-next-line: prefer-function-over-method */
    [inspect.custom]() {
        return {};
    }
}
export default Task;
//# sourceMappingURL=task.js.map