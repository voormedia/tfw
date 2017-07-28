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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsImN0eCIsInNvY2tldCIsInJlcSIsImJ5dGVzUmVhZFByZXZpb3VzbHkiLCJieXRlc1dyaXR0ZW5QcmV2aW91c2x5Iiwic3RhcnRUaW1lIiwicHJvY2VzcyIsImhydGltZSIsImJ5dGVzUmVhZCIsImJ5dGVzV3JpdHRlbiIsInJlcXVlc3RNZXRob2QiLCJtZXRob2QiLCJyZXF1ZXN0VXJsIiwidXJsIiwicmVxdWVzdFNpemUiLCJzdGF0dXMiLCJyZXMiLCJzdGF0dXNDb2RlIiwicmVzcG9uc2VTaXplIiwidXNlckFnZW50IiwiaGVhZGVycyIsInJlZmVyZXIiLCJzZWMiLCJuYW5vIiwibGF0ZW5jeSIsInRvRml4ZWQiLCJyZW1vdGVJcCIsInJlbW90ZUFkZHJlc3MiLCJmb3J3YXJkZWQiLCJzcGxpdCIsInNoaWZ0IiwiaHR0cFJlcXVlc3QiLCJkYXRhIiwiZXJyb3IiLCJzdGFjayIsInRvU3RyaW5nIiwiaW5mbyIsImdldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBa0J3QkEsRzs7QUFoQnhCOzs7Ozs7O0FBREE7OztBQVdBLE1BQU1DLGNBQW1DLElBQUlDLEdBQUosRUFBekM7QUFDQSxLQUFLLE1BQU1DLElBQVgsSUFBbUIsZUFBS0MsWUFBeEIsRUFBc0M7QUFDcEMsUUFBTUMsU0FBU0MsU0FBU0gsSUFBVCxDQUFmO0FBQ0FGLGNBQVlNLEdBQVosQ0FBZ0JGLE1BQWhCLEVBQXdCLGVBQUtELFlBQUwsQ0FBa0JDLE1BQWxCLEVBQTBCRyxXQUExQixFQUF4QjtBQUNEOztBQUVjLFNBQVNSLEdBQVQsQ0FBYVMsTUFBYixFQUF5QztBQUN0RDtBQUFBLGlDQUFPLFdBQW1CQyxJQUFuQixFQUErQjtBQUNwQyxZQUFNQyxNQUFlLElBQXJCO0FBQ0EsWUFBTUMsU0FBc0JELElBQUlFLEdBQUosQ0FBUUQsTUFBcEM7O0FBRUE7O0FBRUEsWUFBTUUsc0JBQXNCRixPQUFPRSxtQkFBUCxJQUE4QixDQUExRDtBQUNBLFlBQU1DLHlCQUF5QkgsT0FBT0csc0JBQVAsSUFBaUMsQ0FBaEU7O0FBRUEsWUFBTUMsWUFBWUMsUUFBUUMsTUFBUixFQUFsQjs7QUFFQSxVQUFJO0FBQ0YsZUFBTyxNQUFNUixNQUFiO0FBQ0QsT0FGRCxTQUVVOztBQUVSO0FBQ0FFLGVBQU9FLG1CQUFQLEdBQTZCRixPQUFPTyxTQUFwQztBQUNBUCxlQUFPRyxzQkFBUCxHQUFnQ0gsT0FBT1EsWUFBdkM7O0FBRUEsY0FBTUMsZ0JBQWdCVixJQUFJRSxHQUFKLENBQVFTLE1BQTlCO0FBQ0EsY0FBTUMsYUFBYVosSUFBSUUsR0FBSixDQUFRVyxHQUEzQjtBQUNBLGNBQU1DLGNBQWNiLE9BQU9PLFNBQVAsR0FBbUJMLG1CQUF2Qzs7QUFFQSxjQUFNWSxTQUFTZixJQUFJZ0IsR0FBSixDQUFRQyxVQUF2QjtBQUNBLGNBQU1DLGVBQWVqQixPQUFPUSxZQUFQLEdBQXNCTCxzQkFBM0M7O0FBRUEsY0FBTWUsWUFBWW5CLElBQUlFLEdBQUosQ0FBUWtCLE9BQVIsQ0FBZ0IsWUFBaEIsQ0FBbEI7QUFDQSxjQUFNQyxVQUFVckIsSUFBSUUsR0FBSixDQUFRa0IsT0FBUixDQUFnQixTQUFoQixDQUFoQjs7QUFFQSxjQUFNLENBQUNFLEdBQUQsRUFBTUMsSUFBTixJQUFjakIsUUFBUUMsTUFBUixDQUFlRixTQUFmLENBQXBCO0FBQ0EsY0FBTW1CLFVBQVcsR0FBRSxDQUFDRixNQUFNLE9BQU9DLElBQWQsRUFBb0JFLE9BQXBCLENBQTRCLENBQTVCLENBQStCLEdBQWxEOztBQUVBLFlBQUlDLFdBQVcxQixJQUFJRSxHQUFKLENBQVFELE1BQVIsQ0FBZTBCLGFBQTlCO0FBQ0EsY0FBTUMsWUFBWTVCLElBQUlFLEdBQUosQ0FBUWtCLE9BQVIsQ0FBZ0IsaUJBQWhCLENBQWxCO0FBQ0EsWUFBSVEsU0FBSixFQUFlO0FBQ2JGLHFCQUFXRSxVQUFVQyxLQUFWLENBQWdCLEdBQWhCLEVBQXFCQyxLQUFyQixFQUFYO0FBQ0Q7O0FBRUQsY0FBTUMsY0FBMkI7QUFDL0JyQix1QkFEK0I7QUFFL0JFLG9CQUYrQjtBQUcvQkUscUJBSCtCO0FBSS9CQyxnQkFKK0I7QUFLL0JHLHNCQUwrQjtBQU0vQkMsbUJBTitCO0FBTy9CTyxrQkFQK0I7QUFRL0JMLGlCQVIrQjtBQVMvQkc7QUFUK0IsU0FBakM7O0FBWUEsWUFBSXhCLElBQUlnQyxJQUFKLENBQVNDLEtBQWIsRUFBb0I7QUFDbEJuQyxpQkFBT21DLEtBQVAsQ0FBYWpDLElBQUlnQyxJQUFKLENBQVNDLEtBQVQsQ0FBZUMsS0FBZixJQUF3QmxDLElBQUlnQyxJQUFKLENBQVNDLEtBQVQsQ0FBZUUsUUFBZixFQUFyQyxFQUFnRUosV0FBaEU7QUFDRCxTQUZELE1BRU87QUFDTGpDLGlCQUFPc0MsSUFBUCxDQUFZOUMsWUFBWStDLEdBQVosQ0FBZ0J0QixNQUFoQixDQUFaLEVBQXFDZ0IsV0FBckM7QUFDRDtBQUNGO0FBQ0YsS0F4REQ7O0FBQUEsYUFBc0IxQyxHQUF0QjtBQUFBO0FBQUE7O0FBQUEsV0FBc0JBLEdBQXRCO0FBQUE7QUF5REQiLCJmaWxlIjoibG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIGRvdC1ub3RhdGlvbiAqL1xuaW1wb3J0IGh0dHAgZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge0h0dHBSZXF1ZXN0LCBMb2dnZXJ9IGZyb20gXCIuLi91dGlsL2xvZ2dlclwiXG5cbnR5cGUgU3RhdHNTb2NrZXQgPSBuZXQkU29ja2V0ICYge1xuICBieXRlc1JlYWRQcmV2aW91c2x5PzogbnVtYmVyLFxuICBieXRlc1dyaXR0ZW5QcmV2aW91c2x5PzogbnVtYmVyLFxufVxuXG5jb25zdCBzdGF0dXNDb2RlczogTWFwPG51bWJlciwgc3RyaW5nPiA9IG5ldyBNYXBcbmZvciAoY29uc3QgY29kZSBpbiBodHRwLlNUQVRVU19DT0RFUykge1xuICBjb25zdCBudW1iZXIgPSBwYXJzZUludChjb2RlKVxuICBzdGF0dXNDb2Rlcy5zZXQobnVtYmVyLCBodHRwLlNUQVRVU19DT0RFU1tudW1iZXJdLnRvTG93ZXJDYXNlKCkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvZyhsb2dnZXI6IExvZ2dlcik6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gbG9nKG5leHQ6IE5leHQpIHtcbiAgICBjb25zdCBjdHg6IENvbnRleHQgPSB0aGlzXG4gICAgY29uc3Qgc29ja2V0OiBTdGF0c1NvY2tldCA9IGN0eC5yZXEuc29ja2V0XG5cbiAgICAvKiBDaGVjayB3aGF0IGhhcyBiZWVuIHByZXZpb3VzbHkgcmVjb3JkZWQgYXMgcmVhZC93cml0dGVuIG9uIHRoaXMgc29ja2V0LlxuICAgICAgIFRoZSByZXF1ZXN0IG1heSBub3QgYmUgdGhlIGZpcnN0IG92ZXIgdGhpcyBzb2NrZXQuICovXG4gICAgY29uc3QgYnl0ZXNSZWFkUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5IHx8IDBcbiAgICBjb25zdCBieXRlc1dyaXR0ZW5QcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgfHwgMFxuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gcHJvY2Vzcy5ocnRpbWUoKVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuZXh0KClcbiAgICB9IGZpbmFsbHkge1xuXG4gICAgICAvKiBTdG9yZSBjdXJyZW50IHJlYWQvd3JpdHRlbiBjb3VudCBmb3IgZnV0dXJlIHJlZmVyZW5jZS4gKi9cbiAgICAgIHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFxuICAgICAgc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuXG5cbiAgICAgIGNvbnN0IHJlcXVlc3RNZXRob2QgPSBjdHgucmVxLm1ldGhvZFxuICAgICAgY29uc3QgcmVxdWVzdFVybCA9IGN0eC5yZXEudXJsXG4gICAgICBjb25zdCByZXF1ZXN0U2l6ZSA9IHNvY2tldC5ieXRlc1JlYWQgLSBieXRlc1JlYWRQcmV2aW91c2x5XG5cbiAgICAgIGNvbnN0IHN0YXR1cyA9IGN0eC5yZXMuc3RhdHVzQ29kZVxuICAgICAgY29uc3QgcmVzcG9uc2VTaXplID0gc29ja2V0LmJ5dGVzV3JpdHRlbiAtIGJ5dGVzV3JpdHRlblByZXZpb3VzbHlcblxuICAgICAgY29uc3QgdXNlckFnZW50ID0gY3R4LnJlcS5oZWFkZXJzW1widXNlci1hZ2VudFwiXVxuICAgICAgY29uc3QgcmVmZXJlciA9IGN0eC5yZXEuaGVhZGVyc1tcInJlZmVyZXJcIl1cblxuICAgICAgY29uc3QgW3NlYywgbmFub10gPSBwcm9jZXNzLmhydGltZShzdGFydFRpbWUpXG4gICAgICBjb25zdCBsYXRlbmN5ID0gYCR7KHNlYyArIDFlLTkgKiBuYW5vKS50b0ZpeGVkKDMpfXNgXG5cbiAgICAgIGxldCByZW1vdGVJcCA9IGN0eC5yZXEuc29ja2V0LnJlbW90ZUFkZHJlc3NcbiAgICAgIGNvbnN0IGZvcndhcmRlZCA9IGN0eC5yZXEuaGVhZGVyc1tcIngtZm9yd2FyZGVkLWZvclwiXVxuICAgICAgaWYgKGZvcndhcmRlZCkge1xuICAgICAgICByZW1vdGVJcCA9IGZvcndhcmRlZC5zcGxpdChcIixcIikuc2hpZnQoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBodHRwUmVxdWVzdDogSHR0cFJlcXVlc3QgPSB7XG4gICAgICAgIHJlcXVlc3RNZXRob2QsXG4gICAgICAgIHJlcXVlc3RVcmwsXG4gICAgICAgIHJlcXVlc3RTaXplLFxuICAgICAgICBzdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlU2l6ZSxcbiAgICAgICAgdXNlckFnZW50LFxuICAgICAgICByZW1vdGVJcCxcbiAgICAgICAgcmVmZXJlcixcbiAgICAgICAgbGF0ZW5jeSxcbiAgICAgIH1cblxuICAgICAgaWYgKGN0eC5kYXRhLmVycm9yKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcihjdHguZGF0YS5lcnJvci5zdGFjayB8fCBjdHguZGF0YS5lcnJvci50b1N0cmluZygpLCBodHRwUmVxdWVzdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2dlci5pbmZvKHN0YXR1c0NvZGVzLmdldChzdGF0dXMpLCBodHRwUmVxdWVzdClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==