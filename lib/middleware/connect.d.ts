/// <reference types="node" />
import { Request, Response } from "../app/context";
import { Middleware } from "../middleware";
declare type NextHandler = (err?: Error) => Promise<void>;
export declare type ConnectMiddleware = (req: Request, res: Response, next: NextHandler) => void;
export default function connect(fn: ConnectMiddleware): Middleware;
export {};
