/// <reference types="node" />
import { Request, Response } from "../app/context";
import { Stack } from "../middleware";
export default function dispatch(initialStack: Stack): (request: Request, response: Response) => void;
