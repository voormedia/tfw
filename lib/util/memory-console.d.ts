/// <reference types="node" />
import { Console } from "console";
import BufferStream from "./buffer-stream";
export declare class MemoryConsole extends Console {
    stdout: BufferStream;
    stderr: BufferStream;
    constructor();
    clear(): void;
}
export default MemoryConsole;
