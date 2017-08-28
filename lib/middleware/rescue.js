"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rescue;

var _errors = require("../errors");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-unused-expressions */


function rescue() {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      var _this = this;

      this;

      this.response.on("pipe", function (stream) {
        stream.on("error", function (err) {
          stream.unpipe();

          // ES7 this::error(err)
          error.call(_this, err);
        });
      });

      try {
        yield next();
      } catch (err) {
        // ES7 this::error(err)
        return error.call(this, err);
      }
    });

    function rescue(_x) {
      return _ref.apply(this, arguments);
    }

    return rescue;
  })();
}

function error(err) {
  this;

  this.data.error = err;

  if (!err.expose) {
    if (process.env.NODE_ENV === "test") throw err;
    err = new _errors.InternalServerError();
  }

  if (this.sent) {
    if (!this.finished) this.response.end();
    return;
  }

  this.set("Content-Type", "application/json");

  this.status = err.status || 500;
  this.response.end(JSON.stringify(err), "utf8");
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3Jlc2N1ZS5qcyJdLCJuYW1lcyI6WyJyZXNjdWUiLCJuZXh0IiwicmVzcG9uc2UiLCJvbiIsInN0cmVhbSIsInVucGlwZSIsImVycm9yIiwiY2FsbCIsImVyciIsImRhdGEiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzZW50IiwiZmluaXNoZWQiLCJlbmQiLCJzZXQiLCJzdGF0dXMiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7OztrQkFNd0JBLE07O0FBSnhCOzs7QUFEQTs7O0FBS2UsU0FBU0EsTUFBVCxHQUE4QjtBQUMzQztBQUFBLGlDQUFPLFdBQXNCQyxJQUF0QixFQUFrQztBQUFBOztBQUN0QyxVQUFEOztBQUVBLFdBQUtDLFFBQUwsQ0FBY0MsRUFBZCxDQUFpQixNQUFqQixFQUF5QixrQkFBVTtBQUNqQ0MsZUFBT0QsRUFBUCxDQUFVLE9BQVYsRUFBbUIsZUFBTztBQUN4QkMsaUJBQU9DLE1BQVA7O0FBRUE7QUFDQUMsZ0JBQU1DLElBQU4sUUFBaUJDLEdBQWpCO0FBQ0QsU0FMRDtBQU1ELE9BUEQ7O0FBU0EsVUFBSTtBQUNGLGNBQU1QLE1BQU47QUFDRCxPQUZELENBRUUsT0FBT08sR0FBUCxFQUFZO0FBQ1o7QUFDQSxlQUFPRixNQUFNQyxJQUFOLENBQVcsSUFBWCxFQUFpQkMsR0FBakIsQ0FBUDtBQUNEO0FBQ0YsS0FsQkQ7O0FBQUEsYUFBc0JSLE1BQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsTUFBdEI7QUFBQTtBQW1CRDs7QUFFRCxTQUFTTSxLQUFULENBQWVFLEdBQWYsRUFBMkI7QUFDeEIsTUFBRDs7QUFFQSxPQUFLQyxJQUFMLENBQVVILEtBQVYsR0FBa0JFLEdBQWxCOztBQUVBLE1BQUksQ0FBQ0EsSUFBSUUsTUFBVCxFQUFpQjtBQUNmLFFBQUlDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixNQUE3QixFQUFxQyxNQUFNTCxHQUFOO0FBQ3JDQSxVQUFNLGlDQUFOO0FBQ0Q7O0FBRUQsTUFBSSxLQUFLTSxJQUFULEVBQWU7QUFDYixRQUFJLENBQUMsS0FBS0MsUUFBVixFQUFvQixLQUFLYixRQUFMLENBQWNjLEdBQWQ7QUFDcEI7QUFDRDs7QUFFRCxPQUFLQyxHQUFMLENBQVMsY0FBVCxFQUF5QixrQkFBekI7O0FBRUEsT0FBS0MsTUFBTCxHQUFjVixJQUFJVSxNQUFKLElBQWMsR0FBNUI7QUFDQSxPQUFLaEIsUUFBTCxDQUFjYyxHQUFkLENBQWtCRyxLQUFLQyxTQUFMLENBQWVaLEdBQWYsQ0FBbEIsRUFBdUMsTUFBdkM7QUFDRCIsImZpbGUiOiJyZXNjdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQge0ludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXNjdWUoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiByZXNjdWUobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgdGhpcy5yZXNwb25zZS5vbihcInBpcGVcIiwgc3RyZWFtID0+IHtcbiAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVyciA9PiB7XG4gICAgICAgIHN0cmVhbS51bnBpcGUoKVxuXG4gICAgICAgIC8vIEVTNyB0aGlzOjplcnJvcihlcnIpXG4gICAgICAgIGVycm9yLmNhbGwodGhpcywgZXJyKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5leHQoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gRVM3IHRoaXM6OmVycm9yKGVycilcbiAgICAgIHJldHVybiBlcnJvci5jYWxsKHRoaXMsIGVycilcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3IoZXJyOiBFcnJvcikge1xuICAodGhpczogQ29udGV4dClcblxuICB0aGlzLmRhdGEuZXJyb3IgPSBlcnJcblxuICBpZiAoIWVyci5leHBvc2UpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiKSB0aHJvdyBlcnJcbiAgICBlcnIgPSBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvclxuICB9XG5cbiAgaWYgKHRoaXMuc2VudCkge1xuICAgIGlmICghdGhpcy5maW5pc2hlZCkgdGhpcy5yZXNwb25zZS5lbmQoKVxuICAgIHJldHVyblxuICB9XG5cbiAgdGhpcy5zZXQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG5cbiAgdGhpcy5zdGF0dXMgPSBlcnIuc3RhdHVzIHx8IDUwMFxuICB0aGlzLnJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShlcnIpLCBcInV0ZjhcIilcbn1cbiJdfQ==