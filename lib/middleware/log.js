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
          logger.error(ctx.data.error.stack || ctx.data.error.toString(), httpRequest);
        } else {
          if (status >= 500) {
            logger.warning(statusCodes.get(status), httpRequest);
          } else {
            logger.info(statusCodes.get(status), httpRequest);
          }
        }
      }
    });

    function log(_x) {
      return _ref.apply(this, arguments);
    }

    return log;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsImN0eCIsInNvY2tldCIsInJlcSIsImJ5dGVzUmVhZFByZXZpb3VzbHkiLCJieXRlc1dyaXR0ZW5QcmV2aW91c2x5Iiwic3RhcnRUaW1lIiwicHJvY2VzcyIsImhydGltZSIsImJ5dGVzUmVhZCIsImJ5dGVzV3JpdHRlbiIsInJlcXVlc3RNZXRob2QiLCJtZXRob2QiLCJyZXF1ZXN0VXJsIiwidXJsIiwicmVxdWVzdFNpemUiLCJzdGF0dXMiLCJyZXMiLCJzdGF0dXNDb2RlIiwicmVzcG9uc2VTaXplIiwidXNlckFnZW50IiwiaGVhZGVycyIsInJlZmVyZXIiLCJzZWMiLCJuYW5vIiwibGF0ZW5jeSIsInRvRml4ZWQiLCJyZW1vdGVJcCIsInJlbW90ZUFkZHJlc3MiLCJmb3J3YXJkZWQiLCJzcGxpdCIsInNoaWZ0IiwiaHR0cFJlcXVlc3QiLCJkYXRhIiwiZXJyb3IiLCJzdGFjayIsInRvU3RyaW5nIiwid2FybmluZyIsImdldCIsImluZm8iXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWtCd0JBLEc7O0FBaEJ4Qjs7Ozs7OztBQURBOzs7QUFXQSxNQUFNQyxjQUFtQyxJQUFJQyxHQUFKLEVBQXpDO0FBQ0EsS0FBSyxNQUFNQyxJQUFYLElBQW1CLGVBQUtDLFlBQXhCLEVBQXNDO0FBQ3BDLFFBQU1DLFNBQVNDLFNBQVNILElBQVQsQ0FBZjtBQUNBRixjQUFZTSxHQUFaLENBQWdCRixNQUFoQixFQUF3QixlQUFLRCxZQUFMLENBQWtCQyxNQUFsQixFQUEwQkcsV0FBMUIsRUFBeEI7QUFDRDs7QUFFYyxTQUFTUixHQUFULENBQWFTLE1BQWIsRUFBeUM7QUFDdEQ7QUFBQSxpQ0FBTyxXQUFtQkMsSUFBbkIsRUFBK0I7QUFDcEMsWUFBTUMsTUFBZSxJQUFyQjtBQUNBLFlBQU1DLFNBQXNCRCxJQUFJRSxHQUFKLENBQVFELE1BQXBDOztBQUVBOztBQUVBLFlBQU1FLHNCQUFzQkYsT0FBT0UsbUJBQVAsSUFBOEIsQ0FBMUQ7QUFDQSxZQUFNQyx5QkFBeUJILE9BQU9HLHNCQUFQLElBQWlDLENBQWhFOztBQUVBLFlBQU1DLFlBQVlDLFFBQVFDLE1BQVIsRUFBbEI7O0FBRUEsVUFBSTtBQUNGLGVBQU8sTUFBTVIsTUFBYjtBQUNELE9BRkQsU0FFVTs7QUFFUjtBQUNBRSxlQUFPRSxtQkFBUCxHQUE2QkYsT0FBT08sU0FBcEM7QUFDQVAsZUFBT0csc0JBQVAsR0FBZ0NILE9BQU9RLFlBQXZDOztBQUVBLGNBQU1DLGdCQUFnQlYsSUFBSUUsR0FBSixDQUFRUyxNQUE5QjtBQUNBLGNBQU1DLGFBQWFaLElBQUlFLEdBQUosQ0FBUVcsR0FBM0I7QUFDQSxjQUFNQyxjQUFjYixPQUFPTyxTQUFQLEdBQW1CTCxtQkFBdkM7O0FBRUEsY0FBTVksU0FBU2YsSUFBSWdCLEdBQUosQ0FBUUMsVUFBdkI7QUFDQSxjQUFNQyxlQUFlakIsT0FBT1EsWUFBUCxHQUFzQkwsc0JBQTNDOztBQUVBLGNBQU1lLFlBQVluQixJQUFJRSxHQUFKLENBQVFrQixPQUFSLENBQWdCLFlBQWhCLENBQWxCO0FBQ0EsY0FBTUMsVUFBVXJCLElBQUlFLEdBQUosQ0FBUWtCLE9BQVIsQ0FBZ0IsU0FBaEIsQ0FBaEI7O0FBRUEsY0FBTSxDQUFDRSxHQUFELEVBQU1DLElBQU4sSUFBY2pCLFFBQVFDLE1BQVIsQ0FBZUYsU0FBZixDQUFwQjtBQUNBLGNBQU1tQixVQUFXLEdBQUUsQ0FBQ0YsTUFBTSxPQUFPQyxJQUFkLEVBQW9CRSxPQUFwQixDQUE0QixDQUE1QixDQUErQixHQUFsRDs7QUFFQSxZQUFJQyxXQUFXMUIsSUFBSUUsR0FBSixDQUFRRCxNQUFSLENBQWUwQixhQUE5QjtBQUNBLGNBQU1DLFlBQVk1QixJQUFJRSxHQUFKLENBQVFrQixPQUFSLENBQWdCLGlCQUFoQixDQUFsQjtBQUNBLFlBQUlRLFNBQUosRUFBZTtBQUNiRixxQkFBV0UsVUFBVUMsS0FBVixDQUFnQixHQUFoQixFQUFxQkMsS0FBckIsRUFBWDtBQUNEOztBQUVELGNBQU1DLGNBQTJCO0FBQy9CckIsdUJBRCtCO0FBRS9CRSxvQkFGK0I7QUFHL0JFLHFCQUgrQjtBQUkvQkMsZ0JBSitCO0FBSy9CRyxzQkFMK0I7QUFNL0JDLG1CQU4rQjtBQU8vQk8sa0JBUCtCO0FBUS9CTCxpQkFSK0I7QUFTL0JHO0FBVCtCLFNBQWpDOztBQVlBLFlBQUl4QixJQUFJZ0MsSUFBSixDQUFTQyxLQUFiLEVBQW9CO0FBQ2xCbkMsaUJBQU9tQyxLQUFQLENBQWFqQyxJQUFJZ0MsSUFBSixDQUFTQyxLQUFULENBQWVDLEtBQWYsSUFBd0JsQyxJQUFJZ0MsSUFBSixDQUFTQyxLQUFULENBQWVFLFFBQWYsRUFBckMsRUFBZ0VKLFdBQWhFO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBSWhCLFVBQVUsR0FBZCxFQUFtQjtBQUNqQmpCLG1CQUFPc0MsT0FBUCxDQUFlOUMsWUFBWStDLEdBQVosQ0FBZ0J0QixNQUFoQixDQUFmLEVBQXdDZ0IsV0FBeEM7QUFDRCxXQUZELE1BRU87QUFDTGpDLG1CQUFPd0MsSUFBUCxDQUFZaEQsWUFBWStDLEdBQVosQ0FBZ0J0QixNQUFoQixDQUFaLEVBQXFDZ0IsV0FBckM7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQTVERDs7QUFBQSxhQUFzQjFDLEdBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsR0FBdEI7QUFBQTtBQTZERCIsImZpbGUiOiJsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgZG90LW5vdGF0aW9uICovXG5pbXBvcnQgaHR0cCBmcm9tIFwiaHR0cFwiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7SHR0cFJlcXVlc3QsIExvZ2dlcn0gZnJvbSBcIi4uL3V0aWwvbG9nZ2VyXCJcblxudHlwZSBTdGF0c1NvY2tldCA9IG5ldCRTb2NrZXQgJiB7XG4gIGJ5dGVzUmVhZFByZXZpb3VzbHk/OiBudW1iZXIsXG4gIGJ5dGVzV3JpdHRlblByZXZpb3VzbHk/OiBudW1iZXIsXG59XG5cbmNvbnN0IHN0YXR1c0NvZGVzOiBNYXA8bnVtYmVyLCBzdHJpbmc+ID0gbmV3IE1hcFxuZm9yIChjb25zdCBjb2RlIGluIGh0dHAuU1RBVFVTX0NPREVTKSB7XG4gIGNvbnN0IG51bWJlciA9IHBhcnNlSW50KGNvZGUpXG4gIHN0YXR1c0NvZGVzLnNldChudW1iZXIsIGh0dHAuU1RBVFVTX0NPREVTW251bWJlcl0udG9Mb3dlckNhc2UoKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9nKGxvZ2dlcjogTG9nZ2VyKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBsb2cobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcbiAgICBjb25zdCBzb2NrZXQ6IFN0YXRzU29ja2V0ID0gY3R4LnJlcS5zb2NrZXRcblxuICAgIC8qIENoZWNrIHdoYXQgaGFzIGJlZW4gcHJldmlvdXNseSByZWNvcmRlZCBhcyByZWFkL3dyaXR0ZW4gb24gdGhpcyBzb2NrZXQuXG4gICAgICAgVGhlIHJlcXVlc3QgbWF5IG5vdCBiZSB0aGUgZmlyc3Qgb3ZlciB0aGlzIHNvY2tldC4gKi9cbiAgICBjb25zdCBieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFByZXZpb3VzbHkgfHwgMFxuICAgIGNvbnN0IGJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuUHJldmlvdXNseSB8fCAwXG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBwcm9jZXNzLmhydGltZSgpXG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IG5leHQoKVxuICAgIH0gZmluYWxseSB7XG5cbiAgICAgIC8qIFN0b3JlIGN1cnJlbnQgcmVhZC93cml0dGVuIGNvdW50IGZvciBmdXR1cmUgcmVmZXJlbmNlLiAqL1xuICAgICAgc29ja2V0LmJ5dGVzUmVhZFByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNSZWFkXG4gICAgICBzb2NrZXQuYnl0ZXNXcml0dGVuUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1dyaXR0ZW5cblxuICAgICAgY29uc3QgcmVxdWVzdE1ldGhvZCA9IGN0eC5yZXEubWV0aG9kXG4gICAgICBjb25zdCByZXF1ZXN0VXJsID0gY3R4LnJlcS51cmxcbiAgICAgIGNvbnN0IHJlcXVlc3RTaXplID0gc29ja2V0LmJ5dGVzUmVhZCAtIGJ5dGVzUmVhZFByZXZpb3VzbHlcblxuICAgICAgY29uc3Qgc3RhdHVzID0gY3R4LnJlcy5zdGF0dXNDb2RlXG4gICAgICBjb25zdCByZXNwb25zZVNpemUgPSBzb2NrZXQuYnl0ZXNXcml0dGVuIC0gYnl0ZXNXcml0dGVuUHJldmlvdXNseVxuXG4gICAgICBjb25zdCB1c2VyQWdlbnQgPSBjdHgucmVxLmhlYWRlcnNbXCJ1c2VyLWFnZW50XCJdXG4gICAgICBjb25zdCByZWZlcmVyID0gY3R4LnJlcS5oZWFkZXJzW1wicmVmZXJlclwiXVxuXG4gICAgICBjb25zdCBbc2VjLCBuYW5vXSA9IHByb2Nlc3MuaHJ0aW1lKHN0YXJ0VGltZSlcbiAgICAgIGNvbnN0IGxhdGVuY3kgPSBgJHsoc2VjICsgMWUtOSAqIG5hbm8pLnRvRml4ZWQoMyl9c2BcblxuICAgICAgbGV0IHJlbW90ZUlwID0gY3R4LnJlcS5zb2NrZXQucmVtb3RlQWRkcmVzc1xuICAgICAgY29uc3QgZm9yd2FyZGVkID0gY3R4LnJlcS5oZWFkZXJzW1wieC1mb3J3YXJkZWQtZm9yXCJdXG4gICAgICBpZiAoZm9yd2FyZGVkKSB7XG4gICAgICAgIHJlbW90ZUlwID0gZm9yd2FyZGVkLnNwbGl0KFwiLFwiKS5zaGlmdCgpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGh0dHBSZXF1ZXN0OiBIdHRwUmVxdWVzdCA9IHtcbiAgICAgICAgcmVxdWVzdE1ldGhvZCxcbiAgICAgICAgcmVxdWVzdFVybCxcbiAgICAgICAgcmVxdWVzdFNpemUsXG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgcmVzcG9uc2VTaXplLFxuICAgICAgICB1c2VyQWdlbnQsXG4gICAgICAgIHJlbW90ZUlwLFxuICAgICAgICByZWZlcmVyLFxuICAgICAgICBsYXRlbmN5LFxuICAgICAgfVxuXG4gICAgICBpZiAoY3R4LmRhdGEuZXJyb3IpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKGN0eC5kYXRhLmVycm9yLnN0YWNrIHx8IGN0eC5kYXRhLmVycm9yLnRvU3RyaW5nKCksIGh0dHBSZXF1ZXN0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHN0YXR1cyA+PSA1MDApIHtcbiAgICAgICAgICBsb2dnZXIud2FybmluZyhzdGF0dXNDb2Rlcy5nZXQoc3RhdHVzKSwgaHR0cFJlcXVlc3QpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nZ2VyLmluZm8oc3RhdHVzQ29kZXMuZ2V0KHN0YXR1cyksIGh0dHBSZXF1ZXN0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=