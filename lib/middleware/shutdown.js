import { Timer } from "../util/timer";
import { ServiceUnavailable } from "../errors";
export default function shutdown(grace = 25) {
    return async function shutdown(next) {
        /* Cancel request if server is stopping, but only after a grace period.
           This allows a request to be handled if there is enough time. */
        const timer = new Timer(grace * 1000);
        const stop = async () => {
            await timer.sleep();
            const server = this.request.socket.server;
            if (server.closing) {
                throw new ServiceUnavailable("Please retry the request");
            }
            return new Promise(() => undefined);
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
//# sourceMappingURL=shutdown.js.map