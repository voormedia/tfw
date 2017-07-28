/* @flow */
/* eslint-disable dot-notation */
import http from "http"

import type {Context, Next, Middleware} from "../middleware"
import type {HttpRequest, Logger} from "../util/logger"

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
    const ctx: Context = this
    const socket: StatsSocket = ctx.req.socket

    /* Check what has been previously recorded as read/written on this socket.
       The request may not be the first over this socket. */
    const bytesReadPreviously = socket.bytesReadPreviously || 0
    const bytesWrittenPreviously = socket.bytesWrittenPreviously || 0

    const startTime = process.hrtime()

    try {
      return await next()
    } finally {

      /* Store current read/written count for future reference. */
      socket.bytesReadPreviously = socket.bytesRead
      socket.bytesWrittenPreviously = socket.bytesWritten

      const requestMethod = ctx.req.method
      const requestUrl = ctx.req.url
      const requestSize = socket.bytesRead - bytesReadPreviously

      const status = ctx.res.statusCode
      const responseSize = socket.bytesWritten - bytesWrittenPreviously

      const userAgent = ctx.req.headers["user-agent"]
      const referer = ctx.req.headers["referer"]

      const [sec, nano] = process.hrtime(startTime)
      const latency = `${(sec + 1e-9 * nano).toFixed(3)}s`

      let remoteIp = ctx.req.socket.remoteAddress
      const forwarded = ctx.req.headers["x-forwarded-for"]
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

      if (ctx.data.error) {
        logger.error(ctx.data.error.stack || ctx.data.error.toString(), httpRequest)
      } else {
        if (status >= 500) {
          logger.warning(statusCodes.get(status), httpRequest)
        } else {
          logger.info(statusCodes.get(status), httpRequest)
        }
      }
    }
  }
}
