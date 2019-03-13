"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class BufferStream extends stream_1.Writable {
    constructor() {
        super(...arguments);
        this.buffers = [];
    }
    _write(chunk, encoding, callback) {
        if (typeof chunk === "string")
            chunk = Buffer.from(chunk);
        this.buffers.push(chunk);
        callback();
        return true;
    }
    clear() {
        this.buffers.length = 0;
    }
    inspect() {
        return Buffer.concat(this.buffers).toString();
    }
    toString() {
        return Buffer.concat(this.buffers).toString();
    }
}
exports.BufferStream = BufferStream;
exports.default = BufferStream;
//# sourceMappingURL=buffer-stream.js.map