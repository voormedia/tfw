"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function connect(fn) {
    return function connect(next) {
        return new Promise((resolve, reject) => {
            fn(this.request, this.response, async (err) => {
                if (err) {
                    return reject(err);
                }
                else {
                    try {
                        await next();
                        resolve();
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            });
        });
    };
}
exports.default = connect;
//# sourceMappingURL=connect.js.map