import { Middleware } from "../middleware";
export interface AllowCorsOptions {
    origins?: string[];
    methods?: string[];
    requestHeaders?: string[];
    responseHeaders?: string[];
    allowCredentials?: boolean;
    maxAge?: number;
}
export default function allowCors(options?: AllowCorsOptions): Middleware;
