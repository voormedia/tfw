"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rescue;

var _errors = require("../errors");

function rescue() {
  return async function rescue(next) {
    this;

    this.response.on("pipe", stream => {
      stream.on("error", err => {
        stream.unpipe();

        // ES7 this::error(err)
        error.call(this, err);
      });
    });

    try {
      await next();
    } catch (err) {
      // ES7 this::error(err)
      return error.call(this, err);
    }
  };
}
/* eslint-disable no-unused-expressions */


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3Jlc2N1ZS5qcyJdLCJuYW1lcyI6WyJyZXNjdWUiLCJuZXh0IiwicmVzcG9uc2UiLCJvbiIsInN0cmVhbSIsImVyciIsInVucGlwZSIsImVycm9yIiwiY2FsbCIsImRhdGEiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzZW50IiwiZmluaXNoZWQiLCJlbmQiLCJzZXQiLCJzdGF0dXMiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7OztrQkFNd0JBLE07O0FBSnhCOztBQUllLFNBQVNBLE1BQVQsR0FBOEI7QUFDM0MsU0FBTyxlQUFlQSxNQUFmLENBQXNCQyxJQUF0QixFQUFrQztBQUN0QyxRQUFEOztBQUVBLFNBQUtDLFFBQUwsQ0FBY0MsRUFBZCxDQUFpQixNQUFqQixFQUF5QkMsVUFBVTtBQUNqQ0EsYUFBT0QsRUFBUCxDQUFVLE9BQVYsRUFBbUJFLE9BQU87QUFDeEJELGVBQU9FLE1BQVA7O0FBRUE7QUFDQUMsY0FBTUMsSUFBTixDQUFXLElBQVgsRUFBaUJILEdBQWpCO0FBQ0QsT0FMRDtBQU1ELEtBUEQ7O0FBU0EsUUFBSTtBQUNGLFlBQU1KLE1BQU47QUFDRCxLQUZELENBRUUsT0FBT0ksR0FBUCxFQUFZO0FBQ1o7QUFDQSxhQUFPRSxNQUFNQyxJQUFOLENBQVcsSUFBWCxFQUFpQkgsR0FBakIsQ0FBUDtBQUNEO0FBQ0YsR0FsQkQ7QUFtQkQ7QUF6QkQ7OztBQTJCQSxTQUFTRSxLQUFULENBQWVGLEdBQWYsRUFBMkI7QUFDeEIsTUFBRDs7QUFFQSxPQUFLSSxJQUFMLENBQVVGLEtBQVYsR0FBa0JGLEdBQWxCOztBQUVBLE1BQUksQ0FBQ0EsSUFBSUssTUFBVCxFQUFpQjtBQUNmLFFBQUlDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixNQUE3QixFQUFxQyxNQUFNUixHQUFOO0FBQ3JDQSxVQUFNLGlDQUFOO0FBQ0Q7O0FBRUQsTUFBSSxLQUFLUyxJQUFULEVBQWU7QUFDYixRQUFJLENBQUMsS0FBS0MsUUFBVixFQUFvQixLQUFLYixRQUFMLENBQWNjLEdBQWQ7QUFDcEI7QUFDRDs7QUFFRCxPQUFLQyxHQUFMLENBQVMsY0FBVCxFQUF5QixrQkFBekI7O0FBRUEsT0FBS0MsTUFBTCxHQUFjYixJQUFJYSxNQUFKLElBQWMsR0FBNUI7QUFDQSxPQUFLaEIsUUFBTCxDQUFjYyxHQUFkLENBQWtCRyxLQUFLQyxTQUFMLENBQWVmLEdBQWYsQ0FBbEIsRUFBdUMsTUFBdkM7QUFDRCIsImZpbGUiOiJyZXNjdWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQge0ludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXNjdWUoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiByZXNjdWUobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgdGhpcy5yZXNwb25zZS5vbihcInBpcGVcIiwgc3RyZWFtID0+IHtcbiAgICAgIHN0cmVhbS5vbihcImVycm9yXCIsIGVyciA9PiB7XG4gICAgICAgIHN0cmVhbS51bnBpcGUoKVxuXG4gICAgICAgIC8vIEVTNyB0aGlzOjplcnJvcihlcnIpXG4gICAgICAgIGVycm9yLmNhbGwodGhpcywgZXJyKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5leHQoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gRVM3IHRoaXM6OmVycm9yKGVycilcbiAgICAgIHJldHVybiBlcnJvci5jYWxsKHRoaXMsIGVycilcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3IoZXJyOiBFcnJvcikge1xuICAodGhpczogQ29udGV4dClcblxuICB0aGlzLmRhdGEuZXJyb3IgPSBlcnJcblxuICBpZiAoIWVyci5leHBvc2UpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiKSB0aHJvdyBlcnJcbiAgICBlcnIgPSBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvclxuICB9XG5cbiAgaWYgKHRoaXMuc2VudCkge1xuICAgIGlmICghdGhpcy5maW5pc2hlZCkgdGhpcy5yZXNwb25zZS5lbmQoKVxuICAgIHJldHVyblxuICB9XG5cbiAgdGhpcy5zZXQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG5cbiAgdGhpcy5zdGF0dXMgPSBlcnIuc3RhdHVzIHx8IDUwMFxuICB0aGlzLnJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShlcnIpLCBcInV0ZjhcIilcbn1cbiJdfQ==