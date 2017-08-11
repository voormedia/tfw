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


function rescue({ terminationGrace = 25 } = {}) {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      const ctx = this;

      /* Cancel request if server is stopping, but only after a grace period.
         This allows a request to be handled if there is enough time. */
      const timer = new _timer2.default(terminationGrace * 1000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3Jlc2N1ZS5qcyJdLCJuYW1lcyI6WyJyZXNjdWUiLCJ0ZXJtaW5hdGlvbkdyYWNlIiwibmV4dCIsImN0eCIsInRpbWVyIiwic3RvcCIsInNsZWVwIiwicmVxIiwiY2FuY2VsbGVkIiwiUHJvbWlzZSIsInJhY2UiLCJlcnIiLCJkYXRhIiwiZXJyb3IiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJib2R5Iiwic3RhdHVzIiwiY2xlYXIiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWlCd0JBLE07O0FBZnhCOzs7O0FBRUE7Ozs7O0FBSEE7OztBQWdCZSxTQUFTQSxNQUFULENBQWdCLEVBQUNDLG1CQUFtQixFQUFwQixLQUF5QyxFQUF6RCxFQUF5RTtBQUN0RjtBQUFBLGlDQUFPLFdBQXNCQyxJQUF0QixFQUFrQztBQUN2QyxZQUFNQyxNQUFlLElBQXJCOztBQUVBOztBQUVBLFlBQU1DLFFBQVEsb0JBQVVILG1CQUFtQixJQUE3QixDQUFkO0FBQ0EsWUFBTUk7QUFBQSxzQ0FBTyxhQUFZO0FBQ3ZCLGdCQUFNRCxNQUFNRSxLQUFOLEVBQU47O0FBRUEsZ0JBQU1DLE1BQXlCSixJQUFJSSxHQUFuQztBQUNBLGNBQUlBLElBQUlDLFNBQVIsRUFBbUI7QUFDakIsa0JBQU0sK0JBQXVCLDBCQUF2QixDQUFOO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsbUJBQU8sSUFBSUMsT0FBSixDQUFZLFlBQU0sQ0FBRSxDQUFwQixDQUFQO0FBQ0Q7QUFDRixTQVRLOztBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQU47O0FBV0EsVUFBSTtBQUNGLGVBQU8sTUFBTUEsUUFBUUMsSUFBUixDQUFhLENBQUNMLE1BQUQsRUFBU0gsTUFBVCxDQUFiLENBQWI7QUFDRCxPQUZELENBRUUsT0FBT1MsR0FBUCxFQUFZO0FBQ1pSLFlBQUlTLElBQUosQ0FBU0MsS0FBVCxHQUFpQkYsR0FBakI7O0FBRUEsWUFBSSxDQUFDQSxJQUFJRyxNQUFULEVBQWlCO0FBQ2YsY0FBSUMsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLE1BQTdCLEVBQXFDLE1BQU1OLEdBQU47QUFDckNBLGdCQUFNLGlDQUFOO0FBQ0Q7O0FBRURSLFlBQUllLElBQUosR0FBV1AsR0FBWDtBQUNBUixZQUFJZ0IsTUFBSixHQUFhUixJQUFJUSxNQUFqQjtBQUNELE9BWkQsU0FZVTtBQUNSOztBQUVBZixjQUFNZ0IsS0FBTjtBQUNEO0FBQ0YsS0FsQ0Q7O0FBQUEsYUFBc0JwQixNQUF0QjtBQUFBO0FBQUE7O0FBQUEsV0FBc0JBLE1BQXRCO0FBQUE7QUFtQ0QiLCJmaWxlIjoicmVzY3VlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWV4LWFzc2lnbiAqL1xuaW1wb3J0IFRpbWVyIGZyb20gXCIuLi91dGlsL3RpbWVyXCJcblxuaW1wb3J0IHtTZXJ2aWNlVW5hdmFpbGFibGUsIEludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge1JlcXVlc3R9IGZyb20gXCIuLi9jb250ZXh0XCJcblxudHlwZSBDYW5jZWxsaW5nUmVxdWVzdCA9IFJlcXVlc3QgJiB7XG4gIGNhbmNlbGxlZD86IGJvb2xlYW4sXG59XG5cbnR5cGUgUmVzY3VlT3B0aW9ucyA9IHtcbiAgdGVybWluYXRpb25HcmFjZTogbnVtYmVyLFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXNjdWUoe3Rlcm1pbmF0aW9uR3JhY2UgPSAyNX06IFJlc2N1ZU9wdGlvbnMgPSB7fSk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gcmVzY3VlKG5leHQ6IE5leHQpIHtcbiAgICBjb25zdCBjdHg6IENvbnRleHQgPSB0aGlzXG5cbiAgICAvKiBDYW5jZWwgcmVxdWVzdCBpZiBzZXJ2ZXIgaXMgc3RvcHBpbmcsIGJ1dCBvbmx5IGFmdGVyIGEgZ3JhY2UgcGVyaW9kLlxuICAgICAgIFRoaXMgYWxsb3dzIGEgcmVxdWVzdCB0byBiZSBoYW5kbGVkIGlmIHRoZXJlIGlzIGVub3VnaCB0aW1lLiAqL1xuICAgIGNvbnN0IHRpbWVyID0gbmV3IFRpbWVyKHRlcm1pbmF0aW9uR3JhY2UgKiAxMDAwKVxuICAgIGNvbnN0IHN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aW1lci5zbGVlcCgpXG5cbiAgICAgIGNvbnN0IHJlcTogQ2FuY2VsbGluZ1JlcXVlc3QgPSBjdHgucmVxXG4gICAgICBpZiAocmVxLmNhbmNlbGxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgU2VydmljZVVuYXZhaWxhYmxlKFwiUGxlYXNlIHJldHJ5IHRoZSByZXF1ZXN0XCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pXG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBQcm9taXNlLnJhY2UoW3N0b3AoKSwgbmV4dCgpXSlcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGN0eC5kYXRhLmVycm9yID0gZXJyXG5cbiAgICAgIGlmICghZXJyLmV4cG9zZSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiKSB0aHJvdyBlcnJcbiAgICAgICAgZXJyID0gbmV3IEludGVybmFsU2VydmVyRXJyb3JcbiAgICAgIH1cblxuICAgICAgY3R4LmJvZHkgPSBlcnJcbiAgICAgIGN0eC5zdGF0dXMgPSBlcnIuc3RhdHVzXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8qIENsZWFyIHRpbWVyLiBJdCBmcmVlcyBzZXRUaW1lb3V0IHJlZmVyZW5jZSB0byB0aGlzIGNvbnRleHQsIHBvdGVudGlhbGx5XG4gICAgICAgICBjb25zZXJ2aW5nIGEgbG90IG9mIG1lbW9yeSBpZiBtb3N0IHJlcXVlc3RzIGFyZSBzaG9ydC4gKi9cbiAgICAgIHRpbWVyLmNsZWFyKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==