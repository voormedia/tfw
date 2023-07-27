import { Middleware } from "../middleware";
export interface SessionOptions {
    keys?: Array<string | undefined>;
    maxAge?: number;
    name?: string;
}
export default function parseSession({ name, keys: inputKeys, maxAge, }?: SessionOptions): Middleware;
