"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* @flow */
/* eslint-disable no-unused-expressions */
const stream_1 = require("stream");
function write() {
    return async function write(next) {
        await next();
        Object.freeze(this);
        if (this.sent)
            return;
        /* tslint:disable-next-line: strict-type-predicates */
        if (this.body === null) {
            this.response.end();
        }
        else if (this.body instanceof Buffer) {
            this.response.end(this.body);
        }
        else if (this.body instanceof stream_1.Readable) {
            this.body.pipe(this.response);
        }
        else if (typeof this.body === "string") {
            this.response.end(this.body, "utf8");
        }
        else {
            /* Treat as JSON. */
            this.set("Content-Type", "application/json");
            this.response.end(JSON.stringify(this.body), "utf8");
        }
    };
}
exports.default = write;
//# sourceMappingURL=write.js.map