"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shutdown;

var _timer = require("../util/timer");

var _timer2 = _interopRequireDefault(_timer);

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-ex-assign */


function shutdown(grace = 25) {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      const ctx = this;

      /* Cancel request if server is stopping, but only after a grace period.
         This allows a request to be handled if there is enough time. */
      const timer = new _timer2.default(grace * 1000);
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
      } finally {
        /* Clear timer. It frees setTimeout reference to this context, potentially
           conserving a lot of memory if most requests are short. */
        timer.clear();
      }
    });

    function write(_x) {
      return _ref.apply(this, arguments);
    }

    return write;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3NodXRkb3duLmpzIl0sIm5hbWVzIjpbInNodXRkb3duIiwiZ3JhY2UiLCJuZXh0IiwiY3R4IiwidGltZXIiLCJzdG9wIiwic2xlZXAiLCJyZXEiLCJjYW5jZWxsZWQiLCJQcm9taXNlIiwicmFjZSIsImNsZWFyIiwid3JpdGUiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWF3QkEsUTs7QUFYeEI7Ozs7QUFFQTs7Ozs7QUFIQTs7O0FBWWUsU0FBU0EsUUFBVCxDQUFrQkMsUUFBZ0IsRUFBbEMsRUFBa0Q7QUFDL0Q7QUFBQSxpQ0FBTyxXQUFxQkMsSUFBckIsRUFBaUM7QUFDdEMsWUFBTUMsTUFBZSxJQUFyQjs7QUFFQTs7QUFFQSxZQUFNQyxRQUFRLG9CQUFVSCxRQUFRLElBQWxCLENBQWQ7QUFDQSxZQUFNSTtBQUFBLHNDQUFPLGFBQVk7QUFDdkIsZ0JBQU1ELE1BQU1FLEtBQU4sRUFBTjs7QUFFQSxnQkFBTUMsTUFBeUJKLElBQUlJLEdBQW5DO0FBQ0EsY0FBSUEsSUFBSUMsU0FBUixFQUFtQjtBQUNqQixrQkFBTSwrQkFBdUIsMEJBQXZCLENBQU47QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBTyxJQUFJQyxPQUFKLENBQVksWUFBTSxDQUFFLENBQXBCLENBQVA7QUFDRDtBQUNGLFNBVEs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBTjs7QUFXQSxVQUFJO0FBQ0YsZUFBTyxNQUFNQSxRQUFRQyxJQUFSLENBQWEsQ0FBQ0wsTUFBRCxFQUFTSCxNQUFULENBQWIsQ0FBYjtBQUNELE9BRkQsU0FFVTtBQUNSOztBQUVBRSxjQUFNTyxLQUFOO0FBQ0Q7QUFDRixLQXhCRDs7QUFBQSxhQUFzQkMsS0FBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxLQUF0QjtBQUFBO0FBeUJEIiwiZmlsZSI6InNodXRkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWV4LWFzc2lnbiAqL1xuaW1wb3J0IFRpbWVyIGZyb20gXCIuLi91dGlsL3RpbWVyXCJcblxuaW1wb3J0IHtTZXJ2aWNlVW5hdmFpbGFibGV9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge1JlcXVlc3R9IGZyb20gXCIuLi9jb250ZXh0XCJcblxudHlwZSBDYW5jZWxsaW5nUmVxdWVzdCA9IFJlcXVlc3QgJiB7XG4gIGNhbmNlbGxlZD86IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNodXRkb3duKGdyYWNlOiBudW1iZXIgPSAyNSk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gd3JpdGUobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcblxuICAgIC8qIENhbmNlbCByZXF1ZXN0IGlmIHNlcnZlciBpcyBzdG9wcGluZywgYnV0IG9ubHkgYWZ0ZXIgYSBncmFjZSBwZXJpb2QuXG4gICAgICAgVGhpcyBhbGxvd3MgYSByZXF1ZXN0IHRvIGJlIGhhbmRsZWQgaWYgdGhlcmUgaXMgZW5vdWdoIHRpbWUuICovXG4gICAgY29uc3QgdGltZXIgPSBuZXcgVGltZXIoZ3JhY2UgKiAxMDAwKVxuICAgIGNvbnN0IHN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aW1lci5zbGVlcCgpXG5cbiAgICAgIGNvbnN0IHJlcTogQ2FuY2VsbGluZ1JlcXVlc3QgPSBjdHgucmVxXG4gICAgICBpZiAocmVxLmNhbmNlbGxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgU2VydmljZVVuYXZhaWxhYmxlKFwiUGxlYXNlIHJldHJ5IHRoZSByZXF1ZXN0XCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pXG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLnJhY2UoW3N0b3AoKSwgbmV4dCgpXSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgLyogQ2xlYXIgdGltZXIuIEl0IGZyZWVzIHNldFRpbWVvdXQgcmVmZXJlbmNlIHRvIHRoaXMgY29udGV4dCwgcG90ZW50aWFsbHlcbiAgICAgICAgIGNvbnNlcnZpbmcgYSBsb3Qgb2YgbWVtb3J5IGlmIG1vc3QgcmVxdWVzdHMgYXJlIHNob3J0LiAqL1xuICAgICAgdGltZXIuY2xlYXIoKVxuICAgIH1cbiAgfVxufVxuIl19