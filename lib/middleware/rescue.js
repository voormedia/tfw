"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
function rescue() {
    return async function rescue(next) {
        this.response.on("pipe", (stream) => {
            stream.on("error", (err) => {
                stream.unpipe();
                // ES7 this::error(err)
                error.call(this, err);
            });
        });
        try {
            await next();
        }
        catch (err) {
            // ES7 this::error(err)
            return error.call(this, err);
        }
    };
}
exports.default = rescue;
function error(err) {
    this.data.error = err;
    if (!err.expose) {
        if (process.env.NODE_ENV === "test")
            throw err;
        err = new errors_1.InternalServerError;
    }
    if (this.sent) {
        this.response.end();
        return;
    }
    this.set("Content-Type", "application/json");
    this.status = err.status || 500;
    this.response.end(JSON.stringify(err), "utf8");
}
//# sourceMappingURL=rescue.js.map