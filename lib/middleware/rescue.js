"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rescue;

var _sleep = require("../util/sleep");

var _errors = require("../errors");

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
      const timer = new _sleep.Timer(terminationGrace);
      const stop = (() => {
        var _ref2 = _asyncToGenerator(function* () {
          yield timer.sleep();

          let req = ctx.req;
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
        if (!err.expose) {
          if (process.env.NODE_ENV === "test") throw err;

          ctx.data.error = err;
          err = new _errors.InternalServerError();
        }

        ctx.body = err;
        ctx.status = err.status;
      } finally {
        timer.clear();
      }
    });

    function rescue(_x) {
      return _ref.apply(this, arguments);
    }

    return rescue;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3Jlc2N1ZS5qcyJdLCJuYW1lcyI6WyJyZXNjdWUiLCJ0ZXJtaW5hdGlvbkdyYWNlIiwibmV4dCIsImN0eCIsInRpbWVyIiwic3RvcCIsInNsZWVwIiwicmVxIiwiY2FuY2VsbGVkIiwiUHJvbWlzZSIsInJhY2UiLCJlcnIiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJkYXRhIiwiZXJyb3IiLCJib2R5Iiwic3RhdHVzIiwiY2xlYXIiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQW1Cd0JBLE07O0FBZnhCOztBQUVBOzs7QUFMQTtBQUNBO0FBQ0E7OztBQWdCZSxTQUFTQSxNQUFULENBQWdCLEVBQUNDLG1CQUFtQixLQUFwQixLQUE0QyxFQUE1RCxFQUE0RTtBQUN6RjtBQUFBLGlDQUFPLFdBQXNCQyxJQUF0QixFQUFrQztBQUN2QyxZQUFNQyxNQUFlLElBQXJCOztBQUVBOztBQUVBLFlBQU1DLFFBQVEsaUJBQVVILGdCQUFWLENBQWQ7QUFDQSxZQUFNSTtBQUFBLHNDQUFPLGFBQVk7QUFDdkIsZ0JBQU1ELE1BQU1FLEtBQU4sRUFBTjs7QUFFQSxjQUFJQyxNQUF5QkosSUFBSUksR0FBakM7QUFDQSxjQUFJQSxJQUFJQyxTQUFSLEVBQW1CO0FBQ2pCLGtCQUFNLCtCQUF1QiwwQkFBdkIsQ0FBTjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPLElBQUlDLE9BQUosQ0FBWSxZQUFNLENBQUUsQ0FBcEIsQ0FBUDtBQUNEO0FBQ0YsU0FUSzs7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFOOztBQVdBLFVBQUk7QUFDRixlQUFPLE1BQU1BLFFBQVFDLElBQVIsQ0FBYSxDQUFDTCxNQUFELEVBQVNILE1BQVQsQ0FBYixDQUFiO0FBQ0QsT0FGRCxDQUVFLE9BQU9TLEdBQVAsRUFBWTtBQUNaLFlBQUksQ0FBQ0EsSUFBSUMsTUFBVCxFQUFpQjtBQUNmLGNBQUlDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixNQUE3QixFQUFxQyxNQUFNSixHQUFOOztBQUVyQ1IsY0FBSWEsSUFBSixDQUFTQyxLQUFULEdBQWlCTixHQUFqQjtBQUNBQSxnQkFBTSxpQ0FBTjtBQUNEOztBQUVEUixZQUFJZSxJQUFKLEdBQVdQLEdBQVg7QUFDQVIsWUFBSWdCLE1BQUosR0FBYVIsSUFBSVEsTUFBakI7QUFDRCxPQVpELFNBWVU7QUFDUmYsY0FBTWdCLEtBQU47QUFDRDtBQUNGLEtBaENEOztBQUFBLGFBQXNCcEIsTUFBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxNQUF0QjtBQUFBO0FBaUNEIiwiZmlsZSI6InJlc2N1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1leC1hc3NpZ24gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQge1RpbWVyfSBmcm9tIFwiLi4vdXRpbC9zbGVlcFwiXG5cbmltcG9ydCB7U2VydmljZVVuYXZhaWxhYmxlLCBJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcbmltcG9ydCB0eXBlIHtSZXF1ZXN0fSBmcm9tIFwiLi4vY29udGV4dFwiXG5cbnR5cGUgQ2FuY2VsbGluZ1JlcXVlc3QgPSBSZXF1ZXN0ICYge1xuICBjYW5jZWxsZWQ/OiBib29sZWFuLFxufVxuXG50eXBlIFJlc2N1ZU9wdGlvbnMgPSB7XG4gIHRlcm1pbmF0aW9uR3JhY2U6IG51bWJlcixcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzY3VlKHt0ZXJtaW5hdGlvbkdyYWNlID0gMjUwMDB9OiBSZXNjdWVPcHRpb25zID0ge30pOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHJlc2N1ZShuZXh0OiBOZXh0KSB7XG4gICAgY29uc3QgY3R4OiBDb250ZXh0ID0gdGhpc1xuXG4gICAgLyogQ2FuY2VsIHJlcXVlc3QgaWYgc2VydmVyIGlzIHN0b3BwaW5nLCBidXQgb25seSBhZnRlciBhIGdyYWNlIHBlcmlvZC5cbiAgICAgICBUaGlzIGFsbG93cyBhIHJlcXVlc3QgdG8gYmUgaGFuZGxlZCBpZiB0aGVyZSBpcyBlbm91Z2ggdGltZS4gKi9cbiAgICBjb25zdCB0aW1lciA9IG5ldyBUaW1lcih0ZXJtaW5hdGlvbkdyYWNlKVxuICAgIGNvbnN0IHN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aW1lci5zbGVlcCgpXG5cbiAgICAgIGxldCByZXE6IENhbmNlbGxpbmdSZXF1ZXN0ID0gY3R4LnJlcVxuICAgICAgaWYgKHJlcS5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlcnZpY2VVbmF2YWlsYWJsZShcIlBsZWFzZSByZXRyeSB0aGUgcmVxdWVzdFwiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHt9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5yYWNlKFtzdG9wKCksIG5leHQoKV0pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoIWVyci5leHBvc2UpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIikgdGhyb3cgZXJyXG5cbiAgICAgICAgY3R4LmRhdGEuZXJyb3IgPSBlcnJcbiAgICAgICAgZXJyID0gbmV3IEludGVybmFsU2VydmVyRXJyb3JcbiAgICAgIH1cblxuICAgICAgY3R4LmJvZHkgPSBlcnJcbiAgICAgIGN0eC5zdGF0dXMgPSBlcnIuc3RhdHVzXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRpbWVyLmNsZWFyKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==