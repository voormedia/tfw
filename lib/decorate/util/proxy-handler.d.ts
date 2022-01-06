import { Middleware } from "../../middleware";
export interface ProxyOptions {
    prepend: boolean;
}
export default function proxy(target: string, { prepend }: ProxyOptions): Middleware;
