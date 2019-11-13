/// <reference types="node" />
export declare class Timer {
    time: number;
    timer?: NodeJS.Timeout;
    constructor(time: number);
    clear(): void;
    sleep(): Promise<void>;
}
