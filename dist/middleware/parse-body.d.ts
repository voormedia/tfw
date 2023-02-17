import { Middleware } from "../middleware";
export interface BodyOptions {
    maxLength?: number;
}
export default function parseBody({ maxLength }?: BodyOptions): Middleware;
