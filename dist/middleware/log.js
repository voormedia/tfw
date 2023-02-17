import { STATUS_CODES } from "http";
const statusCodes = new Map;
for (const [code, description] of Object.entries(STATUS_CODES)) {
    statusCodes.set(parseInt(code, 10), description.toLowerCase());
}
export default function log(logger) {
    return async function log(next) {
        const socket = this.request.socket;
        /* Check what has been previously recorded as read/written on this socket.
           The request may not be the first over this socket. */
        const bytesReadPreviously = socket.bytesReadPreviously || 0;
        const bytesWrittenPreviously = socket.bytesWrittenPreviously || 0;
        const startTime = process.hrtime();
        this.data.log = Object.create(null);
        this.response.on("finish", () => {
            /* Store current read/written count for future reference. */
            socket.bytesReadPreviously = socket.bytesRead;
            socket.bytesWrittenPreviously = socket.bytesWritten;
            const requestMethod = this.method;
            const requestUrl = this.url;
            const requestSize = socket.bytesRead - bytesReadPreviously;
            const status = this.response.statusCode;
            const responseSize = socket.bytesWritten - bytesWrittenPreviously;
            const userAgent = this.get("user-agent");
            const referer = this.get("referer");
            const remoteIp = this.remoteIp;
            const [sec, nano] = process.hrtime(startTime);
            const latency = `${(sec + nano * 1e-9).toFixed(3)}s`;
            const httpRequest = {
                latency,
                referer,
                remoteIp,
                requestMethod,
                requestSize,
                requestUrl,
                responseSize,
                status,
                userAgent,
                // TODO add protocol
            };
            const logContext = {
                ...this.data.log,
                httpRequest,
                "logging.googleapis.com/trace": this.traceId,
            };
            if (status >= 500 && this.data.error) {
                /* An error was thrown somewhere. */
                if (this.data.error.expose) {
                    /* This error is exposable, so it is to be expected. */
                    logger.warning(this.data.error.message || "(no message)", logContext);
                }
                else {
                    /* This was an internal error, not supposed to be exposed. Log the
                       entire stack trace so we can debug later. */
                    logger.error(this.data.error.stack || this.data.error.toString(), logContext);
                }
            }
            else {
                /* No error was thrown, or error was in 4xx range. */
                if (isHealthCheck(httpRequest)) {
                    logger.debug(statusCodes.get(status), logContext);
                }
                else {
                    logger.info(statusCodes.get(status), logContext);
                }
            }
        });
        return next();
    };
}
const healthCheckTokens = new Set([
    "GoogleHC",
    "ELB-HealthChecker",
    "kube-probe",
]);
function isHealthCheck({ userAgent }) {
    if (!userAgent)
        return false;
    return healthCheckTokens.has(userAgent.split("/")[0]);
}
//# sourceMappingURL=log.js.map