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
/* eslint-disable no-unused-expressions */


const statusCodes = new Map();
for (const code in _http2.default.STATUS_CODES) {
  const number = parseInt(code);
  statusCodes.set(number, _http2.default.STATUS_CODES[number].toLowerCase());
}

function log(logger) {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      this;

      const socket = this.request.socket;

      /* Check what has been previously recorded as read/written on this socket.
         The request may not be the first over this socket. */
      const bytesReadPreviously = socket.bytesReadPreviously || 0;
      const bytesWrittenPreviously = socket.bytesWrittenPreviously || 0;

      const startTime = process.hrtime();

      this.data.log = {};

      try {
        return yield next();
      } finally {

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
      }
    });

    function log(_x) {
      return _ref.apply(this, arguments);
    }

    return log;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsInNvY2tldCIsInJlcXVlc3QiLCJieXRlc1JlYWRQcmV2aW91c2x5IiwiYnl0ZXNXcml0dGVuUHJldmlvdXNseSIsInN0YXJ0VGltZSIsInByb2Nlc3MiLCJocnRpbWUiLCJkYXRhIiwiYnl0ZXNSZWFkIiwiYnl0ZXNXcml0dGVuIiwicmVxdWVzdE1ldGhvZCIsIm1ldGhvZCIsInJlcXVlc3RVcmwiLCJ1cmwiLCJyZXF1ZXN0U2l6ZSIsInN0YXR1cyIsInJlc3BvbnNlIiwic3RhdHVzQ29kZSIsInJlc3BvbnNlU2l6ZSIsInVzZXJBZ2VudCIsImdldCIsInJlZmVyZXIiLCJzZWMiLCJuYW5vIiwibGF0ZW5jeSIsInRvRml4ZWQiLCJyZW1vdGVJcCIsInJlbW90ZUFkZHJlc3MiLCJmb3J3YXJkZWQiLCJzcGxpdCIsInNoaWZ0IiwiaHR0cFJlcXVlc3QiLCJsb2dDb250ZXh0IiwiT2JqZWN0IiwiYXNzaWduIiwiZXJyb3IiLCJleHBvc2UiLCJ3YXJuaW5nIiwibWVzc2FnZSIsInN0YWNrIiwidG9TdHJpbmciLCJpbmZvIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFtQndCQSxHOztBQWhCeEI7Ozs7Ozs7QUFGQTtBQUNBOzs7QUFXQSxNQUFNQyxjQUFtQyxJQUFJQyxHQUFKLEVBQXpDO0FBQ0EsS0FBSyxNQUFNQyxJQUFYLElBQW1CLGVBQUtDLFlBQXhCLEVBQXNDO0FBQ3BDLFFBQU1DLFNBQVNDLFNBQVNILElBQVQsQ0FBZjtBQUNBRixjQUFZTSxHQUFaLENBQWdCRixNQUFoQixFQUF3QixlQUFLRCxZQUFMLENBQWtCQyxNQUFsQixFQUEwQkcsV0FBMUIsRUFBeEI7QUFDRDs7QUFFYyxTQUFTUixHQUFULENBQWFTLE1BQWIsRUFBeUM7QUFDdEQ7QUFBQSxpQ0FBTyxXQUFtQkMsSUFBbkIsRUFBK0I7QUFDbkMsVUFBRDs7QUFFQSxZQUFNQyxTQUFzQixLQUFLQyxPQUFMLENBQWFELE1BQXpDOztBQUVBOztBQUVBLFlBQU1FLHNCQUFzQkYsT0FBT0UsbUJBQVAsSUFBOEIsQ0FBMUQ7QUFDQSxZQUFNQyx5QkFBeUJILE9BQU9HLHNCQUFQLElBQWlDLENBQWhFOztBQUVBLFlBQU1DLFlBQVlDLFFBQVFDLE1BQVIsRUFBbEI7O0FBRUEsV0FBS0MsSUFBTCxDQUFVbEIsR0FBVixHQUFnQixFQUFoQjs7QUFFQSxVQUFJO0FBQ0YsZUFBTyxNQUFNVSxNQUFiO0FBQ0QsT0FGRCxTQUVVOztBQUVSO0FBQ0FDLGVBQU9FLG1CQUFQLEdBQTZCRixPQUFPUSxTQUFwQztBQUNBUixlQUFPRyxzQkFBUCxHQUFnQ0gsT0FBT1MsWUFBdkM7O0FBRUEsY0FBTUMsZ0JBQWdCLEtBQUtDLE1BQTNCO0FBQ0EsY0FBTUMsYUFBYSxLQUFLQyxHQUF4QjtBQUNBLGNBQU1DLGNBQWNkLE9BQU9RLFNBQVAsR0FBbUJOLG1CQUF2Qzs7QUFFQSxjQUFNYSxTQUFTLEtBQUtDLFFBQUwsQ0FBY0MsVUFBN0I7QUFDQSxjQUFNQyxlQUFlbEIsT0FBT1MsWUFBUCxHQUFzQk4sc0JBQTNDOztBQUVBLGNBQU1nQixZQUFZLEtBQUtDLEdBQUwsQ0FBUyxZQUFULENBQWxCO0FBQ0EsY0FBTUMsVUFBVSxLQUFLRCxHQUFMLENBQVMsU0FBVCxDQUFoQjs7QUFFQSxjQUFNLENBQUNFLEdBQUQsRUFBTUMsSUFBTixJQUFjbEIsUUFBUUMsTUFBUixDQUFlRixTQUFmLENBQXBCO0FBQ0EsY0FBTW9CLFVBQVcsR0FBRSxDQUFDRixNQUFNLE9BQU9DLElBQWQsRUFBb0JFLE9BQXBCLENBQTRCLENBQTVCLENBQStCLEdBQWxEOztBQUVBLFlBQUlDLFdBQVcxQixPQUFPMkIsYUFBdEI7QUFDQSxjQUFNQyxZQUFZLEtBQUtSLEdBQUwsQ0FBUyxpQkFBVCxDQUFsQjtBQUNBLFlBQUlRLFNBQUosRUFBZTtBQUNiRixxQkFBV0UsVUFBVUMsS0FBVixDQUFnQixHQUFoQixFQUFxQkMsS0FBckIsRUFBWDtBQUNEOztBQUVELGNBQU1DLGNBQTJCO0FBQy9CckIsdUJBRCtCO0FBRS9CRSxvQkFGK0I7QUFHL0JFLHFCQUgrQjtBQUkvQkMsZ0JBSitCO0FBSy9CRyxzQkFMK0I7QUFNL0JDLG1CQU4rQjtBQU8vQk8sa0JBUCtCO0FBUS9CTCxpQkFSK0I7QUFTL0JHO0FBQ0E7QUFWK0IsU0FBakM7O0FBYUEsY0FBTVEsYUFBeUJDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUszQixJQUFMLENBQVVsQixHQUE1QixFQUFpQyxFQUFDMEMsV0FBRCxFQUFqQyxDQUEvQjs7QUFFQSxZQUFJaEIsVUFBVSxHQUFWLElBQWlCLEtBQUtSLElBQUwsQ0FBVTRCLEtBQS9CLEVBQXNDO0FBQ3BDO0FBQ0EsY0FBSSxLQUFLNUIsSUFBTCxDQUFVNEIsS0FBVixDQUFnQkMsTUFBcEIsRUFBNEI7QUFDMUI7QUFDQXRDLG1CQUFPdUMsT0FBUCxDQUFlLEtBQUs5QixJQUFMLENBQVU0QixLQUFWLENBQWdCRyxPQUFoQixJQUEyQixjQUExQyxFQUEwRE4sVUFBMUQ7QUFDRCxXQUhELE1BR087QUFDTDs7QUFFQWxDLG1CQUFPcUMsS0FBUCxDQUFhLEtBQUs1QixJQUFMLENBQVU0QixLQUFWLENBQWdCSSxLQUFoQixJQUF5QixLQUFLaEMsSUFBTCxDQUFVNEIsS0FBVixDQUFnQkssUUFBaEIsRUFBdEMsRUFBa0VSLFVBQWxFO0FBQ0Q7QUFDRixTQVZELE1BVU87QUFDTDtBQUNBbEMsaUJBQU8yQyxJQUFQLENBQVluRCxZQUFZOEIsR0FBWixDQUFnQkwsTUFBaEIsQ0FBWixFQUFxQ2lCLFVBQXJDO0FBQ0Q7QUFDRjtBQUNGLEtBdkVEOztBQUFBLGFBQXNCM0MsR0FBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxHQUF0QjtBQUFBO0FBd0VEIiwiZmlsZSI6ImxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBkb3Qtbm90YXRpb24gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IGh0dHAgZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge0h0dHBSZXF1ZXN0LCBMb2dDb250ZXh0LCBMb2dnZXJ9IGZyb20gXCIuLi91dGlsL2xvZ2dlclwiXG5cbnR5cGUgU3RhdHNTb2NrZXQgPSBuZXQkU29ja2V0ICYge1xuICBieXRlc1JlYWRQcmV2aW91c2x5PzogbnVtYmVyLFxuICBieXRlc1dyaXR0ZW5QcmV2aW91c2x5PzogbnVtYmVyLFxufVxuXG5jb25zdCBzdGF0dXNDb2RlczogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXBcbmZvciAoY29uc3QgY29kZSBpbiBodHRwLlNUQVRVU19DT0RFUykge1xuICBjb25zdCBudW1iZXIgPSBwYXJzZUludChjb2RlKVxuICBzdGF0dXNDb2Rlcy5zZXQobnVtYmVyLCBodHRwLlNUQVRVU19DT0RFU1tudW1iZXJdLnRvTG93ZXJDYXNlKCkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZyhsb2dnZXI6IExvZ2dlcik6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbG9nKG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIGNvbnN0IHNvY2tldDogU3RhdHNTb2NrZXQgPSB0aGlzLnJlcXVlc3Quc29ja2V0XG5cbiAgICAvKiBDaGVjayB3aGF0IGhhcyBiZWVuIHByZXZpb3VzbHkgcmVjb3JkZWQgYXMgcmVhZC93cml0dGVuIG9uIHRoaXMgc29ja2V0LlxuICAgICAgIFRoZSByZXF1ZXN0IG1heSBub3QgYmUgdGhlIGZpcnN0IG92ZXIgdGhpcyBzb2NrZXQuICovXG4gICAgY29uc3QgYnl0ZXNSZWFkUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5IHx8IDBcbiAgICBjb25zdCBieXRlc1dyaXR0ZW5QcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgfHwgMFxuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gcHJvY2Vzcy5ocnRpbWUoKVxuXG4gICAgdGhpcy5kYXRhLmxvZyA9IHt9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IG5leHQoKVxuICAgIH0gZmluYWxseSB7XG5cbiAgICAgIC8qIFN0b3JlIGN1cnJlbnQgcmVhZC93cml0dGVuIGNvdW50IGZvciBmdXR1cmUgcmVmZXJlbmNlLiAqL1xuICAgICAgc29ja2V0LmJ5dGVzUmVhZFByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNSZWFkXG4gICAgICBzb2NrZXQuYnl0ZXNXcml0dGVuUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1dyaXR0ZW5cblxuICAgICAgY29uc3QgcmVxdWVzdE1ldGhvZCA9IHRoaXMubWV0aG9kXG4gICAgICBjb25zdCByZXF1ZXN0VXJsID0gdGhpcy51cmxcbiAgICAgIGNvbnN0IHJlcXVlc3RTaXplID0gc29ja2V0LmJ5dGVzUmVhZCAtIGJ5dGVzUmVhZFByZXZpb3VzbHlcblxuICAgICAgY29uc3Qgc3RhdHVzID0gdGhpcy5yZXNwb25zZS5zdGF0dXNDb2RlXG4gICAgICBjb25zdCByZXNwb25zZVNpemUgPSBzb2NrZXQuYnl0ZXNXcml0dGVuIC0gYnl0ZXNXcml0dGVuUHJldmlvdXNseVxuXG4gICAgICBjb25zdCB1c2VyQWdlbnQgPSB0aGlzLmdldChcInVzZXItYWdlbnRcIilcbiAgICAgIGNvbnN0IHJlZmVyZXIgPSB0aGlzLmdldChcInJlZmVyZXJcIilcblxuICAgICAgY29uc3QgW3NlYywgbmFub10gPSBwcm9jZXNzLmhydGltZShzdGFydFRpbWUpXG4gICAgICBjb25zdCBsYXRlbmN5ID0gYCR7KHNlYyArIDFlLTkgKiBuYW5vKS50b0ZpeGVkKDMpfXNgXG5cbiAgICAgIGxldCByZW1vdGVJcCA9IHNvY2tldC5yZW1vdGVBZGRyZXNzXG4gICAgICBjb25zdCBmb3J3YXJkZWQgPSB0aGlzLmdldChcIngtZm9yd2FyZGVkLWZvclwiKVxuICAgICAgaWYgKGZvcndhcmRlZCkge1xuICAgICAgICByZW1vdGVJcCA9IGZvcndhcmRlZC5zcGxpdChcIixcIikuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBodHRwUmVxdWVzdDogSHR0cFJlcXVlc3QgPSB7XG4gICAgICAgIHJlcXVlc3RNZXRob2QsXG4gICAgICAgIHJlcXVlc3RVcmwsXG4gICAgICAgIHJlcXVlc3RTaXplLFxuICAgICAgICBzdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlU2l6ZSxcbiAgICAgICAgdXNlckFnZW50LFxuICAgICAgICByZW1vdGVJcCxcbiAgICAgICAgcmVmZXJlcixcbiAgICAgICAgbGF0ZW5jeSxcbiAgICAgICAgLy8gcHJvdG9jb2wsIFRPRE9cbiAgICAgIH1cblxuICAgICAgY29uc3QgbG9nQ29udGV4dDogTG9nQ29udGV4dCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGF0YS5sb2csIHtodHRwUmVxdWVzdH0pXG5cbiAgICAgIGlmIChzdGF0dXMgPj0gNTAwICYmIHRoaXMuZGF0YS5lcnJvcikge1xuICAgICAgICAvKiBBbiBlcnJvciB3YXMgdGhyb3duIHNvbWV3aGVyZS4gKi9cbiAgICAgICAgaWYgKHRoaXMuZGF0YS5lcnJvci5leHBvc2UpIHtcbiAgICAgICAgICAvKiBUaGlzIGVycm9yIGlzIGV4cG9zYWJsZSwgc28gaXQgaXMgdG8gYmUgZXhwZWN0ZWQuICovXG4gICAgICAgICAgbG9nZ2VyLndhcm5pbmcodGhpcy5kYXRhLmVycm9yLm1lc3NhZ2UgfHwgXCIobm8gbWVzc2FnZSlcIiwgbG9nQ29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKiBUaGlzIHdhcyBhbiBpbnRlcm5hbCBlcnJvciwgbm90IHN1cHBvc2VkIHRvIGJlIGV4cG9zZWQuIExvZyB0aGVcbiAgICAgICAgICAgICBlbnRpcmUgc3RhY2sgdHJhY2Ugc28gd2UgY2FuIGRlYnVnIGxhdGVyLiAqL1xuICAgICAgICAgIGxvZ2dlci5lcnJvcih0aGlzLmRhdGEuZXJyb3Iuc3RhY2sgfHwgdGhpcy5kYXRhLmVycm9yLnRvU3RyaW5nKCksIGxvZ0NvbnRleHQpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIE5vIGVycm9yIHdhcyB0aHJvd24sIG9yIGVycm9yIHdhcyBpbiA0eHggcmFuZ2UuICovXG4gICAgICAgIGxvZ2dlci5pbmZvKHN0YXR1c0NvZGVzLmdldChzdGF0dXMpLCBsb2dDb250ZXh0KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19