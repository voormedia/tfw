import { Middleware } from "../middleware";
export interface SessionOptions {
    name?: string;
    keys?: string[];
    maxAge?: number;
}
export default function parseSession({ name, keys, maxAge }?: SessionOptions): Middleware;
