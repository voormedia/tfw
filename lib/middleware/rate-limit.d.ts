import { Context, Middleware } from "../middleware";
export interface RateLimitOptions {
    consume(ip: string): Promise<boolean>;
    message?: string;
    if?(ctx: Context): boolean;
}
export default function rateLimit({ consume, message, if: iif, }: RateLimitOptions): Middleware;
