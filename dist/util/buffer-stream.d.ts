/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { Writable } from "stream";
import { inspect } from "util";
export declare class BufferStream extends Writable {
    private readonly buffers;
    _write(chunk: Buffer | string, encoding: string, callback: (err?: Error) => void): boolean;
    clear(): void;
    [inspect.custom](): string;
    toString(): string;
}
export default BufferStream;
