declare type Descriptor = {
  value: mixed,
  writable: bool,
  enumerable: bool,
  configurable: bool,
}

declare type Decorator = (
  object: Object,
  key: ?string,
  descriptor: ?Descriptor
) => ?Descriptor

declare class Console {
  /* https://github.com/facebook/flow/blob/master/lib/core.js */
  constructor(stdout: stream$Writable, stderr: stream$Writable): void;

  error(...data: any[]): void;
  log(...data: any[]): void;
  trace(...data: any[]): void;
  warn(...data: any[]): void;

  Console: typeof Console;
}

declare var console: Console;
