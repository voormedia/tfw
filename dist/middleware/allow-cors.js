export default function allowCors(options = {}) {
    const allowAll = !options.origins;
    const allowedOrigins = new Set(options.origins);
    const allowedMethodList = (options.methods || ["GET", "POST", "PUT", "PATCH", "DELETE"]).join(", ");
    const requestHeaderList = (options.requestHeaders || []).join(", ");
    const responseHeaderList = (options.responseHeaders || []).join(", ");
    const allowCredentials = options.allowCredentials;
    const maxAge = options.maxAge;
    return async function cors(next) {
        const origin = this.get("origin");
        /* Avoid cache conflicts if the response headers can be different
           depending on the Origin header. Since we don't include CORS headers
           for requests without an Origin request header this must always be set. */
        this.set("Vary", "Origin");
        if (origin) {
            /* This is a cross origin request. Test if the origin is allowed. */
            if (allowAll || allowedOrigins.has(origin)) {
                /* Only set the returned origin header that has been requested to avoid
                   disclosing the entire list of configured origins. */
                this.set("Access-Control-Allow-Origin", allowAll ? "*" : origin);
            }
            else {
                /* Origin is disallowed. The origin is not included in the list, so
                   we stop here without returning CORS headers. */
                this.status = 403;
                return Promise.resolve();
            }
            this.set("Access-Control-Allow-Methods", allowedMethodList);
            if (requestHeaderList)
                this.set("Access-Control-Allow-Headers", requestHeaderList);
            if (responseHeaderList)
                this.set("Access-Control-Expose-Headers", responseHeaderList);
            if (allowCredentials)
                this.set("Access-Control-Allow-Credentials", "true");
            if (maxAge)
                this.set("Access-Control-Max-Age", maxAge);
            if (this.method === "OPTIONS" && this.get("access-control-request-method")) {
                /* Return early if this is a preflight request. */
                this.status = 200;
                return Promise.resolve();
            }
        }
        return next();
    };
}
//# sourceMappingURL=allow-cors.js.map