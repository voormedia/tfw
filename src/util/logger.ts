import hostPkg from "./host-pkg"

import MemoryConsole from "./memory-console"

export interface HttpRequest {
  requestMethod: string
  requestUrl: string
  requestSize: number
  status: number
  responseSize: number
  userAgent?: string
  remoteIp?: string
  referer?: string
  latency?: string
  cacheHit?: boolean
  cacheValidatedWithOriginServer?: boolean
}

export interface ServiceContext {
  service: string
  version?: string
}

export type LogSeverity =
  | "DEBUG"
  | "INFO"
  | "NOTICE"
  | "WARNING"
  | "ERROR"
  | "CRITICAL"
  | "ALERT"
  | "EMERGENCY"

export type Message = object | string | undefined

/* https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry */
/* https://github.com/GoogleCloudPlatform/fluent-plugin-google-cloud/blob/
   master/lib/fluent/plugin/out_google_cloud.rb */
/* https://github.com/GoogleCloudPlatform/fluent-plugin-google-cloud/issues/99 */
/* Note, this also has the contents of jsonPayload, so it can contain
   arbitrary fields! */
export interface LogEntry {
  time: Date
  message: string
  severity: LogSeverity
  httpRequest?: HttpRequest
  serviceContext?: ServiceContext
}

export interface LogContext {
  httpRequest?: HttpRequest
  [other: string]: any
}

export class Logger {
  static get formatter(): (entry: LogEntry) => string {
    return process.env.NODE_ENV === "development" ? Logger.PRETTY : Logger.JSON
  }

  static get console(): Console {
    return process.env.NODE_ENV === "test" ? new MemoryConsole() : console
  }

  static get service(): ServiceContext {
    return {
      service: hostPkg.name,
      version: hostPkg.version,
    }
  }

  static JSON = JSON.stringify.bind(JSON)

  static PRETTY = (entry: LogEntry) => {
    const reset = "\x1b[0m"
    const bold = "\x1b[1m"

    const black = "\x1b[30m"
    const red = "\x1b[31m"
    const green = "\x1b[32m"
    const yellow = "\x1b[33m"
    // TODO add const blue = "\x1b[34m"

    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    } as const

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
      const {remoteIp, requestMethod, requestUrl, status, responseSize} =
        entry.httpRequest
      http = `${
        remoteIp || "unknown"
      } - ${requestMethod.toUpperCase()} ${requestUrl} ${status} ${responseSize} - `
    }

    return `${time} ${styles[entry.severity]}${http}${entry.message}${reset}`
  }

  private readonly console: Console
  private readonly formatter: (entry: LogEntry) => string
  private readonly service: ServiceContext

  constructor(
    console: Console = Logger.console,
    formatter: (entry: LogEntry) => string = Logger.formatter,
    service: ServiceContext = Logger.service,
  ) {
    this.console = console
    this.formatter = formatter
    this.service = service

    Object.freeze(this)
  }

  write(severity: LogSeverity, message: Message, context: LogContext) {
    const entry: LogEntry = {
      time: new Date(),
      message:
        typeof message === "object" ? JSON.stringify(message) : String(message),
      serviceContext: this.service,
      severity,
    }

    this.console.log(this.formatter({...entry, ...context}))
  }

  debug(message: Message, context: LogContext = {}) {
    this.write("DEBUG", message, context)
  }

  info(message: Message, context: LogContext = {}) {
    this.write("INFO", message, context)
  }

  notice(message: Message, context: LogContext = {}) {
    this.write("NOTICE", message, context)
  }

  warning(message: Message, context: LogContext = {}) {
    this.write("WARNING", message, context)
  }

  error(message: Message, context: LogContext = {}) {
    this.write("ERROR", message, context)
  }

  critical(message: Message, context: LogContext = {}) {
    this.write("CRITICAL", message, context)
  }
}

export default Logger
