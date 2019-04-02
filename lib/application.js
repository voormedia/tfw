"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./util/polyfill");
const router_1 = require("./router");
const abstract_task_1 = require("./util/abstract-task");
const logger_1 = require("./util/logger");
const closable_server_1 = require("./app/closable-server");
const dispatch_1 = require("./decorate/dispatch");
const middleware_1 = require("./middleware");
class Application extends abstract_task_1.default {
    constructor(options = {}) {
        super();
        this.server = new closable_server_1.default();
        const { port = 3000, router = new router_1.default, logger = new logger_1.default, terminationGrace = 25, } = options;
        this.port = port;
        this.router = router;
        this.logger = logger;
        /* Bare minimum stack to do anything useful. */
        this.stack = [
            middleware_1.log(logger),
            middleware_1.write(),
            middleware_1.rescue(),
            middleware_1.shutdown(terminationGrace),
            middleware_1.route(router),
        ];
        Object.freeze(this);
    }
    /* Start a new application with the given options in next tick. */
    static start(options = {}) {
        const app = new this(options);
        process.nextTick(() => {
            app.start().catch(err => { throw err; });
        });
        return app;
    }
    async start() {
        await super.start();
        this.server.timeout = 0;
        // ES7: this.server.on("request", ::this.dispatch)
        this.server.on("request", dispatch_1.default(this.stack));
        this.server.listen(this.port);
        return new Promise(resolve => {
            this.server.once("listening", resolve);
        });
    }
    async stop() {
        await super.stop();
        this.server.close();
        return new Promise(resolve => {
            this.server.once("close", resolve);
        });
    }
    async kill() {
        await super.kill();
        /* Don't wait for server to quite gracefully, but quit after short delay.
           This avoids processes hanging for a long time because a
           request failed to finish. We sacrifice all running requests for a
           more speedy recovery because the server will restart. */
        this.server.close();
        this.server.unref();
        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }
    inspect() {
        return {
            router: this.router,
            server: "<node server>",
            stack: this.stack,
        };
    }
}
exports.Application = Application;
exports.default = Application;
//# sourceMappingURL=application.js.map