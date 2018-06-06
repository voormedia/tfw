/* @flow */
/* eslint-disable no-console */
import path from "path"
import stackTrace from "stack-trace"

import MemoryConsole from "./memory-console"

export type HttpRequest = {|
  requestMethod: string,
  requestUrl: string,
  requestSize: number,
  status: number,
  responseSize: number,
  userAgent?: string,
  remoteIp?: string,
  referer?: string,
  latency?: string,
  cacheHit?: boolean,
  cacheValidatedWithOriginServer?: boolean,
|}

export type SourceLocation = {|
  file?: string,
  function?: string,
  line?: number,
|}

export type LogSeverity = (
  "DEBUG" |
  "INFO" |
  "NOTICE" |
  "WARNING" |
  "ERROR" |
  "CRITICAL" |
  "ALERT" |
  "EMERGENCY"
)

/* https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry */
/* https://github.com/GoogleCloudPlatform/fluent-plugin-google-cloud/blob/master/lib/fluent/plugin/out_google_cloud.rb */
/* Note, this is actually the contents of jsonPayload, so it can contain
   arbitrary fields! */
export type LogEntry = {
  time: Date,
  message: string,
  severity: LogSeverity,
  httpRequest?: HttpRequest,
  "logging.googleapis.com/sourceLocation"?: SourceLocation,
}

export type LogContext = {
  httpRequest?: HttpRequest,
  "logging.googleapis.com/sourceLocation"?: SourceLocation,
}

export class Logger {
  console: console.Console
  formatter: LogEntry => string

  static JSON = JSON.stringify

  static PRETTY = (entry: LogEntry) => {
    const reset = "\x1b[0m"
    const bold = "\x1b[1m"

    const black = "\x1b[30m"
    const red = "\x1b[31m"
    const green = "\x1b[32m"
    const yellow = "\x1b[33m"
    // const blue = "\x1b[34m"

    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }

    const styles = {
      DEBUG: black + bold,
      INFO: reset,
      NOTICE: green + bold,
      WARNING: yellow + bold,
      ERROR: red + bold,
      CRITICAL: red + bold,
      ALERT: red + bold,
      EMERGENCY: red + bold,
    }

    const time = `[${entry.time.toLocaleString("en", dateOptions)}]`

    let http = ""
    if (entry.httpRequest) {
      const {remoteIp, requestMethod, requestUrl, status, responseSize} = entry.httpRequest
      http = `${remoteIp || "unknown"} - ${requestMethod.toUpperCase()} ${requestUrl} ${status} ${responseSize} - `
    }

    return `${time} ${styles[entry.severity]}${http}${entry.message}${reset}`
  }

  static get formatter(): (entry: LogEntry) => string {
    return process.env.NODE_ENV === "development" ? Logger.PRETTY : Logger.JSON
  }

  static get console(): console.Console {
    return process.env.NODE_ENV === "test" ? new MemoryConsole : console
  }

  constructor(console: console.Console = Logger.console, formatter: LogEntry => string = Logger.formatter) {
    this.console = console
    this.formatter = formatter

    Object.freeze(this)
  }

  write(severity: LogSeverity, message: mixed, context: LogContext) {
    const entry: LogEntry = {
      time: new Date,
      message: typeof message === "object" ? JSON.stringify(message) : String(message),
      severity,
    }

    this.console.log(this.formatter(Object.assign(entry, context)))
  }

  debug(message: mixed, context: LogContext = {}) {
    this.write("DEBUG", message, context)
  }

  info(message: mixed, context: LogContext = {}) {
    this.write("INFO", message, context)
  }

  notice(message: mixed, context: LogContext = {}) {
    this.write("NOTICE", message, context)
  }

  warning(message: mixed, context: LogContext = {}) {
    this.write("WARNING", message, context)
  }

  error(message: mixed, context: LogContext = {}) {
    context["logging.googleapis.com/sourceLocation"] = sourceLocation()
    this.write("ERROR", message, context)
  }

  critical(message: mixed, context: LogContext = {}) {
    context["logging.googleapis.com/sourceLocation"] = sourceLocation()
    this.write("CRITICAL", message, context)
  }
}

function sourceLocation(depth: number = 1): SourceLocation {
  const caller = stackTrace.get()[depth + 1]

  return {
    file: path.relative(process.cwd(), caller.getFileName()),
    function: caller.getFunctionName() || "(anonymous)",
    line: caller.getLineNumber(),
  }
}

export default Logger
