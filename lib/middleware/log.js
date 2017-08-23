"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable dot-notation */


const statusCodes = new Map();
for (const code in _http2.default.STATUS_CODES) {
  const number = parseInt(code);
  statusCodes.set(number, _http2.default.STATUS_CODES[number].toLowerCase());
}

function log(logger) {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      const ctx = this;
      const socket = ctx.req.socket;

      /* Check what has been previously recorded as read/written on this socket.
         The request may not be the first over this socket. */
      const bytesReadPreviously = socket.bytesReadPreviously || 0;
      const bytesWrittenPreviously = socket.bytesWrittenPreviously || 0;

      const startTime = process.hrtime();

      ctx.data.log = {};

      try {
        return yield next();
      } finally {

        /* Store current read/written count for future reference. */
        socket.bytesReadPreviously = socket.bytesRead;
        socket.bytesWrittenPreviously = socket.bytesWritten;

        const requestMethod = ctx.req.method;
        const requestUrl = ctx.req.url;
        const requestSize = socket.bytesRead - bytesReadPreviously;

        const status = ctx.res.statusCode;
        const responseSize = socket.bytesWritten - bytesWrittenPreviously;

        const userAgent = ctx.req.headers["user-agent"];
        const referer = ctx.req.headers["referer"];

        const [sec, nano] = process.hrtime(startTime);
        const latency = `${(sec + 1e-9 * nano).toFixed(3)}s`;

        let remoteIp = ctx.req.socket.remoteAddress;
        const forwarded = ctx.req.headers["x-forwarded-for"];
        if (forwarded) {
          remoteIp = forwarded.split(",").shift();
        }

        const httpRequest = {
          requestMethod,
          requestUrl,
          requestSize,
          status,
          responseSize,
          userAgent,
          remoteIp,
          referer,
          latency
        };

        const logContext = Object.assign({}, ctx.data.log, { httpRequest });

        if (status >= 500 && ctx.data.error) {
          /* An error was thrown somewhere. */
          if (ctx.data.error.expose) {
            /* This error is exposable, so it is to be expected. */
            logger.warning(ctx.data.error.message || "(no message)", logContext);
          } else {
            /* This was an internal error, not supposed to be exposed. Log the
               entire stack trace so we can debug later. */
            logger.error(ctx.data.error.stack || ctx.data.error.toString(), logContext);
          }
        } else {
          /* No error was thrown, or error was in 4xx range. */
          logger.info(statusCodes.get(status), logContext);
        }
      }
    });

    function log(_x) {
      return _ref.apply(this, arguments);
    }

    return log;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsImN0eCIsInNvY2tldCIsInJlcSIsImJ5dGVzUmVhZFByZXZpb3VzbHkiLCJieXRlc1dyaXR0ZW5QcmV2aW91c2x5Iiwic3RhcnRUaW1lIiwicHJvY2VzcyIsImhydGltZSIsImRhdGEiLCJieXRlc1JlYWQiLCJieXRlc1dyaXR0ZW4iLCJyZXF1ZXN0TWV0aG9kIiwibWV0aG9kIiwicmVxdWVzdFVybCIsInVybCIsInJlcXVlc3RTaXplIiwic3RhdHVzIiwicmVzIiwic3RhdHVzQ29kZSIsInJlc3BvbnNlU2l6ZSIsInVzZXJBZ2VudCIsImhlYWRlcnMiLCJyZWZlcmVyIiwic2VjIiwibmFubyIsImxhdGVuY3kiLCJ0b0ZpeGVkIiwicmVtb3RlSXAiLCJyZW1vdGVBZGRyZXNzIiwiZm9yd2FyZGVkIiwic3BsaXQiLCJzaGlmdCIsImh0dHBSZXF1ZXN0IiwibG9nQ29udGV4dCIsIk9iamVjdCIsImFzc2lnbiIsImVycm9yIiwiZXhwb3NlIiwid2FybmluZyIsIm1lc3NhZ2UiLCJzdGFjayIsInRvU3RyaW5nIiwiaW5mbyIsImdldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBa0J3QkEsRzs7QUFoQnhCOzs7Ozs7O0FBREE7OztBQVdBLE1BQU1DLGNBQW1DLElBQUlDLEdBQUosRUFBekM7QUFDQSxLQUFLLE1BQU1DLElBQVgsSUFBbUIsZUFBS0MsWUFBeEIsRUFBc0M7QUFDcEMsUUFBTUMsU0FBU0MsU0FBU0gsSUFBVCxDQUFmO0FBQ0FGLGNBQVlNLEdBQVosQ0FBZ0JGLE1BQWhCLEVBQXdCLGVBQUtELFlBQUwsQ0FBa0JDLE1BQWxCLEVBQTBCRyxXQUExQixFQUF4QjtBQUNEOztBQUVjLFNBQVNSLEdBQVQs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QUFDRixLQXJFRDs7QUFBQSxhQUFzQjVDLEdBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsR0FBdEI7QUFBQTtBQXNFRCIsImZpbGUiOiJsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgZG90LW5vdGF0aW9uICovXG5pbXBvcnQgaHR0cCBmcm9tIFwiaHR0cFwiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7SHR0cFJlcXVlc3QsIExvZ0NvbnRleHQsIExvZ2dlcn0gZnJvbSBcIi4uL3V0aWwvbG9nZ2VyXCJcblxudHlwZSBTdGF0c1NvY2tldCA9IG5ldCRTb2NrZXQgJiB7XG4gIGJ5dGVzUmVhZFByZXZpb3VzbHk/OiBudW1iZXIsXG4gIGJ5dGVzV3JpdHRlblByZXZpb3VzbHk/OiBudW1iZXIsXG59XG5cbmNvbnN0IHN0YXR1c0NvZGVzOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcFxuZm9yIChjb25zdCBjb2RlIGluIGh0dHAuU1RBVFVTX0NPREVTKSB7XG4gIGNvbnN0IG51bWJlciA9IHBhcnNlSW50KGNvZGUpXG4gIHN0YXR1c0NvZGVzLnNldChudW1iZXIsIGh0dHAuU1RBVFVTX0NPREVTW251bWJlcl0udG9Mb3dlckNhc2UoKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9nKGxvZ2dlcjogTG9nZ2VyKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBsb2cobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcbiAgICBjb25zdCBzb2NrZXQ6IFN0YXRzU29ja2V0ID0gY3R4LnJlcS5zb2NrZXRcblxuICAgIC8qIENoZWNrIHdoYXQgaGFzIGJlZW4gcHJldmlvdXNseSByZWNvcmRlZCBhcyByZWFkL3dyaXR0ZW4gb24gdGhpcyBzb2NrZXQuXG4gICAgICAgVGhlIHJlcXVlc3QgbWF5IG5vdCBiZSB0aGUgZmlyc3Qgb3ZlciB0aGlzIHNvY2tldC4gKi9cbiAgICBjb25zdCBieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFByZXZpb3VzbHkgfHwgMFxuICAgIGNvbnN0IGJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuUHJldmlvdXNseSB8fCAwXG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBwcm9jZXNzLmhydGltZSgpXG5cbiAgICBjdHguZGF0YS5sb2cgPSB7fVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuZXh0KClcbiAgICB9IGZpbmFsbHkge1xuXG4gICAgICAvKiBTdG9yZSBjdXJyZW50IHJlYWQvd3JpdHRlbiBjb3VudCBmb3IgZnV0dXJlIHJlZmVyZW5jZS4gKi9cbiAgICAgIHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFxuICAgICAgc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuXG5cbiAgICAgIGNvbnN0IHJlcXVlc3RNZXRob2QgPSBjdHgucmVxLm1ldGhvZFxuICAgICAgY29uc3QgcmVxdWVzdFVybCA9IGN0eC5yZXEudXJsXG4gICAgICBjb25zdCByZXF1ZXN0U2l6ZSA9IHNvY2tldC5ieXRlc1JlYWQgLSBieXRlc1JlYWRQcmV2aW91c2x5XG5cbiAgICAgIGNvbnN0IHN0YXR1cyA9IGN0eC5yZXMuc3RhdHVzQ29kZVxuICAgICAgY29uc3QgcmVzcG9uc2VTaXplID0gc29ja2V0LmJ5dGVzV3JpdHRlbiAtIGJ5dGVzV3JpdHRlblByZXZpb3VzbHlcblxuICAgICAgY29uc3QgdXNlckFnZW50ID0gY3R4LnJlcS5oZWFkZXJzW1widXNlci1hZ2VudFwiXVxuICAgICAgY29uc3QgcmVmZXJlciA9IGN0eC5yZXEuaGVhZGVyc1tcInJlZmVyZXJcIl1cblxuICAgICAgY29uc3QgW3NlYywgbmFub10gPSBwcm9jZXNzLmhydGltZShzdGFydFRpbWUpXG4gICAgICBjb25zdCBsYXRlbmN5ID0gYCR7KHNlYyArIDFlLTkgKiBuYW5vKS50b0ZpeGVkKDMpfXNgXG5cbiAgICAgIGxldCByZW1vdGVJcCA9IGN0eC5yZXEuc29ja2V0LnJlbW90ZUFkZHJlc3NcbiAgICAgIGNvbnN0IGZvcndhcmRlZCA9IGN0eC5yZXEuaGVhZGVyc1tcIngtZm9yd2FyZGVkLWZvclwiXVxuICAgICAgaWYgKGZvcndhcmRlZCkge1xuICAgICAgICByZW1vdGVJcCA9IGZvcndhcmRlZC5zcGxpdChcIixcIikuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBodHRwUmVxdWVzdDogSHR0cFJlcXVlc3QgPSB7XG4gICAgICAgIHJlcXVlc3RNZXRob2QsXG4gICAgICAgIHJlcXVlc3RVcmwsXG4gICAgICAgIHJlcXVlc3RTaXplLFxuICAgICAgICBzdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlU2l6ZSxcbiAgICAgICAgdXNlckFnZW50LFxuICAgICAgICByZW1vdGVJcCxcbiAgICAgICAgcmVmZXJlcixcbiAgICAgICAgbGF0ZW5jeSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9nQ29udGV4dDogTG9nQ29udGV4dCA9IE9iamVjdC5hc3NpZ24oe30sIGN0eC5kYXRhLmxvZywge2h0dHBSZXF1ZXN0fSlcblxuICAgICAgaWYgKHN0YXR1cyA+PSA1MDAgJiYgY3R4LmRhdGEuZXJyb3IpIHtcbiAgICAgICAgLyogQW4gZXJyb3Igd2FzIHRocm93biBzb21ld2hlcmUuICovXG4gICAgICAgIGlmIChjdHguZGF0YS5lcnJvci5leHBvc2UpIHtcbiAgICAgICAgICAvKiBUaGlzIGVycm9yIGlzIGV4cG9zYWJsZSwgc28gaXQgaXMgdG8gYmUgZXhwZWN0ZWQuICovXG4gICAgICAgICAgbG9nZ2VyLndhcm5pbmcoY3R4LmRhdGEuZXJyb3IubWVzc2FnZSB8fCBcIihubyBtZXNzYWdlKVwiLCBsb2dDb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIFRoaXMgd2FzIGFuIGludGVybmFsIGVycm9yLCBub3Qgc3VwcG9zZWQgdG8gYmUgZXhwb3NlZC4gTG9nIHRoZVxuICAgICAgICAgICAgIGVudGlyZSBzdGFjayB0cmFjZSBzbyB3ZSBjYW4gZGVidWcgbGF0ZXIuICovXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKGN0eC5kYXRhLmVycm9yLnN0YWNrIHx8IGN0eC5kYXRhLmVycm9yLnRvU3RyaW5nKCksIGxvZ0NvbnRleHQpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIE5vIGVycm9yIHdhcyB0aHJvd24sIG9yIGVycm9yIHdhcyBpbiA0eHggcmFuZ2UuICovXG4gICAgICAgIGxvZ2dlci5pbmZvKHN0YXR1c0NvZGVzLmdldChzdGF0dXMpLCBsb2dDb250ZXh0KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19