import { ServiceError } from "../errors";
export default function parseAuthorization() {
    return async function parseAuthorization(next) {
        const auth = this.get("authorization");
        if (auth) {
            const [type, credentials] = auth.split(/\s+/);
            switch (type.toLowerCase()) {
                case "basic": {
                    if (credentials) {
                        const decoded = Buffer.from(credentials, "base64").toString("utf8");
                        /* https://tools.ietf.org/html/rfc7617#section-2.1:
                            "The user-id and password MUST NOT contain any control characters" */
                        // eslint-disable-next-line no-control-regex
                        if (decoded.search(/[\x00-\x1F]/) >= 0) {
                            throw new InvalidAuthorization();
                        }
                        const [username, password] = decoded.split(":");
                        this.data.username = username || "";
                        this.data.password = password || "";
                    }
                    break;
                }
                case "bearer": {
                    if (credentials) {
                        this.data.token = credentials;
                    }
                    break;
                }
                default: {
                    throw new InvalidAuthorization("Unsupported authorization header");
                }
            }
        }
        return next();
    };
}
/* tslint:disable-next-line: variable-name */
const InvalidAuthorization = ServiceError.define({
    status: 400,
    error: "invalid_authorization",
    message: "Invalid authorization header",
});
//# sourceMappingURL=parse-authorization.js.map