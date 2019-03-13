/// <reference types="node" />
import { Stack } from "../middleware";
import { Request, Response } from "./context";
export default function dispatch(initialStack: Stack): (request: Request, response: Response) => void;
