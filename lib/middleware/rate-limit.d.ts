import { Middleware } from "../middleware";
export interface RateLimitOptions {
    consume(ip: string): Promise<boolean>;
    message?: string;
}
export default function rateLimit({ consume, message }: RateLimitOptions): Middleware;
