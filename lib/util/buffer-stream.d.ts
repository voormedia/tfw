/// <reference types="node" />
import { Writable } from "stream";
export declare class BufferStream extends Writable {
    private readonly buffers;
    _write(chunk: Buffer | string, encoding: string, callback: (err?: Error) => void): boolean;
    clear(): void;
    inspect(): string;
    toString(): string;
}
export default BufferStream;
