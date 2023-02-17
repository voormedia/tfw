import { Middleware } from "../middleware";
export interface Credentials {
    [username: string]: string;
}
export default function requireAuthorization(realm: string, credentials: Credentials): Middleware;
