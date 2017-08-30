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

    this.response.on("finish", () => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsInNvY2tldCIsInJlcXVlc3QiLCJieXRlc1JlYWRQcmV2aW91c2x5IiwiYnl0ZXNXcml0dGVuUHJldmlvdXNseSIsInN0YXJ0VGltZSIsInByb2Nlc3MiLCJocnRpbWUiLCJkYXRhIiwicmVzcG9uc2UiLCJvbiIsImJ5dGVzUmVhZCIsImJ5dGVzV3JpdHRlbiIsInJlcXVlc3RNZXRob2QiLCJtZXRob2QiLCJyZXF1ZXN0VXJsIiwidXJsIiwicmVxdWVzdFNpemUiLCJzdGF0dXMiLCJzdGF0dXNDb2RlIiwicmVzcG9uc2VTaXplIiwidXNlckFnZW50IiwiZ2V0IiwicmVmZXJlciIsInNlYyIsIm5hbm8iLCJsYXRlbmN5IiwidG9GaXhlZCIsInJlbW90ZUlwIiwicmVtb3RlQWRkcmVzcyIsImZvcndhcmRlZCIsInNwbGl0Iiwic2hpZnQiLCJodHRwUmVxdWVzdCIsImxvZ0NvbnRleHQiLCJPYmplY3QiLCJhc3NpZ24iLCJlcnJvciIsImV4cG9zZSIsIndhcm5pbmciLCJtZXNzYWdlIiwic3RhY2siLCJ0b1N0cmluZyIsImluZm8iXSwibWFwcGluZ3MiOiI7Ozs7O2tCQW1Cd0JBLEc7O0FBaEJ4Qjs7Ozs7O0FBVUEsTUFBTUMsY0FBbUMsSUFBSUMsR0FBSixFQUF6QztBQVpBO0FBQ0E7O0FBWUEsS0FBSyxNQUFNQyxJQUFYLElBQW1CLGVBQUtDLFlBQXhCLEVBQXNDO0FBQ3BDLFFBQU1DLFNBQVNDLFNBQVNILElBQVQsQ0FBZjtBQUNBRixjQUFZTSxHQUFaLENBQWdCRixNQUFoQixFQUF3QixlQUFLRCxZQUFMLENBQWtCQyxNQUFsQixFQUEwQkcsV0FBMUIsRUFBeEI7QUFDRDs7QUFFYyxTQUFTUixHQUFU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bnQtZGlzYWJsZSBkb3Qtbm90YXRpb24gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IGh0dHAgZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge0h0dHBSZXF1ZXN0LCBMb2dDb250ZXh0LCBMb2dnZXJ9IGZyb20gXCIuLi91dGlsL2xvZ2dlclwiXG5cbnR5cGUgU3RhdHNTb2NrZXQgPSBuZXQkU29ja2V0ICYge1xuICBieXRlc1JlYWRQcmV2aW91c2x5PzogbnVtYmVyLFxuICBieXRlc1dyaXR0ZW5QcmV2aW91c2x5PzogbnVtYmVyLFxufVxuXG5jb25zdCBzdGF0dXNDb2RlczogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXBcbmZvciAoY29uc3QgY29kZSBpbiBodHRwLlNUQVRVU19DT0RFUykge1xuICBjb25zdCBudW1iZXIgPSBwYXJzZUludChjb2RlKVxuICBzdGF0dXNDb2Rlcy5zZXQobnVtYmVyLCBodHRwLlNUQVRVU19DT0RFU1tudW1iZXJdLnRvTG93ZXJDYXNlKCkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZyhsb2dnZXI6IExvZ2dlcik6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gZnVuY3Rpb24gbG9nKG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIGNvbnN0IHNvY2tldDogU3RhdHNTb2NrZXQgPSB0aGlzLnJlcXVlc3Quc29ja2V0XG5cbiAgICAvKiBDaGVjayB3aGF0IGhhcyBiZWVuIHByZXZpb3VzbHkgcmVjb3JkZWQgYXMgcmVhZC93cml0dGVuIG9uIHRoaXMgc29ja2V0LlxuICAgICAgIFRoZSByZXF1ZXN0IG1heSBub3QgYmUgdGhlIGZpcnN0IG92ZXIgdGhpcyBzb2NrZXQuICovXG4gICAgY29uc3QgYnl0ZXNSZWFkUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5IHx8IDBcbiAgICBjb25zdCBieXRlc1dyaXR0ZW5QcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgfHwgMFxuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gcHJvY2Vzcy5ocnRpbWUoKVxuXG4gICAgdGhpcy5kYXRhLmxvZyA9IHt9XG5cbiAgICB0aGlzLnJlc3BvbnNlLm9uKFwiZmluaXNoXCIsICgpID0+IHtcbiAgICAgIC8qIFN0b3JlIGN1cnJlbnQgcmVhZC93cml0dGVuIGNvdW50IGZvciBmdXR1cmUgcmVmZXJlbmNlLiAqL1xuICAgICAgc29ja2V0LmJ5dGVzUmVhZFByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNSZWFkXG4gICAgICBzb2NrZXQuYnl0ZXNXcml0dGVuUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1dyaXR0ZW5cblxuICAgICAgY29uc3QgcmVxdWVzdE1ldGhvZCA9IHRoaXMubWV0aG9kXG4gICAgICBjb25zdCByZXF1ZXN0VXJsID0gdGhpcy51cmxcbiAgICAgIGNvbnN0IHJlcXVlc3RTaXplID0gc29ja2V0LmJ5dGVzUmVhZCAtIGJ5dGVzUmVhZFByZXZpb3VzbHlcblxuICAgICAgY29uc3Qgc3RhdHVzID0gdGhpcy5yZXNwb25zZS5zdGF0dXNDb2RlXG4gICAgICBjb25zdCByZXNwb25zZVNpemUgPSBzb2NrZXQuYnl0ZXNXcml0dGVuIC0gYnl0ZXNXcml0dGVuUHJldmlvdXNseVxuXG4gICAgICBjb25zdCB1c2VyQWdlbnQgPSB0aGlzLmdldChcInVzZXItYWdlbnRcIilcbiAgICAgIGNvbnN0IHJlZmVyZXIgPSB0aGlzLmdldChcInJlZmVyZXJcIilcblxuICAgICAgY29uc3QgW3NlYywgbmFub10gPSBwcm9jZXNzLmhydGltZShzdGFydFRpbWUpXG4gICAgICBjb25zdCBsYXRlbmN5ID0gYCR7KHNlYyArIDFlLTkgKiBuYW5vKS50b0ZpeGVkKDMpfXNgXG5cbiAgICAgIGxldCByZW1vdGVJcCA9IHNvY2tldC5yZW1vdGVBZGRyZXNzXG4gICAgICBjb25zdCBmb3J3YXJkZWQgPSB0aGlzLmdldChcIngtZm9yd2FyZGVkLWZvclwiKVxuICAgICAgaWYgKGZvcndhcmRlZCkge1xuICAgICAgICByZW1vdGVJcCA9IGZvcndhcmRlZC5zcGxpdChcIixcIikuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBodHRwUmVxdWVzdDogSHR0cFJlcXVlc3QgPSB7XG4gICAgICAgIHJlcXVlc3RNZXRob2QsXG4gICAgICAgIHJlcXVlc3RVcmwsXG4gICAgICAgIHJlcXVlc3RTaXplLFxuICAgICAgICBzdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlU2l6ZSxcbiAgICAgICAgdXNlckFnZW50LFxuICAgICAgICByZW1vdGVJcCxcbiAgICAgICAgcmVmZXJlcixcbiAgICAgICAgbGF0ZW5jeSxcbiAgICAgICAgLy8gcHJvdG9jb2wsIFRPRE9cbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9nQ29udGV4dDogTG9nQ29udGV4dCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGF0YS5sb2csIHtodHRwUmVxdWVzdH0pXG5cbiAgICAgIGlmIChzdGF0dXMgPj0gNTAwICYmIHRoaXMuZGF0YS5lcnJvcikge1xuICAgICAgICAvKiBBbiBlcnJvciB3YXMgdGhyb3duIHNvbWV3aGVyZS4gKi9cbiAgICAgICAgaWYgKHRoaXMuZGF0YS5lcnJvci5leHBvc2UpIHtcbiAgICAgICAgICAvKiBUaGlzIGVycm9yIGlzIGV4cG9zYWJsZSwgc28gaXQgaXMgdG8gYmUgZXhwZWN0ZWQuICovXG4gICAgICAgICAgbG9nZ2VyLndhcm5pbmcodGhpcy5kYXRhLmVycm9yLm1lc3NhZ2UgfHwgXCIobm8gbWVzc2FnZSlcIiwgbG9nQ29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKiBUaGlzIHdhcyBhbiBpbnRlcm5hbCBlcnJvciwgbm90IHN1cHBvc2VkIHRvIGJlIGV4cG9zZWQuIExvZyB0aGVcbiAgICAgICAgICAgICBlbnRpcmUgc3RhY2sgdHJhY2Ugc28gd2UgY2FuIGRlYnVnIGxhdGVyLiAqL1xuICAgICAgICAgIGxvZ2dlci5lcnJvcih0aGlzLmRhdGEuZXJyb3Iuc3RhY2sgfHwgdGhpcy5kYXRhLmVycm9yLnRvU3RyaW5nKCksIGxvZ0NvbnRleHQpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIE5vIGVycm9yIHdhcyB0aHJvd24sIG9yIGVycm9yIHdhcyBpbiA0eHggcmFuZ2UuICovXG4gICAgICAgIGxvZ2dlci5pbmZvKHN0YXR1c0NvZGVzLmdldChzdGF0dXMpLCBsb2dDb250ZXh0KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbmV4dCgpXG4gIH1cbn1cbiJdfQ==