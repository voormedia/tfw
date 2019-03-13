import { Middleware } from "../middleware";
export interface ValidationOptions {
    schema: object;
    message: string;
    details: boolean;
    optional: boolean;
}
export default function validateBody(options: ValidationOptions): Middleware;
