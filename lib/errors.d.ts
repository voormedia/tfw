/// <reference types="node" />
export interface ErrorDetails<T extends string> {
    error: T;
    message: string;
}
export interface ErrorDefaults<T extends string> extends ErrorDetails<T> {
    status: number;
}
export declare abstract class ServiceError<T extends string> extends Error implements ErrorDetails<T> {
    static define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    abstract error: T;
    abstract status: number;
    abstract message: string;
    expose: boolean;
    constructor();
    toJSON(): ErrorDetails<T>;
    toString(): string;
}
export declare const BadRequest: {
    new (msg?: string | undefined): {
        status: number;
        error: "invalid_request";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"invalid_request">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Unauthorized: {
    new (msg?: string | undefined): {
        status: number;
        error: "unauthorized";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"unauthorized">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const PaymentRequired: {
    new (msg?: string | undefined): {
        status: number;
        error: "payment_required";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"payment_required">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Forbidden: {
    new (msg?: string | undefined): {
        status: number;
        error: "forbidden";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"forbidden">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const NotFound: {
    new (msg?: string | undefined): {
        status: number;
        error: "not_found";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"not_found">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const MethodNotAllowed: {
    new (msg?: string | undefined): {
        status: number;
        error: "method_not_allowed";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"method_not_allowed">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const NotAcceptable: {
    new (msg?: string | undefined): {
        status: number;
        error: "not_acceptable";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"not_acceptable">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ProxyAuthenticationRequired: {
    new (msg?: string | undefined): {
        status: number;
        error: "proxy_authentication_required";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"proxy_authentication_required">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RequestTimeout: {
    new (msg?: string | undefined): {
        status: number;
        error: "request_timeout";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"request_timeout">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Conflict: {
    new (msg?: string | undefined): {
        status: number;
        error: "conflict";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"conflict">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Gone: {
    new (msg?: string | undefined): {
        status: number;
        error: "gone";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"gone">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const LengthRequired: {
    new (msg?: string | undefined): {
        status: number;
        error: "length_required";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"length_required">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const PreconditionFailed: {
    new (msg?: string | undefined): {
        status: number;
        error: "precondition_failed";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"precondition_failed">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RequestEntityTooLarge: {
    new (msg?: string | undefined): {
        status: number;
        error: "request_entity_too_large";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"request_entity_too_large">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RequestURITooLong: {
    new (msg?: string | undefined): {
        status: number;
        error: "request_uri_too_long";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"request_uri_too_long">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UnsupportedMediaType: {
    new (msg?: string | undefined): {
        status: number;
        error: "unsupported_media_type";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"unsupported_media_type">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RangeNotSatisfiable: {
    new (msg?: string | undefined): {
        status: number;
        error: "range_not_satisfiable";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"range_not_satisfiable">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ExpectationFailed: {
    new (msg?: string | undefined): {
        status: number;
        error: "expectation_failed";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"expectation_failed">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ImATeapot: {
    new (msg?: string | undefined): {
        status: number;
        error: "im_a_teapot";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"im_a_teapot">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const MisdirectedRequest: {
    new (msg?: string | undefined): {
        status: number;
        error: "misdirected_request";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"misdirected_request">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UnprocessableEntity: {
    new (msg?: string | undefined): {
        status: number;
        error: "unprocessable_entity";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"unprocessable_entity">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Locked: {
    new (msg?: string | undefined): {
        status: number;
        error: "locked";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"locked">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const FailedDependency: {
    new (msg?: string | undefined): {
        status: number;
        error: "failed_dependency";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"failed_dependency">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UpgradeRequired: {
    new (msg?: string | undefined): {
        status: number;
        error: "upgrade_required";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"upgrade_required">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const PreconditionRequired: {
    new (msg?: string | undefined): {
        status: number;
        error: "precondition_required";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"precondition_required">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const TooManyRequests: {
    new (msg?: string | undefined): {
        status: number;
        error: "too_many_requests";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"too_many_requests">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RequestHeaderFieldsTooLarge: {
    new (msg?: string | undefined): {
        status: number;
        error: "request_header_fields_too_large";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"request_header_fields_too_large">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UnavailableForLegalReasons: {
    new (msg?: string | undefined): {
        status: number;
        error: "unavailable_for_legal_reasons";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"unavailable_for_legal_reasons">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const InternalServerError: {
    new (msg?: string | undefined): {
        status: number;
        error: "internal_error";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"internal_error">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const NotImplemented: {
    new (msg?: string | undefined): {
        status: number;
        error: "not_implemented";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"not_implemented">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const BadGateway: {
    new (msg?: string | undefined): {
        status: number;
        error: "bad_gateway";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"bad_gateway">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ServiceUnavailable: {
    new (msg?: string | undefined): {
        status: number;
        error: "service_unavailable";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"service_unavailable">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const GatewayTimeout: {
    new (msg?: string | undefined): {
        status: number;
        error: "gateway_timeout";
        message: string;
        expose: boolean;
        toJSON(): ErrorDetails<"gateway_timeout">;
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    defaultMessage: string;
    define<T extends string>(options: ErrorDefaults<T>): {
        new (msg?: string | undefined): {
            status: number;
            error: T;
            message: string;
            expose: boolean;
            toJSON(): ErrorDetails<T>;
            toString(): string;
            name: string;
            stack?: string | undefined;
        };
        defaultMessage: string;
        define<T extends string>(options: ErrorDefaults<T>): any;
        captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
        prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
        stackTraceLimit: number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
