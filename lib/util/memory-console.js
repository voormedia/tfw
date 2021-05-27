"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryConsole = void 0;
const console_1 = require("console");
const buffer_stream_1 = require("./buffer-stream");
class MemoryConsole extends console_1.Console {
    constructor() {
        const stdout = new buffer_stream_1.default;
        const stderr = new buffer_stream_1.default;
        super(stdout, stderr);
        this.stdout = stdout;
        this.stderr = stderr;
        Object.freeze(this);
    }
    clear() {
        this.stdout.clear();
        this.stderr.clear();
    }
}
exports.MemoryConsole = MemoryConsole;
exports.default = MemoryConsole;
//# sourceMappingURL=memory-console.js.map