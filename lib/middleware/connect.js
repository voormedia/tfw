export default function connect(fn) {
    return async function connect(next) {
        return new Promise((resolve, reject) => {
            fn(this.request, this.response, async (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    await next();
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    };
}
//# sourceMappingURL=connect.js.map