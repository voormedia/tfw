export default function route(router) {
    return async function route(next) {
        const url = this.url;
        let method = this.method;
        if (method === "HEAD") {
            /* Treat HEAD requests as GET. */
            method = "GET";
        }
        const { handler, params, path } = router.match(method, url);
        if (handler) {
            this.data.params = params;
            this.data.path = path;
            if (handler.stack) {
                this.stack.push(...handler.stack);
            }
            this.stack.push(handler);
        }
        return next();
    };
}
//# sourceMappingURL=route.js.map