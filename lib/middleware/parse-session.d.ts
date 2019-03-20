import { Middleware } from "../middleware";
export interface SessionOptions {
    keys?: string[];
    maxAge?: number;
    name?: string;
}
export default function parseSession({ name, keys, maxAge }?: SessionOptions): Middleware;
