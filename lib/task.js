"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./util/polyfill");
const abstract_task_1 = require("./util/abstract-task");
const logger_1 = require("./util/logger");
class Task extends abstract_task_1.default {
    /* Start a new task with the given options in next tick. */
    static start(options = {}) {
        const task = new this(options);
        process.nextTick(() => { task.start(); });
        return task;
    }
    constructor(options = {}) {
        super();
        const { logger = new logger_1.default, } = options;
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
    async run() {
    }
}
exports.Task = Task;
exports.default = Task;
//# sourceMappingURL=task.js.map