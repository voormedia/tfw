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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2xvZy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzdGF0dXNDb2RlcyIsIk1hcCIsImNvZGUiLCJTVEFUVVNfQ09ERVMiLCJudW1iZXIiLCJwYXJzZUludCIsInNldCIsInRvTG93ZXJDYXNlIiwibG9nZ2VyIiwibmV4dCIsInNvY2tldCIsInJlcXVlc3QiLCJieXRlc1JlYWRQcmV2aW91c2x5IiwiYnl0ZXNXcml0dGVuUHJldmlvdXNseSIsInN0YXJ0VGltZSIsInByb2Nlc3MiLCJocnRpbWUiLCJkYXRhIiwiYnl0ZXNSZWFkIiwiYnl0ZXNXcml0dGVuIiwicmVxdWVzdE1ldGhvZCIsIm1ldGhvZCIsInJlcXVlc3RVcmwiLCJ1cmwiLCJyZXF1ZXN0U2l6ZSIsInN0YXR1cyIsInJlc3BvbnNlIiwic3RhdHVzQ29kZSIsInJlc3BvbnNlU2l6ZSIsInVzZXJBZ2VudCIsImdldCIsInJlZmVyZXIiLCJzZWMiLCJuYW5vIiwibGF0ZW5jeSIsInRvRml4ZWQiLCJyZW1vdGVJcCIsInJlbW90ZUFkZHJlc3MiLCJmb3J3YXJkZWQiLCJzcGxpdCIsInNoaWZ0IiwiaHR0cFJlcXVlc3QiLCJsb2dDb250ZXh0IiwiT2JqZWN0IiwiYXNzaWduIiwiZXJyb3IiLCJleHBvc2UiLCJ3YXJuaW5nIiwibWVzc2FnZSIsInN0YWNrIiwidG9TdHJpbmciLCJpbmZvIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFtQndCQSxHOztBQWhCeEI7Ozs7Ozs7QUFGQTtBQUNBOzs7QUFXQSxNQUFNQyxjQUFtQyxJQUFJQyxHQUFKLEVBQXpDO0FBQ0EsS0FBSyxNQUFNQyxJQUFYLElBQW1CLGVBQUtDLFlBQXhCLEVBQXNDO0FBQ3BDLFFBQU1DLFNBQVNDLFNBQVNILElBQVQsQ0FBZjtBQUNBRixjQUFZTSxHQUFaLENBQWdCRixNQUFoQixFQUF3QixlQUFLRCxZQUFMLENBQWtCQyxNQUFsQixFQUEwQkcsV0FBMUIsRUFBeEI7QUFDRDs7QUFFYyxTQUFTUixHQUFULENB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ZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgZG90LW5vdGF0aW9uICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCBodHRwIGZyb20gXCJodHRwXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcbmltcG9ydCB0eXBlIHtIdHRwUmVxdWVzdCwgTG9nQ29udGV4dCwgTG9nZ2VyfSBmcm9tIFwiLi4vdXRpbC9sb2dnZXJcIlxuXG50eXBlIFN0YXRzU29ja2V0ID0gbmV0JFNvY2tldCAmIHtcbiAgYnl0ZXNSZWFkUHJldmlvdXNseT86IG51bWJlcixcbiAgYnl0ZXNXcml0dGVuUHJldmlvdXNseT86IG51bWJlcixcbn1cblxuY29uc3Qgc3RhdHVzQ29kZXM6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwXG5mb3IgKGNvbnN0IGNvZGUgaW4gaHR0cC5TVEFUVVNfQ09ERVMpIHtcbiAgY29uc3QgbnVtYmVyID0gcGFyc2VJbnQoY29kZSlcbiAgc3RhdHVzQ29kZXMuc2V0KG51bWJlciwgaHR0cC5TVEFUVVNfQ09ERVNbbnVtYmVyXS50b0xvd2VyQ2FzZSgpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2cobG9nZ2VyOiBMb2dnZXIpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIGxvZyhuZXh0OiBOZXh0KSB7XG4gICAgKHRoaXM6IENvbnRleHQpXG5cbiAgICBjb25zdCBzb2NrZXQ6IFN0YXRzU29ja2V0ID0gdGhpcy5yZXF1ZXN0LnNvY2tldFxuXG4gICAgLyogQ2hlY2sgd2hhdCBoYXMgYmVlbiBwcmV2aW91c2x5IHJlY29yZGVkIGFzIHJlYWQvd3JpdHRlbiBvbiB0aGlzIHNvY2tldC5cbiAgICAgICBUaGUgcmVxdWVzdCBtYXkgbm90IGJlIHRoZSBmaXJzdCBvdmVyIHRoaXMgc29ja2V0LiAqL1xuICAgIGNvbnN0IGJ5dGVzUmVhZFByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNSZWFkUHJldmlvdXNseSB8fCAwXG4gICAgY29uc3QgYnl0ZXNXcml0dGVuUHJldmlvdXNseSA9IHNvY2tldC5ieXRlc1dyaXR0ZW5QcmV2aW91c2x5IHx8IDBcblxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHByb2Nlc3MuaHJ0aW1lKClcblxuICAgIHRoaXMuZGF0YS5sb2cgPSB7fVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuZXh0KClcbiAgICB9IGZpbmFsbHkge1xuXG4gICAgICAvKiBTdG9yZSBjdXJyZW50IHJlYWQvd3JpdHRlbiBjb3VudCBmb3IgZnV0dXJlIHJlZmVyZW5jZS4gKi9cbiAgICAgIHNvY2tldC5ieXRlc1JlYWRQcmV2aW91c2x5ID0gc29ja2V0LmJ5dGVzUmVhZFxuICAgICAgc29ja2V0LmJ5dGVzV3JpdHRlblByZXZpb3VzbHkgPSBzb2NrZXQuYnl0ZXNXcml0dGVuXG5cbiAgICAgIGNvbnN0IHJlcXVlc3RNZXRob2QgPSB0aGlzLm1ldGhvZFxuICAgICAgY29uc3QgcmVxdWVzdFVybCA9IHRoaXMudXJsXG4gICAgICBjb25zdCByZXF1ZXN0U2l6ZSA9IHNvY2tldC5ieXRlc1JlYWQgLSBieXRlc1JlYWRQcmV2aW91c2x5XG5cbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMucmVzcG9uc2Uuc3RhdHVzQ29kZVxuICAgICAgY29uc3QgcmVzcG9uc2VTaXplID0gc29ja2V0LmJ5dGVzV3JpdHRlbiAtIGJ5dGVzV3JpdHRlblByZXZpb3VzbHlcblxuICAgICAgY29uc3QgdXNlckFnZW50ID0gdGhpcy5nZXQoXCJ1c2VyLWFnZW50XCIpXG4gICAgICBjb25zdCByZWZlcmVyID0gdGhpcy5nZXQoXCJyZWZlcmVyXCIpXG5cbiAgICAgIGNvbnN0IFtzZWMsIG5hbm9dID0gcHJvY2Vzcy5ocnRpbWUoc3RhcnRUaW1lKVxuICAgICAgY29uc3QgbGF0ZW5jeSA9IGAkeyhzZWMgKyAxZS05ICogbmFubykudG9GaXhlZCgzKX1zYFxuXG4gICAgICBsZXQgcmVtb3RlSXAgPSBzb2NrZXQucmVtb3RlQWRkcmVzc1xuICAgICAgY29uc3QgZm9yd2FyZGVkID0gdGhpcy5nZXQoXCJ4LWZvcndhcmRlZC1mb3JcIilcbiAgICAgIGlmIChmb3J3YXJkZWQpIHtcbiAgICAgICAgcmVtb3RlSXAgPSBmb3J3YXJkZWQuc3BsaXQoXCIsXCIpLnNoaWZ0KClcbiAgICAgIH1cblxuICAgICAgY29uc3QgaHR0cFJlcXVlc3Q6IEh0dHBSZXF1ZXN0ID0ge1xuICAgICAgICByZXF1ZXN0TWV0aG9kLFxuICAgICAgICByZXF1ZXN0VXJsLFxuICAgICAgICByZXF1ZXN0U2l6ZSxcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICByZXNwb25zZVNpemUsXG4gICAgICAgIHVzZXJBZ2VudCxcbiAgICAgICAgcmVtb3RlSXAsXG4gICAgICAgIHJlZmVyZXIsXG4gICAgICAgIGxhdGVuY3ksXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxvZ0NvbnRleHQ6IExvZ0NvbnRleHQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEubG9nLCB7aHR0cFJlcXVlc3R9KVxuXG4gICAgICBpZiAoc3RhdHVzID49IDUwMCAmJiB0aGlzLmRhdGEuZXJyb3IpIHtcbiAgICAgICAgLyogQW4gZXJyb3Igd2FzIHRocm93biBzb21ld2hlcmUuICovXG4gICAgICAgIGlmICh0aGlzLmRhdGEuZXJyb3IuZXhwb3NlKSB7XG4gICAgICAgICAgLyogVGhpcyBlcnJvciBpcyBleHBvc2FibGUsIHNvIGl0IGlzIHRvIGJlIGV4cGVjdGVkLiAqL1xuICAgICAgICAgIGxvZ2dlci53YXJuaW5nKHRoaXMuZGF0YS5lcnJvci5tZXNzYWdlIHx8IFwiKG5vIG1lc3NhZ2UpXCIsIGxvZ0NvbnRleHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogVGhpcyB3YXMgYW4gaW50ZXJuYWwgZXJyb3IsIG5vdCBzdXBwb3NlZCB0byBiZSBleHBvc2VkLiBMb2cgdGhlXG4gICAgICAgICAgICAgZW50aXJlIHN0YWNrIHRyYWNlIHNvIHdlIGNhbiBkZWJ1ZyBsYXRlci4gKi9cbiAgICAgICAgICBsb2dnZXIuZXJyb3IodGhpcy5kYXRhLmVycm9yLnN0YWNrIHx8IHRoaXMuZGF0YS5lcnJvci50b1N0cmluZygpLCBsb2dDb250ZXh0KVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBObyBlcnJvciB3YXMgdGhyb3duLCBvciBlcnJvciB3YXMgaW4gNHh4IHJhbmdlLiAqL1xuICAgICAgICBsb2dnZXIuaW5mbyhzdGF0dXNDb2Rlcy5nZXQoc3RhdHVzKSwgbG9nQ29udGV4dClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==