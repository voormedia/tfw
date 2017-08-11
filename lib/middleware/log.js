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

        if (ctx.data.error) {
          /* An error was thrown somewhere. */
          if (ctx.data.error.expose) {
            /* This error is exposable, so it is to be expected. */
            logger.warning(ctx.data.error.message || "(no message)", httpRequest);
          } else {
            /* This was an internal error, not supposed to be exposed. Log the
               entire stack trace so we can debug later. */
            logger.error(ctx.data.error.stack || ctx.data.error.toString(), httpRequest);
          }
        } else {
          /* No error was thrown. Status code might still be in 4xx or 5xx range. */
          logger.info(statusCodes.get(status), httpRequest);
        }
      }
    });

    function log(_x) {
      return _ref.apply(this, arguments);
    }

    return log;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsImN0eCIsInNvY2tldCIsInJlcSIsImJ5dGVzUmVhZFByZXZpb3VzbHkiLCJieXRlc1dyaXR0ZW5QcmV2aW91c2x5Iiwic3RhcnRUaW1lIiwicHJvY2VzcyIsImhydGltZSIsImJ5dGVzUmVhZCIsImJ5dGVzV3JpdHRlbiIsInJlcXVlc3RNZXRob2QiLCJtZXRob2QiLCJyZXF1ZXN0VXJsIiwidXJsIiwicmVxdWVzdFNpemUiLCJzdGF0dXMiLCJyZXMiLCJzdGF0dXNDb2RlIiwicmVzcG9uc2VTaXplIiwidXNlckFnZW50IiwiaGVhZGVycyIsInJlZmVyZXIiLCJzZWMiLCJuYW5vIiwibGF0ZW5jeSIsInRvRml4ZWQiLCJyZW1vdGVJcCIsInJlbW90ZUFkZHJlc3MiLCJmb3J3YXJkZWQiLCJzcGxpdCIsInNoaWZ0IiwiaHR0cFJlcXVlc3QiLCJkYXRhIiwiZXJyb3IiLCJleHBvc2UiLCJ3YXJuaW5nIiwibWVzc2FnZSIsInN0YWNrIiwidG9TdHJpbmciLCJpbmZvIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7OztrQkFrQndCQSxHOztBQWhCeEI7Ozs7Ozs7QUFEQTs7O0FBV0EsTUFBTUMsY0FBbUMsSUFBSUMsR0FBSixFQUF6QztBQUNBLEtBQUssTUFBTUMsSUFBWCxJQUFtQixlQUFLQyxZQUF4QixFQUFzQztBQUNwQyxRQUFNQyxTQUFTQyxTQUFTSCxJQUFULENBQWY7QUFDQUYsY0FBWU0sR0FBWixDQUFnQkYsTUFBaEIsRUFBd0IsZUFBS0QsWUFBTCxDQUFrQkMsTUFBbEIsRUFBMEJHLFdBQTFCLEVBQXhCO0FBQ0Q7O0FBRWMsU0FBU1IsR0FBVCxDQUFhUyxNQUFiLEVBQXlDO0FBQ3REO0FBQUEsaUNBQU8sV0FBbUJDLElBQW5CLEVBQStCO0FBQ3BDLFlBQU1DLE1BQWUsSUFBckI7QUFDQSxZQUFNQyxTQUFzQkQsSUFBSUUsR0FBSixDQUFRRCxNQUFwQzs7QUFFQTs7QUFFQSxZQUFNRSxzQkFBc0JGLE9BQU9FLG1CQUFQLElBQThCLENBQTFEO0FBQ0EsWUFBTUMseUJBQXlCSCxPQUFPRyxzQkFBUCxJQUFpQyxDQUFoRTs7QUFFQSxZQUFNQyxZQUFZQyxRQUFRQyxNQUFSLEVBQWxCOztBQUVBLFVBQUk7QUFDRixlQUFPLE1BQU1SLE1BQWI7QUFDRCxPQUZELFNBRVU7O0FBRVI7QUFDQUUsZUFBT0UsbUJBQVAsR0FBNkJGLE9BQU9PLFNBQXBDO0FBQ0FQLGVBQU9HLHNCQUFQLEdBQWdDSCxPQUFPUSxZQUF2Qzs7QUFFQSxjQUFNQyxnQkFBZ0JWLElBQUlFLEdBQUosQ0FBUVMsTUFBOUI7QUFDQSxjQUFNQyxhQUFhWixJQUFJRSxHQUFKLENBQVFXLEdBQTNCO0FBQ0EsY0FBTUMsY0FBY2IsT0FBT08sU0FBUCxHQUFtQkwsbUJBQXZDOztBQUVBLGNBQU1ZLFNBQVNmLElBQUlnQixHQUFKLENBQVFDLFVBQXZCO0FBQ0EsY0FBTUMsZUFBZWpCLE9BQU9RLFlBQVAsR0FBc0JMLHNCQUEzQzs7QUFFQSxjQUFNZSxZQUFZbkIsSUFBSUUsR0FBSixDQUFRa0IsT0FBUixDQUFnQixZQUFoQixDQUFsQjtBQUNBLGNBQU1DLFVBQVVyQixJQUFJRSxHQUFKLENBQVFrQixPQUFSLENBQWdCLFNBQWhCLENBQWhCOztBQUVBLGNBQU0sQ0FBQ0UsR0FBRCxFQUFNQyxJQUFOLElBQWNqQixRQUFRQyxNQUFSLENBQWVGLFNBQWYsQ0FBcEI7QUFDQSxjQUFNbUIsVUFBVyxHQUFFLENBQUNGLE1BQU0sT0FBT0MsSUFBZCxFQUFvQkUsT0FBcEIsQ0FBNEIsQ0FBNUIsQ0FBK0IsR0FBbEQ7O0FBRUEsWUFBSUMsV0FBVzFCLElBQUlFLEdBQUosQ0FBUUQsTUFBUixDQUFlMEIsYUFBOUI7QUFDQSxjQUFNQyxZQUFZNUIsSUFBSUUsR0FBSixDQUFRa0IsT0FBUixDQUFnQixpQkFBaEIsQ0FBbEI7QUFDQSxZQUFJUSxTQUFKLEVBQWU7QUFDYkYscUJBQVdFLFVBQVVDLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUJDLEtBQXJCLEVBQVg7QUFDRDs7QUFFRCxjQUFNQyxjQUEyQjtBQUMvQnJCLHVCQUQrQjtBQUUvQkUsb0JBRitCO0FBRy9CRSxxQkFIK0I7QUFJL0JDLGdCQUorQjtBQUsvQkcsc0JBTCtCO0FBTS9CQyxtQkFOK0I7QUFPL0JPLGtCQVArQjtBQVEvQkwsaUJBUitCO0FBUy9CRztBQVQrQixTQUFqQzs7QUFZQSxZQUFJeEIsSUFBSWdDLElBQUosQ0FBU0MsS0FBYixFQUFvQjtBQUNsQjtBQUNBLGNBQUlqQyxJQUFJZ0MsSUFBSixDQUFTQyxLQUFULENBQWVDLE1BQW5CLEVBQTJCO0FBQ3pCO0FBQ0FwQyxtQkFBT3FDLE9BQVAsQ0FBZW5DLElBQUlnQyxJQUFKLENBQVNDLEtBQVQsQ0FBZUcsT0FBZixJQUEwQixjQUF6QyxFQUF5REwsV0FBekQ7QUFDRCxXQUhELE1BR087QUFDTDs7QUFFQWpDLG1CQUFPbUMsS0FBUCxDQUFhakMsSUFBSWdDLElBQUosQ0FBU0MsS0FBVCxDQUFlSSxLQUFmLElBQXdCckMsSUFBSWdDLElBQUosQ0FBU0MsS0FBVCxDQUFlSyxRQUFmLEVBQXJDLEVBQWdFUCxXQUFoRTtBQUNEO0FBQ0YsU0FWRCxNQVVPO0FBQ0w7QUFDQWpDLGlCQUFPeUMsSUFBUCxDQUFZakQsWUFBWWtELEdBQVosQ0FBZ0J6QixNQUFoQixDQUFaLEVBQXFDZ0IsV0FBckM7QUFDRDtBQUNGO0FBQ0YsS0FqRUQ7O0FBQUEsYUFBc0IxQyxHQUF0QjtBQUFBO0FBQUE7O0FBQUEsV0FBc0JBLEdBQXRCO0FBQUE7QUFrRUQiLCJmaWxlIjoibG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIGRvdC1ub3RhdGlvbiAqL1xuaW1wb3J0IGh0dHAgZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge0h0dHBSZXF1ZXN0LCBMb2dnZXJ9IGZyb20gXCIuLi91dGlsL2xvZ2dlclwiXG5cbnR5cGUgU3RhdHNTb2NrZXQgPSBuZXQkU29ja2V0ICYge1xuICBieXRlc1JlYWRQcmV2aW91c2x5PzogbnVtYmVyLFxuICBieXRlc1dyaXR0ZW5QcmV2aW91c2x5PzogbnVtYmVyLFxufVxuXG5jb25zdCBzdGF0dXNDb2RlczogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXBcbmZvciAoY29uc3QgY29kZSBpbiBodHRwLlNUQVRVU19DT0RFUykge1xuICBjb25zdCBudW1iZXIgPSBwYXJzZUludChjb2RlKVxuICBzdGF0dXNDb2Rlcy5zZXQobnVtYmVyLCBodHRwLlNUQVRVU19DT0RFU1tudW1iZXJdLnRvTG93ZXJDYXNlKCkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZyhsb2dnZXI6IExvZ2dlcik6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbG9nKG5leHQ6IE5leHQpIHtcbiAgICBjb25zdCBjdHg6IENvbnRleHQgPSB0aGlzXG4gICAgY29uc3Qgc29ja2V0OiBTdGF0c1NvY2tldCA9IGN0eC5yZXEuc29ja2V0XG5cbiAgICAvKiBDaGVjayB3aGF0IGhhcyBiZWVuIHByZXZpb3VzbHkgcmVjb3JkZWQgYXMgcmVhZC93cml0dGVuIG9uIHRoaXMgc29ja2V0LlxuICAgICAgIFRoZSByZXF1ZXN0IG1heSBub3QgYmUgdGhlIGZpcnN0IG92ZXIgdGhpcyBzb2NrZXQuICovXG4gICAgY29uc3QgYnl0ZXNSZWFkUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5IHx8IDBcbiAgICBjb25zdCBieXRlc1dyaXR0ZW5QcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgfHwgMFxuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gcHJvY2Vzcy5ocnRpbWUoKVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuZXh0KClcbiAgICB9IGZpbmFsbHkge1xuXG4gICAgICAvKiBTdG9yZSBjdXJyZW50IHJlYWQvd3JpdHRlbiBjb3VudCBmb3IgZnV0dXJlIHJlZmVyZW5jZS4gKi9cbiAgICAgIHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFxuICAgICAgc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuXG5cbiAgICAgIGNvbnN0IHJlcXVlc3RNZXRob2QgPSBjdHgucmVxLm1ldGhvZFxuICAgICAgY29uc3QgcmVxdWVzdFVybCA9IGN0eC5yZXEudXJsXG4gICAgICBjb25zdCByZXF1ZXN0U2l6ZSA9IHNvY2tldC5ieXRlc1JlYWQgLSBieXRlc1JlYWRQcmV2aW91c2x5XG5cbiAgICAgIGNvbnN0IHN0YXR1cyA9IGN0eC5yZXMuc3RhdHVzQ29kZVxuICAgICAgY29uc3QgcmVzcG9uc2VTaXplID0gc29ja2V0LmJ5dGVzV3JpdHRlbiAtIGJ5dGVzV3JpdHRlblByZXZpb3VzbHlcblxuICAgICAgY29uc3QgdXNlckFnZW50ID0gY3R4LnJlcS5oZWFkZXJzW1widXNlci1hZ2VudFwiXVxuICAgICAgY29uc3QgcmVmZXJlciA9IGN0eC5yZXEuaGVhZGVyc1tcInJlZmVyZXJcIl1cblxuICAgICAgY29uc3QgW3NlYywgbmFub10gPSBwcm9jZXNzLmhydGltZShzdGFydFRpbWUpXG4gICAgICBjb25zdCBsYXRlbmN5ID0gYCR7KHNlYyArIDFlLTkgKiBuYW5vKS50b0ZpeGVkKDMpfXNgXG5cbiAgICAgIGxldCByZW1vdGVJcCA9IGN0eC5yZXEuc29ja2V0LnJlbW90ZUFkZHJlc3NcbiAgICAgIGNvbnN0IGZvcndhcmRlZCA9IGN0eC5yZXEuaGVhZGVyc1tcIngtZm9yd2FyZGVkLWZvclwiXVxuICAgICAgaWYgKGZvcndhcmRlZCkge1xuICAgICAgICByZW1vdGVJcCA9IGZvcndhcmRlZC5zcGxpdChcIixcIikuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBodHRwUmVxdWVzdDogSHR0cFJlcXVlc3QgPSB7XG4gICAgICAgIHJlcXVlc3RNZXRob2QsXG4gICAgICAgIHJlcXVlc3RVcmwsXG4gICAgICAgIHJlcXVlc3RTaXplLFxuICAgICAgICBzdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlU2l6ZSxcbiAgICAgICAgdXNlckFnZW50LFxuICAgICAgICByZW1vdGVJcCxcbiAgICAgICAgcmVmZXJlcixcbiAgICAgICAgbGF0ZW5jeSxcbiAgICAgIH1cblxuICAgICAgaWYgKGN0eC5kYXRhLmVycm9yKSB7XG4gICAgICAgIC8qIEFuIGVycm9yIHdhcyB0aHJvd24gc29tZXdoZXJlLiAqL1xuICAgICAgICBpZiAoY3R4LmRhdGEuZXJyb3IuZXhwb3NlKSB7XG4gICAgICAgICAgLyogVGhpcyBlcnJvciBpcyBleHBvc2FibGUsIHNvIGl0IGlzIHRvIGJlIGV4cGVjdGVkLiAqL1xuICAgICAgICAgIGxvZ2dlci53YXJuaW5nKGN0eC5kYXRhLmVycm9yLm1lc3NhZ2UgfHwgXCIobm8gbWVzc2FnZSlcIiwgaHR0cFJlcXVlc3QpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogVGhpcyB3YXMgYW4gaW50ZXJuYWwgZXJyb3IsIG5vdCBzdXBwb3NlZCB0byBiZSBleHBvc2VkLiBMb2cgdGhlXG4gICAgICAgICAgICAgZW50aXJlIHN0YWNrIHRyYWNlIHNvIHdlIGNhbiBkZWJ1ZyBsYXRlci4gKi9cbiAgICAgICAgICBsb2dnZXIuZXJyb3IoY3R4LmRhdGEuZXJyb3Iuc3RhY2sgfHwgY3R4LmRhdGEuZXJyb3IudG9TdHJpbmcoKSwgaHR0cFJlcXVlc3QpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIE5vIGVycm9yIHdhcyB0aHJvd24uIFN0YXR1cyBjb2RlIG1pZ2h0IHN0aWxsIGJlIGluIDR4eCBvciA1eHggcmFuZ2UuICovXG4gICAgICAgIGxvZ2dlci5pbmZvKHN0YXR1c0NvZGVzLmdldChzdGF0dXMpLCBodHRwUmVxdWVzdClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==