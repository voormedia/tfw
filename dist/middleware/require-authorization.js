import { timingSafeEqual } from "crypto";
import { Unauthorized } from "../errors";
export default function requireAuthorization(realm, credentials) {
    return async function requireAuthorization(next) {
        const { username, password } = this.data;
        if (username) {
            const expected = credentials[username];
            if (safeEqual(password, expected)) {
                return next();
            }
        }
        this.set("WWW-Authenticate", `Basic realm="${realm}"`);
        throw new Unauthorized;
    };
}
function safeEqual(a, b) {
    return a !== undefined && b !== undefined && a.length === b.length &&
        timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
//# sourceMappingURL=require-authorization.js.map