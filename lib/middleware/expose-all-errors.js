"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exposeAllErrors;

var _errors = require("../errors");

/* eslint-disable no-unused-expressions */
function exposeAllErrors() {
  return async function exposeAllErrors(next) {
    this;

    try {
      await next();
    } catch (err) {
      if (err instanceof Error) {
        /* Add specific JSON serialization to the error and make it exposable. */
        if (!err.toJSON) err.toJSON = toJSON;
        err.expose = true;
        throw err;
      } else {
        /* Wrap anything that's not an Error but that pretends to be one. */
        throw new _errors.InternalServerError(err.message || err.Message || err);
      }
    }
  };
}

const { error } = new _errors.InternalServerError();
function toJSON() {
  this;

  /* TODO: Include stack? {stack: this.stack.split(/\n\s+/)} */
  return { error, message: this.message };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2V4cG9zZS1hbGwtZXJyb3JzLmpzIl0sIm5hbWVzIjpbImV4cG9zZUFsbEVycm9ycyIsIm5leHQiLCJlcnIiLCJFcnJvciIsInRvSlNPTiIsImV4cG9zZSIsIkludGVybmFsU2VydmVyRXJyb3IiLCJtZXNzYWdlIiwiTWVzc2FnZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFNd0JBLGU7O0FBRnhCOztBQUhBO0FBS2UsU0FBU0EsZUFBVCxHQUF1QztBQUNwRCxTQUFPLGVBQWVBLGVBQWYsQ0FBK0JDLElBQS9CLEVBQTJDO0FBQy9DLFFBQUQ7O0FBRUEsUUFBSTtBQUNGLFlBQU1BLE1BQU47QUFDRCxLQUZELENBRUUsT0FBT0MsR0FBUCxFQUFZO0FBQ1osVUFBSUEsZUFBZUMsS0FBbkIsRUFBMEI7QUFDeEI7QUFDQSxZQUFJLENBQUNELElBQUlFLE1BQVQsRUFBaUJGLElBQUlFLE1BQUosR0FBYUEsTUFBYjtBQUNqQkYsWUFBSUcsTUFBSixHQUFhLElBQWI7QUFDQSxjQUFNSCxHQUFOO0FBQ0QsT0FMRCxNQUtPO0FBQ0w7QUFDQSxjQUFNLElBQUlJLDJCQUFKLENBQXdCSixJQUFJSyxPQUFKLElBQWVMLElBQUlNLE9BQW5CLElBQThCTixHQUF0RCxDQUFOO0FBQ0Q7QUFDRjtBQUNGLEdBaEJEO0FBaUJEOztBQUVELE1BQU0sRUFBQ08sS0FBRCxLQUFVLElBQUlILDJCQUFKLEVBQWhCO0FBQ0EsU0FBU0YsTUFBVCxHQUFrQjtBQUNmLE1BQUQ7O0FBRUE7QUFDQSxTQUFPLEVBQUNLLEtBQUQsRUFBUUYsU0FBUyxLQUFLQSxPQUF0QixFQUFQO0FBQ0QiLCJmaWxlIjoiZXhwb3NlLWFsbC1lcnJvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5pbXBvcnQge0ludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHBvc2VBbGxFcnJvcnMoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBleHBvc2VBbGxFcnJvcnMobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5leHQoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIC8qIEFkZCBzcGVjaWZpYyBKU09OIHNlcmlhbGl6YXRpb24gdG8gdGhlIGVycm9yIGFuZCBtYWtlIGl0IGV4cG9zYWJsZS4gKi9cbiAgICAgICAgaWYgKCFlcnIudG9KU09OKSBlcnIudG9KU09OID0gdG9KU09OXG4gICAgICAgIGVyci5leHBvc2UgPSB0cnVlXG4gICAgICAgIHRocm93IGVyclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyogV3JhcCBhbnl0aGluZyB0aGF0J3Mgbm90IGFuIEVycm9yIGJ1dCB0aGF0IHByZXRlbmRzIHRvIGJlIG9uZS4gKi9cbiAgICAgICAgdGhyb3cgbmV3IEludGVybmFsU2VydmVyRXJyb3IoZXJyLm1lc3NhZ2UgfHwgZXJyLk1lc3NhZ2UgfHwgZXJyKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCB7ZXJyb3J9ID0gbmV3IEludGVybmFsU2VydmVyRXJyb3IoKVxuZnVuY3Rpb24gdG9KU09OKCkge1xuICAodGhpczogRXJyb3IpXG5cbiAgLyogVE9ETzogSW5jbHVkZSBzdGFjaz8ge3N0YWNrOiB0aGlzLnN0YWNrLnNwbGl0KC9cXG5cXHMrLyl9ICovXG4gIHJldHVybiB7ZXJyb3IsIG1lc3NhZ2U6IHRoaXMubWVzc2FnZX1cbn1cbiJdfQ==