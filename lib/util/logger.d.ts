/// <reference types="node" />
export interface HttpRequest {
    requestMethod: string;
    requestUrl: string;
    requestSize: number;
    status: number;
    responseSize: number;
    userAgent?: string;
    remoteIp?: string;
    referer?: string;
    latency?: string;
    cacheHit?: boolean;
    cacheValidatedWithOriginServer?: boolean;
}
export interface ServiceContext {
    service: string;
    version?: string;
}
export type LogSeverity = ("DEBUG" | "INFO" | "NOTICE" | "WARNING" | "ERROR" | "CRITICAL" | "ALERT" | "EMERGENCY");
export type Message = object | string | undefined;
export interface LogEntry {
    time: Date;
    message: string;
    severity: LogSeverity;
    httpRequest?: HttpRequest;
    serviceContext?: ServiceContext;
}
export interface LogContext {
    httpRequest?: HttpRequest;
    [other: string]: any;
}
export declare class Logger {
    static get formatter(): (entry: LogEntry) => string;
    static get console(): Console;
    static get service(): ServiceContext;
    static JSON: {
        (value: any, replacer?: ((this: any, key: string, value: any) => any) | undefined, space?: string | number | undefined): string;
        (value: any, replacer?: (string | number)[] | null | undefined, space?: string | number | undefined): string;
    };
    static PRETTY: (entry: LogEntry) => string;
    private readonly console;
    private readonly formatter;
    private readonly service;
    constructor(console?: Console, formatter?: (entry: LogEntry) => string, service?: ServiceContext);
    write(severity: LogSeverity, message: Message, context: LogContext): void;
    debug(message: Message, context?: LogContext): void;
    info(message: Message, context?: LogContext): void;
    notice(message: Message, context?: LogContext): void;
    warning(message: Message, context?: LogContext): void;
    error(message: Message, context?: LogContext): void;
    critical(message: Message, context?: LogContext): void;
}
export default Logger;
