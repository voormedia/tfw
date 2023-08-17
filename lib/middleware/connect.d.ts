/// <reference types="node" />
import { Request, Response } from "../app/context";
import { Middleware } from "../middleware";
type NextHandler = (err?: Error) => Promise<void>;
export type ConnectMiddleware = (req: Request, res: Response, next: NextHandler) => void;
export default function connect(fn: ConnectMiddleware): Middleware;
export {};
