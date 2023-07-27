import { InternalServerError } from "../errors";
export default function rescue() {
    return async function rescue(next) {
        this.response.on("pipe", stream => {
            stream.on("error", err => {
                stream.unpipe();
                error.call(this, err);
            });
        });
        try {
            await next();
        }
        catch (err) {
            error.call(this, err);
            return;
        }
    };
}
function error(err) {
    this.data.error = err;
    if (!err.expose) {
        if (process.env.NODE_ENV === "test" && !process.env.NODE_RESCUE_TEST)
            throw err;
        err = new InternalServerError();
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