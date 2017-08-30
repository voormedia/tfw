"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const statusCodes = new Map();
/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */

for (const code in _http2.default.STATUS_CODES) {
  const number = parseInt(code);
  statusCodes.set(number, _http2.default.STATUS_CODES[number].toLowerCase());
}

function log(logger) {
  return function log(next) {
    this;

    const socket = this.request.socket;

    /* Check what has been previously recorded as read/written on this socket.
       The request may not be the first over this socket. */
    const bytesReadPreviously = socket.bytesReadPreviously || 0;
    const bytesWrittenPreviously = socket.bytesWrittenPreviously || 0;

    const startTime = process.hrtime();

    this.data.log = {};

    this.response.once("finish", () => {
      /* Store current read/written count for future reference. */
      socket.bytesReadPreviously = socket.bytesRead;
      socket.bytesWrittenPreviously = socket.bytesWritten;

      const requestMethod = this.method;
      const requestUrl = this.url;
      const requestSize = socket.bytesRead - bytesReadPreviously;

      const status = this.response.statusCode;
      const responseSize = socket.bytesWritten - bytesWrittenPreviously;

      const userAgent = this.get("user-agent");
      const referer = this.get("referer");

      const [sec, nano] = process.hrtime(startTime);
      const latency = `${(sec + 1e-9 * nano).toFixed(3)}s`;

      let remoteIp = socket.remoteAddress;
      const forwarded = this.get("x-forwarded-for");
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
        // protocol, TODO
      };

      const logContext = Object.assign({}, this.data.log, { httpRequest });

      if (status >= 500 && this.data.error) {
        /* An error was thrown somewhere. */
        if (this.data.error.expose) {
          /* This error is exposable, so it is to be expected. */
          logger.warning(this.data.error.message || "(no message)", logContext);
        } else {
          /* This was an internal error, not supposed to be exposed. Log the
             entire stack trace so we can debug later. */
          logger.error(this.data.error.stack || this.data.error.toString(), logContext);
        }
      } else {
        /* No error was thrown, or error was in 4xx range. */
        logger.info(statusCodes.get(status), logContext);
      }
    });

    return next();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsInNvY2tldCIsInJlcXVlc3QiLCJieXRlc1JlYWRQcmV2aW91c2x5IiwiYnl0ZXNXcml0dGVuUHJldmlvdXNseSIsInN0YXJ0VGltZSIsInByb2Nlc3MiLCJocnRpbWUiLCJkYXRhIiwicmVzcG9uc2UiLCJvbmNlIiwiYnl0ZXNSZWFkIiwiYnl0ZXNXcml0dGVuIiwicmVxdWVzdE1ldGhvZCIsIm1ldGhvZCIsInJlcXVlc3RVcmwiLCJ1cmwiLCJyZXF1ZXN0U2l6ZSIsInN0YXR1cyIsInN0YXR1c0NvZGUiLCJyZXNwb25zZVNpemUiLCJ1c2VyQWdlbnQiLCJnZXQiLCJyZWZlcmVyIiwic2VjIiwibmFubyIsImxhdGVuY3kiLCJ0b0ZpeGVkIiwicmVtb3RlSXAiLCJyZW1vdGVBZGRyZXNzIiwiZm9yd2FyZGVkIiwic3BsaXQiLCJzaGlmdCIsImh0dHBSZXF1ZXN0IiwibG9nQ29udGV4dCIsIk9iamVjdCIsImFzc2lnbiIsImVycm9yIiwiZXhwb3NlIiwid2FybmluZyIsIm1lc3NhZ2UiLCJzdGFjayIsInRvU3RyaW5nIiwiaW5mbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBbUJ3QkEsRzs7QUFoQnhCOzs7Ozs7QUFVQSxNQUFNQyxjQUFtQyxJQUFJQyxHQUFKLEVBQXpDO0FBWkE7QUFDQTs7QUFZQSxLQUFLLE1BQU1DLElBQVgsSUFBbUIsZUFBS0MsWUFBeEIsRUFBc0M7QUFDcEMsUUFBTUMsU0FBU0MsU0FBU0gsSUFBVCxDQUFmO0FBQ0FGLGNBQVlNLEdBQVosQ0FBZ0JGLE1BQWhCLEVBQXdCLGVBQUtELFlBQUwsQ0FBa0JDLE1BQWxCLEVBQTBCRyxXQUExQixFQUF4QjtBQUNEOztBQUVjLFNBQVNSLEdB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bGludC1kaXNhYmxlIGRvdC1ub3RhdGlvbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgaHR0cCBmcm9tIFwiaHR0cFwiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7SHR0cFJlcXVlc3QsIExvZ0NvbnRleHQsIExvZ2dlcn0gZnJvbSBcIi4uL3V0aWwvbG9nZ2VyXCJcblxudHlwZSBTdGF0c1NvY2tldCA9IG5ldCRTb2NrZXQgJiB7XG4gIGJ5dGVzUmVhZFByZXZpb3VzbHk/OiBudW1iZXIsXG4gIGJ5dGVzV3JpdHRlblByZXZpb3VzbHk/OiBudW1iZXIsXG59XG5cbmNvbnN0IHN0YXR1c0NvZGVzOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcFxuZm9yIChjb25zdCBjb2RlIGluIGh0dHAuU1RBVFVTX0NPREVTKSB7XG4gIGNvbnN0IG51bWJlciA9IHBhcnNlSW50KGNvZGUpXG4gIHN0YXR1c0NvZGVzLnNldChudW1iZXIsIGh0dHAuU1RBVFVTX0NPREVTW251bWJlcl0udG9Mb3dlckNhc2UoKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9nKGxvZ2dlcjogTG9nZ2VyKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBmdW5jdGlvbiBsb2cobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgY29uc3Qgc29ja2V0OiBTdGF0c1NvY2tldCA9IHRoaXMucmVxdWVzdC5zb2NrZXRcblxuICAgIC8qIENoZWNrIHdoYXQgaGFzIGJlZW4gcHJldmlvdXNseSByZWNvcmRlZCBhcyByZWFkL3dyaXR0ZW4gb24gdGhpcyBzb2NrZXQuXG4gICAgICAgVGhlIHJlcXVlc3QgbWF5IG5vdCBiZSB0aGUgZmlyc3Qgb3ZlciB0aGlzIHNvY2tldC4gKi9cbiAgICBjb25zdCBieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFByZXZpb3VzbHkgfHwgMFxuICAgIGNvbnN0IGJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuUHJldmlvdXNseSB8fCAwXG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBwcm9jZXNzLmhydGltZSgpXG5cbiAgICB0aGlzLmRhdGEubG9nID0ge31cblxuICAgIHRoaXMucmVzcG9uc2Uub25jZShcImZpbmlzaFwiLCAoKSA9PiB7XG4gICAgICAvKiBTdG9yZSBjdXJyZW50IHJlYWQvd3JpdHRlbiBjb3VudCBmb3IgZnV0dXJlIHJlZmVyZW5jZS4gKi9cbiAgICAgIHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFxuICAgICAgc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuXG5cbiAgICAgIGNvbnN0IHJlcXVlc3RNZXRob2QgPSB0aGlzLm1ldGhvZFxuICAgICAgY29uc3QgcmVxdWVzdFVybCA9IHRoaXMudXJsXG4gICAgICBjb25zdCByZXF1ZXN0U2l6ZSA9IHNvY2tldC5ieXRlc1JlYWQgLSBieXRlc1JlYWRQcmV2aW91c2x5XG5cbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMucmVzcG9uc2Uuc3RhdHVzQ29kZVxuICAgICAgY29uc3QgcmVzcG9uc2VTaXplID0gc29ja2V0LmJ5dGVzV3JpdHRlbiAtIGJ5dGVzV3JpdHRlblByZXZpb3VzbHlcblxuICAgICAgY29uc3QgdXNlckFnZW50ID0gdGhpcy5nZXQoXCJ1c2VyLWFnZW50XCIpXG4gICAgICBjb25zdCByZWZlcmVyID0gdGhpcy5nZXQoXCJyZWZlcmVyXCIpXG5cbiAgICAgIGNvbnN0IFtzZWMsIG5hbm9dID0gcHJvY2Vzcy5ocnRpbWUoc3RhcnRUaW1lKVxuICAgICAgY29uc3QgbGF0ZW5jeSA9IGAkeyhzZWMgKyAxZS05ICogbmFubykudG9GaXhlZCgzKX1zYFxuXG4gICAgICBsZXQgcmVtb3RlSXAgPSBzb2NrZXQucmVtb3RlQWRkcmVzc1xuICAgICAgY29uc3QgZm9yd2FyZGVkID0gdGhpcy5nZXQoXCJ4LWZvcndhcmRlZC1mb3JcIilcbiAgICAgIGlmIChmb3J3YXJkZWQpIHtcbiAgICAgICAgcmVtb3RlSXAgPSBmb3J3YXJkZWQuc3BsaXQoXCIsXCIpLnNoaWZ0KClcbiAgICAgIH1cblxuICAgICAgY29uc3QgaHR0cFJlcXVlc3Q6IEh0dHBSZXF1ZXN0ID0ge1xuICAgICAgICByZXF1ZXN0TWV0aG9kLFxuICAgICAgICByZXF1ZXN0VXJsLFxuICAgICAgICByZXF1ZXN0U2l6ZSxcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICByZXNwb25zZVNpemUsXG4gICAgICAgIHVzZXJBZ2VudCxcbiAgICAgICAgcmVtb3RlSXAsXG4gICAgICAgIHJlZmVyZXIsXG4gICAgICAgIGxhdGVuY3ksXG4gICAgICAgIC8vIHByb3RvY29sLCBUT0RPXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvZ0NvbnRleHQ6IExvZ0NvbnRleHQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEubG9nLCB7aHR0cFJlcXVlc3R9KVxuXG4gICAgICBpZiAoc3RhdHVzID49IDUwMCAmJiB0aGlzLmRhdGEuZXJyb3IpIHtcbiAgICAgICAgLyogQW4gZXJyb3Igd2FzIHRocm93biBzb21ld2hlcmUuICovXG4gICAgICAgIGlmICh0aGlzLmRhdGEuZXJyb3IuZXhwb3NlKSB7XG4gICAgICAgICAgLyogVGhpcyBlcnJvciBpcyBleHBvc2FibGUsIHNvIGl0IGlzIHRvIGJlIGV4cGVjdGVkLiAqL1xuICAgICAgICAgIGxvZ2dlci53YXJuaW5nKHRoaXMuZGF0YS5lcnJvci5tZXNzYWdlIHx8IFwiKG5vIG1lc3NhZ2UpXCIsIGxvZ0NvbnRleHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogVGhpcyB3YXMgYW4gaW50ZXJuYWwgZXJyb3IsIG5vdCBzdXBwb3NlZCB0byBiZSBleHBvc2VkLiBMb2cgdGhlXG4gICAgICAgICAgICAgZW50aXJlIHN0YWNrIHRyYWNlIHNvIHdlIGNhbiBkZWJ1ZyBsYXRlci4gKi9cbiAgICAgICAgICBsb2dnZXIuZXJyb3IodGhpcy5kYXRhLmVycm9yLnN0YWNrIHx8IHRoaXMuZGF0YS5lcnJvci50b1N0cmluZygpLCBsb2dDb250ZXh0KVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBObyBlcnJvciB3YXMgdGhyb3duLCBvciBlcnJvciB3YXMgaW4gNHh4IHJhbmdlLiAqL1xuICAgICAgICBsb2dnZXIuaW5mbyhzdGF0dXNDb2Rlcy5nZXQoc3RhdHVzKSwgbG9nQ29udGV4dClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIG5leHQoKVxuICB9XG59XG4iXX0=