"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const host_pkg_1 = require("./host-pkg");
const description = `${host_pkg_1.default.name} service ${process.env.HOSTNAME || ""}`.trim();
class AbstractTask {
    constructor() {
        this.description = description;
        /* Assign default env. */
        if (!process.env.NODE_ENV) {
            process.env.NODE_ENV = "development";
        }
    }
    async start() {
        process.on("SIGINT", async () => {
            await this.stop();
            process.exit(128 + 2);
        });
        process.on("SIGTERM", async () => {
            await this.stop();
            process.exit(128 + 15);
        });
        if (process.env.NODE_ENV !== "test") {
            const proc = process;
            proc.on("uncaughtException", async (err) => {
                this.logger.critical(`uncaught ${err.stack}`);
                await this.kill();
                process.exit(1);
            });
            proc.on("unhandledRejection", async (err, promise) => {
                this.logger.critical(`unhandled ${err.stack || err.toString()}`);
                await this.kill();
                process.exit(2);
            });
        }
        this.logger.notice(`starting ${this.description}`);
    }
    async stop() {
        this.logger.notice(`stopping ${this.description}`);
        /* Left up to implementation how to further deal with this scenario. */
    }
    async kill() {
        this.logger.warning(`forcefully stopped ${this.description}`);
        /* Left up to implementation how to further deal with this scenario. */
    }
}
exports.AbstractTask = AbstractTask;
exports.default = AbstractTask;
//# sourceMappingURL=abstract-task.js.map