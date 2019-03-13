export declare class Timer {
    time: number;
    timer?: number;
    constructor(time: number);
    sleep(): Promise<void>;
    clear(): void;
}
export default Timer;
