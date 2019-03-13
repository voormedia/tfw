/// <reference types="node" />
import { Server } from "http";
export declare class ClosableServer extends Server {
    closing: boolean;
    private sockets;
    constructor();
    close(callback?: (err?: Error) => void): this;
}
export default ClosableServer;
