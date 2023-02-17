import { NotFound } from "../errors";
export default function requireHost(...hosts) {
    return async function requireHost(next) {
        const host = this.request.headers.host;
        if (host && hosts.includes(host))
            return next();
        throw new NotFound("This endpoint does not exist.");
    };
}
//# sourceMappingURL=require-host.js.map