/// <reference types="node" />
export declare const BadRequest: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Unauthorized: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const PaymentRequired: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Forbidden: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const NotFound: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const MethodNotAllowed: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const NotAcceptable: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ProxyAuthenticationRequired: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RequestTimeout: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Conflict: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Gone: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const LengthRequired: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const PreconditionFailed: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RequestEntityTooLarge: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RequestURITooLong: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UnsupportedMediaType: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RangeNotSatisfiable: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ExpectationFailed: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ImATeapot: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const MisdirectedRequest: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UnprocessableEntity: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const Locked: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const FailedDependency: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UpgradeRequired: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const PreconditionRequired: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const TooManyRequests: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const RequestHeaderFieldsTooLarge: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UnavailableForLegalReasons: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const InternalServerError: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const NotImplemented: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const BadGateway: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ServiceUnavailable: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const GatewayTimeout: {
    new (message?: string): {
        status: number;
        error: string;
        message: string;
        expose: boolean;
        toJSON(): {
            error: string;
            message: string;
        };
        toString(): string;
        name: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
