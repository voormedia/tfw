"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timer_1 = require("../util/timer");
const errors_1 = require("../errors");
function shutdown(grace = 25) {
    return async function shutdown(next) {
        /* Cancel request if server is stopping, but only after a grace period.
           This allows a request to be handled if there is enough time. */
        const timer = new timer_1.Timer(grace * 1000);
        const stop = async () => {
            await timer.sleep();
            const server = this.request.socket.server;
            if (server.closing) {
                throw new errors_1.ServiceUnavailable("Please retry the request");
            }
            return new Promise(() => { });
        };
        try {
            await Promise.race([stop(), next()]);
        }
        finally {
            /* Clear timer. It frees setTimeout reference to this context, potentially
               conserving a lot of memory if most requests are short. */
            timer.clear();
        }
    };
}
exports.default = shutdown;
//# sourceMappingURL=shutdown.js.map