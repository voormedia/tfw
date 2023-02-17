import { ServiceError } from "../errors";
export default function requireTLS() {
    return async function requireTLS(next) {
        const socket = this.request.socket;
        if (socket.encrypted)
            return next();
        if (this.get("x-forwarded-proto") === "https")
            return next();
        if (process.env.NODE_ENV === "development")
            return next();
        throw new TlsRequired();
    };
}
/* tslint:disable-next-line: variable-name */
const TlsRequired = ServiceError.define({
    status: 403,
    error: "tls_required",
    message: "TLS is required to connect",
});
//# sourceMappingURL=require-tls.js.map