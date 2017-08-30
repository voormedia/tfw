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

          if (_this.request.socket.server.closing) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3NodXRkb3duLmpzIl0sIm5hbWVzIjpbInNodXRkb3duIiwiZ3JhY2UiLCJuZXh0IiwidGltZXIiLCJzdG9wIiwic2xlZXAiLCJyZXF1ZXN0Iiwic29ja2V0Iiwic2VydmVyIiwiY2xvc2luZyIsIlByb21pc2UiLCJyYWNlIiwiY2xlYXIiLCJ3cml0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBUXdCQSxROztBQU54Qjs7OztBQUVBOzs7OztBQUhBOzs7QUFPZSxTQUFTQSxRQUFULENBQWtCQyxRQUFnQixFQUFsQyxFQUFrRDtBQUMvRDtBQUFBLGlDQUFPLFdBQXFCQyxJQUFyQixFQUFpQztBQUFBOztBQUNyQyxVQUFEOztBQUVBOztBQUVBLFlBQU1DLFFBQVEsb0JBQVVGLFFBQVEsSUFBbEIsQ0FBZDtBQUNBLFlBQU1HO0FBQUEsc0NBQU8sYUFBWTtBQUN2QixnQkFBTUQsTUFBTUUsS0FBTixFQUFOOztBQUVBLGNBQUksTUFBS0MsT0FBTCxDQUFhQyxNQUFiLENBQW9CQyxNQUFwQixDQUEyQkMsT0FBL0IsRUFBd0M7QUFDdEMsa0JBQU0sK0JBQXVCLDBCQUF2QixDQUFOO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsbUJBQU8sSUFBSUMsT0FBSixDQUFZLFlBQU0sQ0FBRSxDQUFwQixDQUFQO0FBQ0Q7QUFDRixTQVJLOztBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQU47O0FBVUEsVUFBSTtBQUNGLGVBQU8sTUFBTUEsUUFBUUMsSUFBUixDQUFhLENBQUNQLE1BQUQsRUFBU0YsTUFBVCxDQUFiLENBQWI7QUFDRCxPQUZELFNBRVU7QUFDUjs7QUFFQUMsY0FBTVMsS0FBTjtBQUNEO0FBQ0YsS0F2QkQ7O0FBQUEsYUFBc0JDLEtBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsS0FBdEI7QUFBQTtBQXdCRCIsImZpbGUiOiJzaHV0ZG93bi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCBUaW1lciBmcm9tIFwiLi4vdXRpbC90aW1lclwiXG5cbmltcG9ydCB7U2VydmljZVVuYXZhaWxhYmxlfSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2h1dGRvd24oZ3JhY2U6IG51bWJlciA9IDI1KTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiB3cml0ZShuZXh0OiBOZXh0KSB7XG4gICAgKHRoaXM6IENvbnRleHQpXG5cbiAgICAvKiBDYW5jZWwgcmVxdWVzdCBpZiBzZXJ2ZXIgaXMgc3RvcHBpbmcsIGJ1dCBvbmx5IGFmdGVyIGEgZ3JhY2UgcGVyaW9kLlxuICAgICAgIFRoaXMgYWxsb3dzIGEgcmVxdWVzdCB0byBiZSBoYW5kbGVkIGlmIHRoZXJlIGlzIGVub3VnaCB0aW1lLiAqL1xuICAgIGNvbnN0IHRpbWVyID0gbmV3IFRpbWVyKGdyYWNlICogMTAwMClcbiAgICBjb25zdCBzdG9wID0gYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGltZXIuc2xlZXAoKVxuXG4gICAgICBpZiAodGhpcy5yZXF1ZXN0LnNvY2tldC5zZXJ2ZXIuY2xvc2luZykge1xuICAgICAgICB0aHJvdyBuZXcgU2VydmljZVVuYXZhaWxhYmxlKFwiUGxlYXNlIHJldHJ5IHRoZSByZXF1ZXN0XCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pXG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLnJhY2UoW3N0b3AoKSwgbmV4dCgpXSlcbiAgICB9IGZpbmFsbHkge1xuICAgICAgLyogQ2xlYXIgdGltZXIuIEl0IGZyZWVzIHNldFRpbWVvdXQgcmVmZXJlbmNlIHRvIHRoaXMgY29udGV4dCwgcG90ZW50aWFsbHlcbiAgICAgICAgIGNvbnNlcnZpbmcgYSBsb3Qgb2YgbWVtb3J5IGlmIG1vc3QgcmVxdWVzdHMgYXJlIHNob3J0LiAqL1xuICAgICAgdGltZXIuY2xlYXIoKVxuICAgIH1cbiAgfVxufVxuIl19