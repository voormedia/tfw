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
/* eslint-disable no-unused-expressions */


function shutdown(grace = 25) {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      var _this = this;

      this;

      /* Cancel request if server is stopping, but only after a grace period.
         This allows a request to be handled if there is enough time. */
      const timer = new _timer2.default(grace * 1000);
      const stop = (() => {
        var _ref2 = _asyncToGenerator(function* () {
          yield timer.sleep();

          const req = _this.request;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3NodXRkb3duLmpzIl0sIm5hbWVzIjpbInNodXRkb3duIiwiZ3JhY2UiLCJuZXh0IiwidGltZXIiLCJzdG9wIiwic2xlZXAiLCJyZXEiLCJyZXF1ZXN0IiwiY2FuY2VsbGVkIiwiUHJvbWlzZSIsInJhY2UiLCJjbGVhciIsIndyaXRlIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFhd0JBLFE7O0FBWHhCOzs7O0FBRUE7Ozs7O0FBSEE7OztBQVllLFNBQVNBLFFBQVQsQ0FBa0JDLFFBQWdCLEVBQWxDLEVBQWtEO0FBQy9EO0FBQUEsaUNBQU8sV0FBcUJDLElBQXJCLEVBQWlDO0FBQUE7O0FBQ3JDLFVBQUQ7O0FBRUE7O0FBRUEsWUFBTUMsUUFBUSxvQkFBVUYsUUFBUSxJQUFsQixDQUFkO0FBQ0EsWUFBTUc7QUFBQSxzQ0FBTyxhQUFZO0FBQ3ZCLGdCQUFNRCxNQUFNRSxLQUFOLEVBQU47O0FBRUEsZ0JBQU1DLE1BQXlCLE1BQUtDLE9BQXBDO0FBQ0EsY0FBSUQsSUFBSUUsU0FBUixFQUFtQjtBQUNqQixrQkFBTSwrQkFBdUIsMEJBQXZCLENBQU47QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBTyxJQUFJQyxPQUFKLENBQVksWUFBTSxDQUFFLENBQXBCLENBQVA7QUFDRDtBQUNGLFNBVEs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBTjs7QUFXQSxVQUFJO0FBQ0YsZUFBTyxNQUFNQSxRQUFRQyxJQUFSLENBQWEsQ0FBQ04sTUFBRCxFQUFTRixNQUFULENBQWIsQ0FBYjtBQUNELE9BRkQsU0FFVTtBQUNSOztBQUVBQyxjQUFNUSxLQUFOO0FBQ0Q7QUFDRixLQXhCRDs7QUFBQSxhQUFzQkMsS0FBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxLQUF0QjtBQUFBO0FBeUJEIiwiZmlsZSI6InNodXRkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IFRpbWVyIGZyb20gXCIuLi91dGlsL3RpbWVyXCJcblxuaW1wb3J0IHtTZXJ2aWNlVW5hdmFpbGFibGV9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge1JlcXVlc3R9IGZyb20gXCIuLi9jb250ZXh0XCJcblxudHlwZSBDYW5jZWxsaW5nUmVxdWVzdCA9IFJlcXVlc3QgJiB7XG4gIGNhbmNlbGxlZD86IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNodXRkb3duKGdyYWNlOiBudW1iZXIgPSAyNSk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gd3JpdGUobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgLyogQ2FuY2VsIHJlcXVlc3QgaWYgc2VydmVyIGlzIHN0b3BwaW5nLCBidXQgb25seSBhZnRlciBhIGdyYWNlIHBlcmlvZC5cbiAgICAgICBUaGlzIGFsbG93cyBhIHJlcXVlc3QgdG8gYmUgaGFuZGxlZCBpZiB0aGVyZSBpcyBlbm91Z2ggdGltZS4gKi9cbiAgICBjb25zdCB0aW1lciA9IG5ldyBUaW1lcihncmFjZSAqIDEwMDApXG4gICAgY29uc3Qgc3RvcCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRpbWVyLnNsZWVwKClcblxuICAgICAgY29uc3QgcmVxOiBDYW5jZWxsaW5nUmVxdWVzdCA9IHRoaXMucmVxdWVzdFxuICAgICAgaWYgKHJlcS5jYW5jZWxsZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlcnZpY2VVbmF2YWlsYWJsZShcIlBsZWFzZSByZXRyeSB0aGUgcmVxdWVzdFwiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHt9KVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgUHJvbWlzZS5yYWNlKFtzdG9wKCksIG5leHQoKV0pXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8qIENsZWFyIHRpbWVyLiBJdCBmcmVlcyBzZXRUaW1lb3V0IHJlZmVyZW5jZSB0byB0aGlzIGNvbnRleHQsIHBvdGVudGlhbGx5XG4gICAgICAgICBjb25zZXJ2aW5nIGEgbG90IG9mIG1lbW9yeSBpZiBtb3N0IHJlcXVlc3RzIGFyZSBzaG9ydC4gKi9cbiAgICAgIHRpbWVyLmNsZWFyKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==