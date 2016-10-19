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
          referer
        };

        if (ctx.data.error) {
          logger.error(ctx.data.error.stack || ctx.data.error.toString(), httpRequest);
        } else {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsImN0eCIsInNvY2tldCIsInJlcSIsImJ5dGVzUmVhZFByZXZpb3VzbHkiLCJieXRlc1dyaXR0ZW5QcmV2aW91c2x5IiwiYnl0ZXNSZWFkIiwiYnl0ZXNXcml0dGVuIiwicmVxdWVzdE1ldGhvZCIsIm1ldGhvZCIsInJlcXVlc3RVcmwiLCJ1cmwiLCJyZXF1ZXN0U2l6ZSIsInN0YXR1cyIsInJlcyIsInN0YXR1c0NvZGUiLCJyZXNwb25zZVNpemUiLCJ1c2VyQWdlbnQiLCJoZWFkZXJzIiwicmVmZXJlciIsInJlbW90ZUlwIiwicmVtb3RlQWRkcmVzcyIsImZvcndhcmRlZCIsInNwbGl0Iiwic2hpZnQiLCJodHRwUmVxdWVzdCIsImRhdGEiLCJlcnJvciIsInN0YWNrIiwidG9TdHJpbmciLCJpbmZvIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7OztrQkFrQndCQSxHOztBQWhCeEI7Ozs7Ozs7QUFEQTs7O0FBV0EsTUFBTUMsY0FBbUMsSUFBSUMsR0FBSixFQUF6QztBQUNBLEtBQUssTUFBTUMsSUFBWCxJQUFtQixlQUFLQyxZQUF4QixFQUFzQztBQUNwQyxRQUFNQyxTQUFTQyxTQUFTSCxJQUFULENBQWY7QUFDQUYsY0FBWU0sR0FBWixDQUFnQkYsTUFBaEIsRUFBd0IsZUFBS0QsWUFBTCxDQUFrQkMsTUFBbEIsRUFBMEJHLFdBQTFCLEVBQXhCO0FBQ0Q7O0FBRWMsU0FBU1IsR0FBVCxDQUFhUyxNQUFiLEVBQXlDO0FBQ3REO0FBQUEsaUNBQU8sV0FBbUJDLElBQW5CLEVBQStCO0FBQ3BDLFlBQU1DLE1BQWUsSUFBckI7QUFDQSxZQUFNQyxTQUFzQkQsSUFBSUUsR0FBSixDQUFRRCxNQUFwQzs7QUFFQTs7QUFFQSxZQUFNRSxzQkFBc0JGLE9BQU9FLG1CQUFQLElBQThCLENBQTFEO0FBQ0EsWUFBTUMseUJBQXlCSCxPQUFPRyxzQkFBUCxJQUFpQyxDQUFoRTs7QUFFQSxVQUFJO0FBQ0YsZUFBTyxNQUFNTCxNQUFiO0FBQ0QsT0FGRCxTQUVVOztBQUVSO0FBQ0FFLGVBQU9FLG1CQUFQLEdBQTZCRixPQUFPSSxTQUFwQztBQUNBSixlQUFPRyxzQkFBUCxHQUFnQ0gsT0FBT0ssWUFBdkM7O0FBRUEsY0FBTUMsZ0JBQWdCUCxJQUFJRSxHQUFKLENBQVFNLE1BQTlCO0FBQ0EsY0FBTUMsYUFBYVQsSUFBSUUsR0FBSixDQUFRUSxHQUEzQjtBQUNBLGNBQU1DLGNBQWNWLE9BQU9JLFNBQVAsR0FBbUJGLG1CQUF2Qzs7QUFFQSxjQUFNUyxTQUFTWixJQUFJYSxHQUFKLENBQVFDLFVBQXZCO0FBQ0EsY0FBTUMsZUFBZWQsT0FBT0ssWUFBUCxHQUFzQkYsc0JBQTNDOztBQUVBLGNBQU1ZLFlBQVloQixJQUFJRSxHQUFKLENBQVFlLE9BQVIsQ0FBZ0IsWUFBaEIsQ0FBbEI7QUFDQSxjQUFNQyxVQUFVbEIsSUFBSUUsR0FBSixDQUFRZSxPQUFSLENBQWdCLFNBQWhCLENBQWhCO0FBQ0EsWUFBSUUsV0FBV25CLElBQUlFLEdBQUosQ0FBUUQsTUFBUixDQUFlbUIsYUFBOUI7O0FBRUEsY0FBTUMsWUFBWXJCLElBQUlFLEdBQUosQ0FBUWUsT0FBUixDQUFnQixpQkFBaEIsQ0FBbEI7QUFDQSxZQUFJSSxTQUFKLEVBQWU7QUFDYkYscUJBQVdFLFVBQVVDLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUJDLEtBQXJCLEVBQVg7QUFDRDs7QUFFRCxjQUFNQyxjQUFjO0FBQ2xCakIsdUJBRGtCO0FBRWxCRSxvQkFGa0I7QUFHbEJFLHFCQUhrQjtBQUlsQkMsZ0JBSmtCO0FBS2xCRyxzQkFMa0I7QUFNbEJDLG1CQU5rQjtBQU9sQkcsa0JBUGtCO0FBUWxCRDtBQVJrQixTQUFwQjs7QUFXQSxZQUFJbEIsSUFBSXlCLElBQUosQ0FBU0MsS0FBYixFQUFvQjtBQUNsQjVCLGlCQUFPNEIsS0FBUCxDQUFhMUIsSUFBSXlCLElBQUosQ0FBU0MsS0FBVCxDQUFlQyxLQUFmLElBQXdCM0IsSUFBSXlCLElBQUosQ0FBU0MsS0FBVCxDQUFlRSxRQUFmLEVBQXJDLEVBQWdFSixXQUFoRTtBQUNELFNBRkQsTUFFTztBQUNMMUIsaUJBQU8rQixJQUFQLENBQVl2QyxZQUFZd0MsR0FBWixDQUFnQmxCLE1BQWhCLENBQVosRUFBcUNZLFdBQXJDO0FBQ0Q7QUFDRjtBQUNGLEtBbEREOztBQUFBLGFBQXNCbkMsR0FBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxHQUF0QjtBQUFBO0FBbUREIiwiZmlsZSI6ImxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBkb3Qtbm90YXRpb24gKi9cbmltcG9ydCBodHRwIGZyb20gXCJodHRwXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcbmltcG9ydCB0eXBlIExvZ2dlciBmcm9tIFwiLi4vdXRpbC9sb2dnZXJcIlxuXG50eXBlIFN0YXRzU29ja2V0ID0gbmV0JFNvY2tldCAmIHtcbiAgYnl0ZXNSZWFkUHJldmlvdXNseT86IG51bWJlcixcbiAgYnl0ZXNXcml0dGVuUHJldmlvdXNseT86IG51bWJlcixcbn1cblxuY29uc3Qgc3RhdHVzQ29kZXM6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwXG5mb3IgKGNvbnN0IGNvZGUgaW4gaHR0cC5TVEFUVVNfQ09ERVMpIHtcbiAgY29uc3QgbnVtYmVyID0gcGFyc2VJbnQoY29kZSlcbiAgc3RhdHVzQ29kZXMuc2V0KG51bWJlciwgaHR0cC5TVEFUVVNfQ09ERVNbbnVtYmVyXS50b0xvd2VyQ2FzZSgpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2cobG9nZ2VyOiBMb2dnZXIpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIGxvZyhuZXh0OiBOZXh0KSB7XG4gICAgY29uc3QgY3R4OiBDb250ZXh0ID0gdGhpc1xuICAgIGNvbnN0IHNvY2tldDogU3RhdHNTb2NrZXQgPSBjdHgucmVxLnNvY2tldFxuXG4gICAgLyogQ2hlY2sgd2hhdCBoYXMgYmVlbiBwcmV2aW91c2x5IHJlY29yZGVkIGFzIHJlYWQvd3JpdHRlbiBvbiB0aGlzIHNvY2tldC5cbiAgICAgICBUaGUgcmVxdWVzdCBtYXkgbm90IGJlIHRoZSBmaXJzdCBvdmVyIHRoaXMgc29ja2V0LiAqL1xuICAgIGNvbnN0IGJ5dGVzUmVhZFByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNSZWFkUHJldmlvdXNseSB8fCAwXG4gICAgY29uc3QgYnl0ZXNXcml0dGVuUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1dyaXR0ZW5QcmV2aW91c2x5IHx8IDBcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgbmV4dCgpXG4gICAgfSBmaW5hbGx5IHtcblxuICAgICAgLyogU3RvcmUgY3VycmVudCByZWFkL3dyaXR0ZW4gY291bnQgZm9yIGZ1dHVyZSByZWZlcmVuY2UuICovXG4gICAgICBzb2NrZXQuYnl0ZXNSZWFkUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1JlYWRcbiAgICAgIHNvY2tldC5ieXRlc1dyaXR0ZW5QcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzV3JpdHRlblxuXG4gICAgICBjb25zdCByZXF1ZXN0TWV0aG9kID0gY3R4LnJlcS5tZXRob2RcbiAgICAgIGNvbnN0IHJlcXVlc3RVcmwgPSBjdHgucmVxLnVybFxuICAgICAgY29uc3QgcmVxdWVzdFNpemUgPSBzb2NrZXQuYnl0ZXNSZWFkIC0gYnl0ZXNSZWFkUHJldmlvdXNseVxuXG4gICAgICBjb25zdCBzdGF0dXMgPSBjdHgucmVzLnN0YXR1c0NvZGVcbiAgICAgIGNvbnN0IHJlc3BvbnNlU2l6ZSA9IHNvY2tldC5ieXRlc1dyaXR0ZW4gLSBieXRlc1dyaXR0ZW5QcmV2aW91c2x5XG5cbiAgICAgIGNvbnN0IHVzZXJBZ2VudCA9IGN0eC5yZXEuaGVhZGVyc1tcInVzZXItYWdlbnRcIl1cbiAgICAgIGNvbnN0IHJlZmVyZXIgPSBjdHgucmVxLmhlYWRlcnNbXCJyZWZlcmVyXCJdXG4gICAgICBsZXQgcmVtb3RlSXAgPSBjdHgucmVxLnNvY2tldC5yZW1vdGVBZGRyZXNzXG5cbiAgICAgIGNvbnN0IGZvcndhcmRlZCA9IGN0eC5yZXEuaGVhZGVyc1tcIngtZm9yd2FyZGVkLWZvclwiXVxuICAgICAgaWYgKGZvcndhcmRlZCkge1xuICAgICAgICByZW1vdGVJcCA9IGZvcndhcmRlZC5zcGxpdChcIixcIikuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBodHRwUmVxdWVzdCA9IHtcbiAgICAgICAgcmVxdWVzdE1ldGhvZCxcbiAgICAgICAgcmVxdWVzdFVybCxcbiAgICAgICAgcmVxdWVzdFNpemUsXG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgcmVzcG9uc2VTaXplLFxuICAgICAgICB1c2VyQWdlbnQsXG4gICAgICAgIHJlbW90ZUlwLFxuICAgICAgICByZWZlcmVyLFxuICAgICAgfVxuXG4gICAgICBpZiAoY3R4LmRhdGEuZXJyb3IpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKGN0eC5kYXRhLmVycm9yLnN0YWNrIHx8IGN0eC5kYXRhLmVycm9yLnRvU3RyaW5nKCksIGh0dHBSZXF1ZXN0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nZ2VyLmluZm8oc3RhdHVzQ29kZXMuZ2V0KHN0YXR1cyksIGh0dHBSZXF1ZXN0KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19