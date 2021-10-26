"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bufferBody() {
    return async function bufferBody(next) {
        const buffers = [];
        this.request.on("data", (chunk) => {
            buffers.push(chunk);
        });
        await new Promise(resolve => {
            this.request.on("end", resolve);
        });
        if (buffers.length) {
            this.data.body = Buffer.concat(buffers);
        }
        await next();
    };
}
exports.default = bufferBody;
//# sourceMappingURL=buffer-body.js.map