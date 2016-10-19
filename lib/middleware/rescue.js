"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rescue;

var _sleep = require("../util/sleep");

var _sleep2 = _interopRequireDefault(_sleep);

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-ex-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */


function rescue({ terminationGrace = 25000 } = {}) {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      const ctx = this;

      /* Cancel request if server is stopping, but only after a grace period.
         This allows a request to be handled if there is enough time. */
      const stop = (() => {
        var _ref2 = _asyncToGenerator(function* () {
          yield (0, _sleep2.default)(terminationGrace);

          let req = ctx.req;
          if (req.cancelled) {
            throw new _errors.ServiceUnavailable("Please retry the request");
          } else {
            yield (0, _sleep2.default)(600000);
          }
        });

        return function stop() {
          return _ref2.apply(this, arguments);
        };
      })();

      try {
        return yield Promise.race([stop(), next()]);
      } catch (err) {
        if (!err.expose) {
          if (process.env.NODE_ENV === "test") throw err;

          ctx.data.error = err;
          err = new _errors.InternalServerError();
        }

        ctx.body = err;
        ctx.status = err.status;
      }
    });

    function rescue(_x) {
      return _ref.apply(this, arguments);
    }

    return rescue;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3Jlc2N1ZS5qcyJdLCJuYW1lcyI6WyJyZXNjdWUiLCJ0ZXJtaW5hdGlvbkdyYWNlIiwibmV4dCIsImN0eCIsInN0b3AiLCJyZXEiLCJjYW5jZWxsZWQiLCJQcm9taXNlIiwicmFjZSIsImVyciIsImV4cG9zZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsImRhdGEiLCJlcnJvciIsImJvZHkiLCJzdGF0dXMiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQW1Cd0JBLE07O0FBZnhCOzs7O0FBRUE7Ozs7O0FBTEE7QUFDQTtBQUNBOzs7QUFnQmUsU0FBU0EsTUFBVCxDQUFnQixFQUFDQyxtQkFBbUIsS0FBcEIsS0FBNEMsRUFBNUQsRUFBNEU7QUFDekY7QUFBQSxpQ0FBTyxXQUFzQkMsSUFBdEIsRUFBa0M7QUFDdkMsWUFBTUMsTUFBZSxJQUFyQjs7QUFFQTs7QUFFQSxZQUFNQztBQUFBLHNDQUFPLGFBQVk7QUFDdkIsZ0JBQU0scUJBQU1ILGdCQUFOLENBQU47O0FBRUEsY0FBSUksTUFBeUJGLElBQUlFLEdBQWpDO0FBQ0EsY0FBSUEsSUFBSUMsU0FBUixFQUFtQjtBQUNqQixrQkFBTSwrQkFBdUIsMEJBQXZCLENBQU47QUFDRCxXQUZELE1BRU87QUFDTCxrQkFBTSxxQkFBTSxNQUFOLENBQU47QUFDRDtBQUNGLFNBVEs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBTjs7QUFXQSxVQUFJO0FBQ0YsZUFBTyxNQUFNQyxRQUFRQyxJQUFSLENBQWEsQ0FBQ0osTUFBRCxFQUFTRixNQUFULENBQWIsQ0FBYjtBQUNELE9BRkQsQ0FFRSxPQUFPTyxHQUFQLEVBQVk7QUFDWixZQUFJLENBQUNBLElBQUlDLE1BQVQsRUFBaUI7QUFDZixjQUFJQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsTUFBN0IsRUFBcUMsTUFBTUosR0FBTjs7QUFFckNOLGNBQUlXLElBQUosQ0FBU0MsS0FBVCxHQUFpQk4sR0FBakI7QUFDQUEsZ0JBQU0saUNBQU47QUFDRDs7QUFFRE4sWUFBSWEsSUFBSixHQUFXUCxHQUFYO0FBQ0FOLFlBQUljLE1BQUosR0FBYVIsSUFBSVEsTUFBakI7QUFDRDtBQUNGLEtBN0JEOztBQUFBLGFBQXNCakIsTUFBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxNQUF0QjtBQUFBO0FBOEJEIiwiZmlsZSI6InJlc2N1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1leC1hc3NpZ24gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgc2xlZXAgZnJvbSBcIi4uL3V0aWwvc2xlZXBcIlxuXG5pbXBvcnQge1NlcnZpY2VVbmF2YWlsYWJsZSwgSW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4uL2Vycm9yc1wiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7UmVxdWVzdH0gZnJvbSBcIi4uL2NvbnRleHRcIlxuXG50eXBlIENhbmNlbGxpbmdSZXF1ZXN0ID0gUmVxdWVzdCAmIHtcbiAgY2FuY2VsbGVkPzogYm9vbGVhbixcbn1cblxudHlwZSBSZXNjdWVPcHRpb25zID0ge1xuICB0ZXJtaW5hdGlvbkdyYWNlOiBudW1iZXIsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc2N1ZSh7dGVybWluYXRpb25HcmFjZSA9IDI1MDAwfTogUmVzY3VlT3B0aW9ucyA9IHt9KTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiByZXNjdWUobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcblxuICAgIC8qIENhbmNlbCByZXF1ZXN0IGlmIHNlcnZlciBpcyBzdG9wcGluZywgYnV0IG9ubHkgYWZ0ZXIgYSBncmFjZSBwZXJpb2QuXG4gICAgICAgVGhpcyBhbGxvd3MgYSByZXF1ZXN0IHRvIGJlIGhhbmRsZWQgaWYgdGhlcmUgaXMgZW5vdWdoIHRpbWUuICovXG4gICAgY29uc3Qgc3RvcCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHNsZWVwKHRlcm1pbmF0aW9uR3JhY2UpXG5cbiAgICAgIGxldCByZXE6IENhbmNlbGxpbmdSZXF1ZXN0ID0gY3R4LnJlcVxuICAgICAgaWYgKHJlcS5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlcnZpY2VVbmF2YWlsYWJsZShcIlBsZWFzZSByZXRyeSB0aGUgcmVxdWVzdFwiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgc2xlZXAoNjAwMDAwKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5yYWNlKFtzdG9wKCksIG5leHQoKV0pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoIWVyci5leHBvc2UpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIikgdGhyb3cgZXJyXG5cbiAgICAgICAgY3R4LmRhdGEuZXJyb3IgPSBlcnJcbiAgICAgICAgZXJyID0gbmV3IEludGVybmFsU2VydmVyRXJyb3JcbiAgICAgIH1cblxuICAgICAgY3R4LmJvZHkgPSBlcnJcbiAgICAgIGN0eC5zdGF0dXMgPSBlcnIuc3RhdHVzXG4gICAgfVxuICB9XG59XG4iXX0=