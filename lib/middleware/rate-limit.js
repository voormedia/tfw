import { TooManyRequests } from "../errors";
export default function rateLimit({ consume, message, if: iif, }) {
    return async function rateLimit(next) {
        if (iif && !iif(this))
            return next();
        const ok = await consume(this.remoteIp);
        if (ok)
            return next();
        throw new TooManyRequests(message);
    };
}
//# sourceMappingURL=rate-limit.js.map