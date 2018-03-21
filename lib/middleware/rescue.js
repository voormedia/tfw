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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3Jlc2N1ZS5qcyJdLCJuYW1lcyI6WyJyZXNjdWUiLCJuZXh0IiwicmVzcG9uc2UiLCJvbiIsInN0cmVhbSIsImVyciIsInVucGlwZSIsImVycm9yIiwiY2FsbCIsImRhdGEiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzZW50IiwiZmluaXNoZWQiLCJlbmQiLCJzZXQiLCJzdGF0dXMiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7OztrQkFNd0JBLE07O0FBSnhCOztBQUllLFNBQVNBLE1BQVQsR0FBOEI7QUFDM0MsU0FBTyxlQUFlQSxNQUFmLENBQXNCQyxJQUF0QixFQUFrQztBQUN0QyxRQUFEOztBQUVBLFNBQUtDLFFBQUwsQ0FBY0MsRUFBZCxDQUFpQixNQUFqQixFQUF5QkMsVUFBVTtBQUNqQ0EsYUFBT0QsRUFBUCxDQUFVLE9BQVYsRUFBbUJFLE9BQU87QUFDeEJELGVBQU9FLE1BQVA7O0FBRUE7QUFDQUMsY0FBTUMsSUFBTixDQUFXLElBQVgsRUFBaUJILEdBQWpCO0FBQ0QsT0FMRDtBQU1ELEtBUEQ7O0FBU0EsUUFBSTtBQUNGLFlBQU1KLE1BQU47QUFDRCxLQUZELENBRUUsT0FBT0ksR0FBUCxFQUFZO0FBQ1o7QUFDQSxhQUFPRSxNQUFNQyxJQUFOLENBQVcsSUFBWCxFQUFpQkgsR0FBakIsQ0FBUDtBQUNEO0FBQ0YsR0FsQkQ7QUFtQkQ7QUF6QkQ7OztBQTJCQSxTQUFTRSxLQUFULENBQWVGLEdBQWYsRUFBMkI7QUFDeEIsTUFBRDs7QUFFQSxPQUFLSSxJQUFMLENBQVVGLEtBQVYsR0FBa0JGLEdBQWxCOztBQUVBLE1BQUksQ0FBRUEsR0FBRCxDQUFXSyxNQUFoQixFQUF3QjtBQUN0QixRQUFJQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsTUFBN0IsRUFBcUMsTUFBTVIsR0FBTjtBQUNyQ0EsVUFBTSxpQ0FBTjtBQUNEOztBQUVELE1BQUksS0FBS1MsSUFBVCxFQUFlO0FBQ2IsUUFBSSxDQUFDLEtBQUtDLFFBQVYsRUFBb0IsS0FBS2IsUUFBTCxDQUFjYyxHQUFkO0FBQ3BCO0FBQ0Q7O0FBRUQsT0FBS0MsR0FBTCxDQUFTLGNBQVQsRUFBeUIsa0JBQXpCOztBQUVBLE9BQUtDLE1BQUwsR0FBZWIsR0FBRCxDQUFXYSxNQUFYLElBQXFCLEdBQW5DO0FBQ0EsT0FBS2hCLFFBQUwsQ0FBY2MsR0FBZCxDQUFrQkcsS0FBS0MsU0FBTCxDQUFlZixHQUFmLENBQWxCLEVBQXVDLE1BQXZDO0FBQ0QiLCJmaWxlIjoicmVzY3VlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IHtJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzY3VlKCk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gcmVzY3VlKG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIHRoaXMucmVzcG9uc2Uub24oXCJwaXBlXCIsIHN0cmVhbSA9PiB7XG4gICAgICBzdHJlYW0ub24oXCJlcnJvclwiLCBlcnIgPT4ge1xuICAgICAgICBzdHJlYW0udW5waXBlKClcblxuICAgICAgICAvLyBFUzcgdGhpczo6ZXJyb3IoZXJyKVxuICAgICAgICBlcnJvci5jYWxsKHRoaXMsIGVycilcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIEVTNyB0aGlzOjplcnJvcihlcnIpXG4gICAgICByZXR1cm4gZXJyb3IuY2FsbCh0aGlzLCBlcnIpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yKGVycjogRXJyb3IpIHtcbiAgKHRoaXM6IENvbnRleHQpXG5cbiAgdGhpcy5kYXRhLmVycm9yID0gZXJyXG5cbiAgaWYgKCEoZXJyOiBhbnkpLmV4cG9zZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJ0ZXN0XCIpIHRocm93IGVyclxuICAgIGVyciA9IG5ldyBJbnRlcm5hbFNlcnZlckVycm9yXG4gIH1cblxuICBpZiAodGhpcy5zZW50KSB7XG4gICAgaWYgKCF0aGlzLmZpbmlzaGVkKSB0aGlzLnJlc3BvbnNlLmVuZCgpXG4gICAgcmV0dXJuXG4gIH1cblxuICB0aGlzLnNldChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIilcblxuICB0aGlzLnN0YXR1cyA9IChlcnI6IGFueSkuc3RhdHVzIHx8IDUwMFxuICB0aGlzLnJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeShlcnIpLCBcInV0ZjhcIilcbn1cbiJdfQ==