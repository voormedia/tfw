"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const host_pkg_1 = require("./host-pkg");
const memory_console_1 = require("./memory-console");
class Logger {
    constructor(console = Logger.console, formatter = Logger.formatter, service = Logger.service) {
        this.console = console;
        this.formatter = formatter;
        this.service = service;
        Object.freeze(this);
    }
    static get formatter() {
        return process.env.NODE_ENV === "development" ? Logger.PRETTY : Logger.JSON;
    }
    static get console() {
        return process.env.NODE_ENV === "test" ? new memory_console_1.default : console;
    }
    static get service() {
        return {
            service: host_pkg_1.default.name,
            version: host_pkg_1.default.version,
        };
    }
    write(severity, message, context) {
        const entry = {
            time: new Date,
            message: typeof message === "object" ? JSON.stringify(message) : String(message),
            serviceContext: this.service,
            severity,
        };
        this.console.log(this.formatter(Object.assign({}, entry, context)));
    }
    debug(message, context = {}) {
        this.write("DEBUG", message, context);
    }
    info(message, context = {}) {
        this.write("INFO", message, context);
    }
    notice(message, context = {}) {
        this.write("NOTICE", message, context);
    }
    warning(message, context = {}) {
        this.write("WARNING", message, context);
    }
    error(message, context = {}) {
        this.write("ERROR", message, context);
    }
    critical(message, context = {}) {
        this.write("CRITICAL", message, context);
    }
}
Logger.JSON = JSON.stringify;
Logger.PRETTY = (entry) => {
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";
    const black = "\x1b[30m";
    const red = "\x1b[31m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    // const blue = "\x1b[34m"
    const dateOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    const styles = {
        DEBUG: black + bold,
        INFO: reset,
        NOTICE: green + bold,
        WARNING: yellow + bold,
        ERROR: red + bold,
        CRITICAL: red + bold,
        ALERT: red + bold,
        EMERGENCY: red + bold,
    };
    const time = `[${entry.time.toLocaleString("en", dateOptions)}]`;
    let http = "";
    if (entry.httpRequest) {
        const { remoteIp, requestMethod, requestUrl, status, responseSize } = entry.httpRequest;
        http = `${remoteIp || "unknown"} - ${requestMethod.toUpperCase()} ${requestUrl} ${status} ${responseSize} - `;
    }
    return `${time} ${styles[entry.severity]}${http}${entry.message}${reset}`;
};
exports.Logger = Logger;
exports.default = Logger;
//# sourceMappingURL=logger.js.map