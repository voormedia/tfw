export default function addHeaders(headers = {}) {
    return async function addHeaders(next) {
        for (const [key, value] of Object.entries(headers)) {
            this.set(key, value);
        }
        return next();
    };
}
//# sourceMappingURL=add-headers.js.map