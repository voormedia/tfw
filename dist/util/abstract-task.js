import { inspect } from "util";
import hostPkg from "./host-pkg";
const description = `${hostPkg.name} service ${process.env.HOSTNAME || ""}`.trim();
export class AbstractTask {
    description = description;
    logger;
    constructor() {
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
export default AbstractTask;
//# sourceMappingURL=abstract-task.js.map