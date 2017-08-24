/* @flow */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */
import http from "http"

import type {Context, Next, Middleware} from "../middleware"
import type {HttpRequest, LogContext, Logger} from "../util/logger"

type StatsSocket = net$Socket & {
  bytesReadPreviously?: number,
  bytesWrittenPreviously?: number,
}

const statusCodes: Map<number, string> = new Map
for (const code in http.STATUS_CODES) {
  const number = parseInt(code)
  statusCodes.set(number, http.STATUS_CODES[number].toLowerCase())
}

export default function log(logger: Logger): Middleware {
  return async function log(next: Next) {
    (this: Context)

    const socket: StatsSocket = this.request.socket

    /* Check what has been previously recorded as read/written on this socket.
       The request may not be the first over this socket. */
    const bytesReadPreviously = socket.bytesReadPreviously || 0
    const bytesWrittenPreviously = socket.bytesWrittenPreviously || 0

    const startTime = process.hrtime()

    this.data.log = {}

    try {
      return await next()
    } finally {

      /* Store current read/written count for future reference. */
      socket.bytesReadPreviously = socket.bytesRead
      socket.bytesWrittenPreviously = socket.bytesWritten

      const requestMethod = this.method
      const requestUrl = this.url
      const requestSize = socket.bytesRead - bytesReadPreviously

      const status = this.response.statusCode
      const responseSize = socket.bytesWritten - bytesWrittenPreviously

      const userAgent = this.get("user-agent")
      const referer = this.get("referer")

      const [sec, nano] = process.hrtime(startTime)
      const latency = `${(sec + 1e-9 * nano).toFixed(3)}s`

      let remoteIp = socket.remoteAddress
      const forwarded = this.get("x-forwarded-for")
      if (forwarded) {
        remoteIp = forwarded.split(",").shift()
      }

      const httpRequest: HttpRequest = {
        requestMethod,
        requestUrl,
        requestSize,
        status,
        responseSize,
        userAgent,
        remoteIp,
        referer,
        latency,
      }

      const logContext: LogContext = Object.assign({}, this.data.log, {httpRequest})

      if (status >= 500 && this.data.error) {
        /* An error was thrown somewhere. */
        if (this.data.error.expose) {
          /* This error is exposable, so it is to be expected. */
          logger.warning(this.data.error.message || "(no message)", logContext)
        } else {
          /* This was an internal error, not supposed to be exposed. Log the
             entire stack trace so we can debug later. */
          logger.error(this.data.error.stack || this.data.error.toString(), logContext)
        }
      } else {
        /* No error was thrown, or error was in 4xx range. */
        logger.info(statusCodes.get(status), logContext)
      }
    }
  }
}
