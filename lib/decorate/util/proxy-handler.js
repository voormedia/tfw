"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
function proxy(target, { prepend }) {
    const base = target.replace(/\/?$/, "/");
    return async function proxy() {
        const path = this.request.url.slice(prepend ? 1 : this.data.path.length);
        const url = new url_1.URL(path, base);
        const options = {
            method: this.request.method,
            headers: this.request.headers,
        };
        const proxy = (0, http_1.request)(url, options, res => {
            this.response.writeHead(res.statusCode, res.headers);
            res.pipe(this.response, { end: true });
        });
        this.request.pipe(proxy, { end: true });
        return new Promise(resolve => proxy.on("end", resolve));
    };
}
exports.default = proxy;
//# sourceMappingURL=proxy-handler.js.map