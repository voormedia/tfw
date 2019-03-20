"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
class ClosableServer extends http_1.Server {
    constructor() {
        super();
        this.closing = false;
        this.sockets = new Map();
        this.on("connection", (socket) => {
            this.sockets.set(socket, 0);
            socket.on("close", () => {
                this.sockets.delete(socket);
            });
        });
        this.on("request", (request, response) => {
            const socket = request.socket;
            this.sockets.set(socket, +this.sockets.get(socket) + 1);
            if (this.closing) {
                response.setHeader("Connection", "close");
            }
            response.on("finish", () => {
                const pending = +this.sockets.get(socket) - 1;
                this.sockets.set(socket, pending);
                if (this.closing && pending === 0) {
                    socket.end();
                }
            });
        });
    }
    close(callback) {
        super.close(callback);
        this.closing = true;
        process.nextTick(() => {
            for (const [socket, pending] of this.sockets) {
                if (pending === 0) {
                    socket.end();
                }
            }
        });
        return this;
    }
}
exports.ClosableServer = ClosableServer;
exports.default = ClosableServer;
//# sourceMappingURL=closable-server.js.map