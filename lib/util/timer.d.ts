export declare class Timer {
    time: number;
    timer?: number;
    constructor(time: number);
    clear(): void;
    sleep(): Promise<void>;
}
