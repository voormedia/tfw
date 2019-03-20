"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
function write() {
    return async function write(next) {
        await next();
        Object.freeze(this);
        if (this.sent)
            return;
        if (this.body instanceof Promise) {
            this.response.writeHead(this.response.statusCode);
            try {
                send(this.response, await this.body);
            }
            catch (err) {
                if (this.response.headersSent) {
                    send(this.response, null);
                }
                else {
                    send(this.response, err);
                }
            }
        }
        else {
            send(this.response, this.body);
        }
    };
}
exports.default = write;
function send(response, body) {
    /* tslint:disable-next-line: strict-type-predicates */
    if (body === null) {
        response.end();
    }
    else if (body instanceof Buffer) {
        response.end(body);
    }
    else if (body instanceof stream_1.Readable) {
        body.pipe(response);
    }
    else if (typeof body === "string") {
        response.end(body, "utf8");
    }
    else {
        /* Treat as JSON. */
        if (!response.headersSent) {
            response.setHeader("Content-Type", "application/json");
        }
        response.end(JSON.stringify(body), "utf8");
    }
}
//# sourceMappingURL=write.js.map