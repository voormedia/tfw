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

        if (status >= 500 && ctx.data.error) {
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
          /* No error was thrown, or error was in 4xx range. */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsImN0eCIsInNvY2tldCIsInJlcSIsImJ5dGVzUmVhZFByZXZpb3VzbHkiLCJieXRlc1dyaXR0ZW5QcmV2aW91c2x5Iiwic3RhcnRUaW1lIiwicHJvY2VzcyIsImhydGltZSIsImJ5dGVzUmVhZCIsImJ5dGVzV3JpdHRlbiIsInJlcXVlc3RNZXRob2QiLCJtZXRob2QiLCJyZXF1ZXN0VXJsIiwidXJsIiwicmVxdWVzdFNpemUiLCJzdGF0dXMiLCJyZXMiLCJzdGF0dXNDb2RlIiwicmVzcG9uc2VTaXplIiwidXNlckFnZW50IiwiaGVhZGVycyIsInJlZmVyZXIiLCJzZWMiLCJuYW5vIiwibGF0ZW5jeSIsInRvRml4ZWQiLCJyZW1vdGVJcCIsInJlbW90ZUFkZHJlc3MiLCJmb3J3YXJkZWQiLCJzcGxpdCIsInNoaWZ0IiwiaHR0cFJlcXVlc3QiLCJkYXRhIiwiZXJyb3IiLCJleHBvc2UiLCJ3YXJuaW5nIiwibWVzc2FnZSIsInN0YWNrIiwidG9TdHJpbmciLCJpbmZvIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7OztrQkFrQndCQSxHOztBQWhCeEI7Ozs7Ozs7QUFEQTs7O0FBV0EsTUFBTUMsY0FBbUMsSUFBSUMsR0FBSixFQUF6QztBQUNBLEtBQUssTUFBTUMsSUFBWCxJQUFtQixlQUFLQyxZQUF4QixFQUFzQztBQUNwQyxRQUFNQyxTQUFTQyxTQUFTSCxJQUFULENBQWY7QUFDQUYsY0FBWU0sR0FBWixDQUFnQkYsTUFBaEIsRUFBd0IsZUFBS0QsWUFBTCxDQUFrQkMsTUFBbEIsRUFBMEJHLFdBQTFCLEVBQXhCO0FBQ0Q7O0FBRWMsU0FBU1IsR0FBVCxDQUFhUyxNQUFiLEVBQXlDO0FBQ3REO0FBQUEsaUNBQU8sV0FBbUJDLElBQW5CLEVBQStCO0FBQ3BDLFlBQU1DLE1BQWUsSUFBckI7QUFDQSxZQUFNQyxTQUFzQkQsSUFBSUUsR0FBSixDQUFRRCxNQUFwQzs7QUFFQTs7QUFFQSxZQUFNRSxzQkFBc0JGLE9BQU9FLG1CQUFQLElBQThCLENBQTFEO0FBQ0EsWUFBTUMseUJBQXlCSCxPQUFPRyxzQkFBUCxJQUFpQyxDQUFoRTs7QUFFQSxZQUFNQyxZQUFZQyxRQUFRQyxNQUFSLEVBQWxCOztBQUVBLFVBQUk7QUFDRixlQUFPLE1BQU1SLE1BQWI7QUFDRCxPQUZELFNBRVU7O0FBRVI7QUFDQUUsZUFBT0UsbUJBQVAsR0FBNkJGLE9BQU9PLFNBQXBDO0FBQ0FQLGVBQU9HLHNCQUFQLEdBQWdDSCxPQUFPUSxZQUF2Qzs7QUFFQSxjQUFNQyxnQkFBZ0JWLElBQUlFLEdBQUosQ0FBUVMsTUFBOUI7QUFDQSxjQUFNQyxhQUFhWixJQUFJRSxHQUFKLENBQVFXLEdBQTNCO0FBQ0EsY0FBTUMsY0FBY2IsT0FBT08sU0FBUCxHQUFtQkwsbUJBQXZDOztBQUVBLGNBQU1ZLFNBQVNmLElBQUlnQixHQUFKLENBQVFDLFVBQXZCO0FBQ0EsY0FBTUMsZUFBZWpCLE9BQU9RLFlBQVAsR0FBc0JMLHNCQUEzQzs7QUFFQSxjQUFNZSxZQUFZbkIsSUFBSUUsR0FBSixDQUFRa0IsT0FBUixDQUFnQixZQUFoQixDQUFsQjtBQUNBLGNBQU1DLFVBQVVyQixJQUFJRSxHQUFKLENBQVFrQixPQUFSLENBQWdCLFNBQWhCLENBQWhCOztBQUVBLGNBQU0sQ0FBQ0UsR0FBRCxFQUFNQyxJQUFOLElBQWNqQixRQUFRQyxNQUFSLENBQWVGLFNBQWYsQ0FBcEI7QUFDQSxjQUFNbUIsVUFBVyxHQUFFLENBQUNGLE1BQU0sT0FBT0MsSUFBZCxFQUFvQkUsT0FBcEIsQ0FBNEIsQ0FBNUIsQ0FBK0IsR0FBbEQ7O0FBRUEsWUFBSUMsV0FBVzFCLElBQUlFLEdBQUosQ0FBUUQsTUFBUixDQUFlMEIsYUFBOUI7QUFDQSxjQUFNQyxZQUFZNUIsSUFBSUUsR0FBSixDQUFRa0IsT0FBUixDQUFnQixpQkFBaEIsQ0FBbEI7QUFDQSxZQUFJUSxTQUFKLEVBQWU7QUFDYkYscUJBQVdFLFVBQVVDLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUJDLEtBQXJCLEVBQVg7QUFDRDs7QUFFRCxjQUFNQyxjQUEyQjtBQUMvQnJCLHVCQUQrQjtBQUUvQkUsb0JBRitCO0FBRy9CRSxxQkFIK0I7QUFJL0JDLGdCQUorQjtBQUsvQkcsc0JBTCtCO0FBTS9CQyxtQkFOK0I7QUFPL0JPLGtCQVArQjtBQVEvQkwsaUJBUitCO0FBUy9CRztBQVQrQixTQUFqQzs7QUFZQSxZQUFJVCxVQUFVLEdBQVYsSUFBaUJmLElBQUlnQyxJQUFKLENBQVNDLEtBQTlCLEVBQXFDO0FBQ25DO0FBQ0EsY0FBSWpDLElBQUlnQyxJQUFKLENBQVNDLEtBQVQsQ0FBZUMsTUFBbkIsRUFBMkI7QUFDekI7QUFDQXBDLG1CQUFPcUMsT0FBUCxDQUFlbkMsSUFBSWdDLElBQUosQ0FBU0MsS0FBVCxDQUFlRyxPQUFmLElBQTBCLGNBQXpDLEVBQXlETCxXQUF6RDtBQUNELFdBSEQsTUFHTztBQUNMOztBQUVBakMsbUJBQU9tQyxLQUFQLENBQWFqQyxJQUFJZ0MsSUFBSixDQUFTQyxLQUFULENBQWVJLEtBQWYsSUFBd0JyQyxJQUFJZ0MsSUFBSixDQUFTQyxLQUFULENBQWVLLFFBQWYsRUFBckMsRUFBZ0VQLFdBQWhFO0FBQ0Q7QUFDRixTQVZELE1BVU87QUFDTDtBQUNBakMsaUJBQU95QyxJQUFQLENBQVlqRCxZQUFZa0QsR0FBWixDQUFnQnpCLE1BQWhCLENBQVosRUFBcUNnQixXQUFyQztBQUNEO0FBQ0Y7QUFDRixLQWpFRDs7QUFBQSxhQUFzQjFDLEdBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsR0FBdEI7QUFBQTtBQWtFRCIsImZpbGUiOiJsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgZG90LW5vdGF0aW9uICovXG5pbXBvcnQgaHR0cCBmcm9tIFwiaHR0cFwiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7SHR0cFJlcXVlc3QsIExvZ2dlcn0gZnJvbSBcIi4uL3V0aWwvbG9nZ2VyXCJcblxudHlwZSBTdGF0c1NvY2tldCA9IG5ldCRTb2NrZXQgJiB7XG4gIGJ5dGVzUmVhZFByZXZpb3VzbHk/OiBudW1iZXIsXG4gIGJ5dGVzV3JpdHRlblByZXZpb3VzbHk/OiBudW1iZXIsXG59XG5cbmNvbnN0IHN0YXR1c0NvZGVzOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcFxuZm9yIChjb25zdCBjb2RlIGluIGh0dHAuU1RBVFVTX0NPREVTKSB7XG4gIGNvbnN0IG51bWJlciA9IHBhcnNlSW50KGNvZGUpXG4gIHN0YXR1c0NvZGVzLnNldChudW1iZXIsIGh0dHAuU1RBVFVTX0NPREVTW251bWJlcl0udG9Mb3dlckNhc2UoKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9nKGxvZ2dlcjogTG9nZ2VyKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBsb2cobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcbiAgICBjb25zdCBzb2NrZXQ6IFN0YXRzU29ja2V0ID0gY3R4LnJlcS5zb2NrZXRcblxuICAgIC8qIENoZWNrIHdoYXQgaGFzIGJlZW4gcHJldmlvdXNseSByZWNvcmRlZCBhcyByZWFkL3dyaXR0ZW4gb24gdGhpcyBzb2NrZXQuXG4gICAgICAgVGhlIHJlcXVlc3QgbWF5IG5vdCBiZSB0aGUgZmlyc3Qgb3ZlciB0aGlzIHNvY2tldC4gKi9cbiAgICBjb25zdCBieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFByZXZpb3VzbHkgfHwgMFxuICAgIGNvbnN0IGJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuUHJldmlvdXNseSB8fCAwXG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBwcm9jZXNzLmhydGltZSgpXG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IG5leHQoKVxuICAgIH0gZmluYWxseSB7XG5cbiAgICAgIC8qIFN0b3JlIGN1cnJlbnQgcmVhZC93cml0dGVuIGNvdW50IGZvciBmdXR1cmUgcmVmZXJlbmNlLiAqL1xuICAgICAgc29ja2V0LmJ5dGVzUmVhZFByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNSZWFkXG4gICAgICBzb2NrZXQuYnl0ZXNXcml0dGVuUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1dyaXR0ZW5cblxuICAgICAgY29uc3QgcmVxdWVzdE1ldGhvZCA9IGN0eC5yZXEubWV0aG9kXG4gICAgICBjb25zdCByZXF1ZXN0VXJsID0gY3R4LnJlcS51cmxcbiAgICAgIGNvbnN0IHJlcXVlc3RTaXplID0gc29ja2V0LmJ5dGVzUmVhZCAtIGJ5dGVzUmVhZFByZXZpb3VzbHlcblxuICAgICAgY29uc3Qgc3RhdHVzID0gY3R4LnJlcy5zdGF0dXNDb2RlXG4gICAgICBjb25zdCByZXNwb25zZVNpemUgPSBzb2NrZXQuYnl0ZXNXcml0dGVuIC0gYnl0ZXNXcml0dGVuUHJldmlvdXNseVxuXG4gICAgICBjb25zdCB1c2VyQWdlbnQgPSBjdHgucmVxLmhlYWRlcnNbXCJ1c2VyLWFnZW50XCJdXG4gICAgICBjb25zdCByZWZlcmVyID0gY3R4LnJlcS5oZWFkZXJzW1wicmVmZXJlclwiXVxuXG4gICAgICBjb25zdCBbc2VjLCBuYW5vXSA9IHByb2Nlc3MuaHJ0aW1lKHN0YXJ0VGltZSlcbiAgICAgIGNvbnN0IGxhdGVuY3kgPSBgJHsoc2VjICsgMWUtOSAqIG5hbm8pLnRvRml4ZWQoMyl9c2BcblxuICAgICAgbGV0IHJlbW90ZUlwID0gY3R4LnJlcS5zb2NrZXQucmVtb3RlQWRkcmVzc1xuICAgICAgY29uc3QgZm9yd2FyZGVkID0gY3R4LnJlcS5oZWFkZXJzW1wieC1mb3J3YXJkZWQtZm9yXCJdXG4gICAgICBpZiAoZm9yd2FyZGVkKSB7XG4gICAgICAgIHJlbW90ZUlwID0gZm9yd2FyZGVkLnNwbGl0KFwiLFwiKS5zaGlmdCgpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGh0dHBSZXF1ZXN0OiBIdHRwUmVxdWVzdCA9IHtcbiAgICAgICAgcmVxdWVzdE1ldGhvZCxcbiAgICAgICAgcmVxdWVzdFVybCxcbiAgICAgICAgcmVxdWVzdFNpemUsXG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgcmVzcG9uc2VTaXplLFxuICAgICAgICB1c2VyQWdlbnQsXG4gICAgICAgIHJlbW90ZUlwLFxuICAgICAgICByZWZlcmVyLFxuICAgICAgICBsYXRlbmN5LFxuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdHVzID49IDUwMCAmJiBjdHguZGF0YS5lcnJvcikge1xuICAgICAgICAvKiBBbiBlcnJvciB3YXMgdGhyb3duIHNvbWV3aGVyZS4gKi9cbiAgICAgICAgaWYgKGN0eC5kYXRhLmVycm9yLmV4cG9zZSkge1xuICAgICAgICAgIC8qIFRoaXMgZXJyb3IgaXMgZXhwb3NhYmxlLCBzbyBpdCBpcyB0byBiZSBleHBlY3RlZC4gKi9cbiAgICAgICAgICBsb2dnZXIud2FybmluZyhjdHguZGF0YS5lcnJvci5tZXNzYWdlIHx8IFwiKG5vIG1lc3NhZ2UpXCIsIGh0dHBSZXF1ZXN0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIFRoaXMgd2FzIGFuIGludGVybmFsIGVycm9yLCBub3Qgc3VwcG9zZWQgdG8gYmUgZXhwb3NlZC4gTG9nIHRoZVxuICAgICAgICAgICAgIGVudGlyZSBzdGFjayB0cmFjZSBzbyB3ZSBjYW4gZGVidWcgbGF0ZXIuICovXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKGN0eC5kYXRhLmVycm9yLnN0YWNrIHx8IGN0eC5kYXRhLmVycm9yLnRvU3RyaW5nKCksIGh0dHBSZXF1ZXN0KVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBObyBlcnJvciB3YXMgdGhyb3duLCBvciBlcnJvciB3YXMgaW4gNHh4IHJhbmdlLiAqL1xuICAgICAgICBsb2dnZXIuaW5mbyhzdGF0dXNDb2Rlcy5nZXQoc3RhdHVzKSwgaHR0cFJlcXVlc3QpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=