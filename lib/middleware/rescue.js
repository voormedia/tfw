"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rescue;

var _timer = require("../util/timer");

var _timer2 = _interopRequireDefault(_timer);

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-ex-assign */


function rescue({ terminationGrace = 25000 } = {}) {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      const ctx = this;

      /* Cancel request if server is stopping, but only after a grace period.
         This allows a request to be handled if there is enough time. */
      const timer = new _timer2.default(terminationGrace);
      const stop = (() => {
        var _ref2 = _asyncToGenerator(function* () {
          yield timer.sleep();

          const req = ctx.req;
          if (req.cancelled) {
            throw new _errors.ServiceUnavailable("Please retry the request");
          } else {
            return new Promise(function () {});
          }
        });

        return function stop() {
          return _ref2.apply(this, arguments);
        };
      })();

      try {
        return yield Promise.race([stop(), next()]);
      } catch (err) {
        ctx.data.error = err;

        if (!err.expose) {
          if (process.env.NODE_ENV === "test") throw err;
          err = new _errors.InternalServerError();
        }

        ctx.body = err;
        ctx.status = err.status;
      } finally {
        /* Clear timer. It frees setTimeout reference to this context, potentially
           conserving a lot of memory if most requests are short. */
        timer.clear();
      }
    });

    function rescue(_x) {
      return _ref.apply(this, arguments);
    }

    return rescue;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3Jlc2N1ZS5qcyJdLCJuYW1lcyI6WyJyZXNjdWUiLCJ0ZXJtaW5hdGlvbkdyYWNlIiwibmV4dCIsImN0eCIsInRpbWVyIiwic3RvcCIsInNsZWVwIiwicmVxIiwiY2FuY2VsbGVkIiwiUHJvbWlzZSIsInJhY2UiLCJlcnIiLCJkYXRhIiwiZXJyb3IiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJib2R5Iiwic3RhdHVzIiwiY2xlYXIiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWlCd0JBLE07O0FBZnhCOzs7O0FBRUE7Ozs7O0FBSEE7OztBQWdCZSxTQUFTQSxNQUFULENBQWdCLEVBQUNDLG1CQUFtQixLQUFwQixLQUE0QyxFQUE1RCxFQUE0RTtBQUN6RjtBQUFBLGlDQUFPLFdBQXNCQyxJQUF0QixFQUFrQztBQUN2QyxZQUFNQyxNQUFlLElBQXJCOztBQUVBOztBQUVBLFlBQU1DLFFBQVEsb0JBQVVILGdCQUFWLENBQWQ7QUFDQSxZQUFNSTtBQUFBLHNDQUFPLGFBQVk7QUFDdkIsZ0JBQU1ELE1BQU1FLEtBQU4sRUFBTjs7QUFFQSxnQkFBTUMsTUFBeUJKLElBQUlJLEdBQW5DO0FBQ0EsY0FBSUEsSUFBSUMsU0FBUixFQUFtQjtBQUNqQixrQkFBTSwrQkFBdUIsMEJBQXZCLENBQU47QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBTyxJQUFJQyxPQUFKLENBQVksWUFBTSxDQUFFLENBQXBCLENBQVA7QUFDRDtBQUNGLFNBVEs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBTjs7QUFXQSxVQUFJO0FBQ0YsZUFBTyxNQUFNQSxRQUFRQyxJQUFSLENBQWEsQ0FBQ0wsTUFBRCxFQUFTSCxNQUFULENBQWIsQ0FBYjtBQUNELE9BRkQsQ0FFRSxPQUFPUyxHQUFQLEVBQVk7QUFDWlIsWUFBSVMsSUFBSixDQUFTQyxLQUFULEdBQWlCRixHQUFqQjs7QUFFQSxZQUFJLENBQUNBLElBQUlHLE1BQVQsRUFBaUI7QUFDZixjQUFJQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsTUFBN0IsRUFBcUMsTUFBTU4sR0FBTjtBQUNyQ0EsZ0JBQU0saUNBQU47QUFDRDs7QUFFRFIsWUFBSWUsSUFBSixHQUFXUCxHQUFYO0FBQ0FSLFlBQUlnQixNQUFKLEdBQWFSLElBQUlRLE1BQWpCO0FBQ0QsT0FaRCxTQVlVO0FBQ1I7O0FBRUFmLGNBQU1nQixLQUFOO0FBQ0Q7QUFDRixLQWxDRDs7QUFBQSxhQUFzQnBCLE1BQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsTUFBdEI7QUFBQTtBQW1DRCIsImZpbGUiOiJyZXNjdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tZXgtYXNzaWduICovXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4uL3V0aWwvdGltZXJcIlxuXG5pbXBvcnQge1NlcnZpY2VVbmF2YWlsYWJsZSwgSW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4uL2Vycm9yc1wiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7UmVxdWVzdH0gZnJvbSBcIi4uL2NvbnRleHRcIlxuXG50eXBlIENhbmNlbGxpbmdSZXF1ZXN0ID0gUmVxdWVzdCAmIHtcbiAgY2FuY2VsbGVkPzogYm9vbGVhbixcbn1cblxudHlwZSBSZXNjdWVPcHRpb25zID0ge1xuICB0ZXJtaW5hdGlvbkdyYWNlOiBudW1iZXIsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc2N1ZSh7dGVybWluYXRpb25HcmFjZSA9IDI1MDAwfTogUmVzY3VlT3B0aW9ucyA9IHt9KTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiByZXNjdWUobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcblxuICAgIC8qIENhbmNlbCByZXF1ZXN0IGlmIHNlcnZlciBpcyBzdG9wcGluZywgYnV0IG9ubHkgYWZ0ZXIgYSBncmFjZSBwZXJpb2QuXG4gICAgICAgVGhpcyBhbGxvd3MgYSByZXF1ZXN0IHRvIGJlIGhhbmRsZWQgaWYgdGhlcmUgaXMgZW5vdWdoIHRpbWUuICovXG4gICAgY29uc3QgdGltZXIgPSBuZXcgVGltZXIodGVybWluYXRpb25HcmFjZSlcbiAgICBjb25zdCBzdG9wID0gYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGltZXIuc2xlZXAoKVxuXG4gICAgICBjb25zdCByZXE6IENhbmNlbGxpbmdSZXF1ZXN0ID0gY3R4LnJlcVxuICAgICAgaWYgKHJlcS5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlcnZpY2VVbmF2YWlsYWJsZShcIlBsZWFzZSByZXRyeSB0aGUgcmVxdWVzdFwiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHt9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5yYWNlKFtzdG9wKCksIG5leHQoKV0pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjdHguZGF0YS5lcnJvciA9IGVyclxuXG4gICAgICBpZiAoIWVyci5leHBvc2UpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIikgdGhyb3cgZXJyXG4gICAgICAgIGVyciA9IG5ldyBJbnRlcm5hbFNlcnZlckVycm9yXG4gICAgICB9XG5cbiAgICAgIGN0eC5ib2R5ID0gZXJyXG4gICAgICBjdHguc3RhdHVzID0gZXJyLnN0YXR1c1xuICAgIH0gZmluYWxseSB7XG4gICAgICAvKiBDbGVhciB0aW1lci4gSXQgZnJlZXMgc2V0VGltZW91dCByZWZlcmVuY2UgdG8gdGhpcyBjb250ZXh0LCBwb3RlbnRpYWxseVxuICAgICAgICAgY29uc2VydmluZyBhIGxvdCBvZiBtZW1vcnkgaWYgbW9zdCByZXF1ZXN0cyBhcmUgc2hvcnQuICovXG4gICAgICB0aW1lci5jbGVhcigpXG4gICAgfVxuICB9XG59XG4iXX0=