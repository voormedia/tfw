"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = write;

var _stream = require("stream");

var _errors = require("../errors");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */


function write() {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      var _this = this;

      this;

      try {
        yield next();
      } catch (err) {
        // ES7 this::error(err)
        return error.call(this, err);
      }

      Object.freeze(this);

      if (this.sent) return;

      if (this.body === null) {
        this.response.end();
      } else if (this.body instanceof Buffer) {
        this.response.end(this.body);
      } else if (this.body instanceof _stream.Readable) {
        this.body.on("error", function (err) {
          _this.body.unpipe();

          // ES7 this::error(err)
          return error.call(_this, err);
        });

        this.body.pipe(this.response);
      } else if (typeof this.body === "string") {
        this.response.end(this.body, "utf8");
      } else {
        /* Treat as JSON. */
        this.set("Content-Type", "application/json");
        this.response.end(JSON.stringify(this.body), "utf8");
      }
    });

    function write(_x) {
      return _ref.apply(this, arguments);
    }

    return write;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsImVyciIsImVycm9yIiwiY2FsbCIsIk9iamVjdCIsImZyZWV6ZSIsInNlbnQiLCJib2R5IiwicmVzcG9uc2UiLCJlbmQiLCJCdWZmZXIiLCJvbiIsInVucGlwZSIsInBpcGUiLCJzZXQiLCJKU09OIiwic3RyaW5naWZ5IiwiZGF0YSIsImV4cG9zZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsImZpbmlzaGVkIiwic3RhdHVzIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFTd0JBLEs7O0FBTnhCOztBQUVBOzs7QUFKQTtBQUNBOzs7QUFPZSxTQUFTQSxLQUFULEdBQTZCO0FBQzFDO0FBQUEsaUNBQU8sV0FBcUJDLElBQXJCLEVBQWlDO0FBQUE7O0FBQ3JDLFVBQUQ7O0FBRUEsVUFBSTtBQUNGLGNBQU1BLE1BQU47QUFDRCxPQUZELENBRUUsT0FBT0MsR0FBUCxFQUFZO0FBQ1o7QUFDQSxlQUFPQyxNQUFNQyxJQUFOLENBQVcsSUFBWCxFQUFpQkYsR0FBakIsQ0FBUDtBQUNEOztBQUVERyxhQUFPQyxNQUFQLENBQWMsSUFBZDs7QUFFQSxVQUFJLEtBQUtDLElBQVQsRUFBZTs7QUFFZixVQUFJLEtBQUtDLElBQUwsS0FBYyxJQUFsQixFQUF3QjtBQUN0QixhQUFLQyxRQUFMLENBQWNDLEdBQWQ7QUFDRCxPQUZELE1BRU8sSUFBSSxLQUFLRixJQUFMLFlBQXFCRyxNQUF6QixFQUFpQztBQUN0QyxhQUFLRixRQUFMLENBQWNDLEdBQWQsQ0FBa0IsS0FBS0YsSUFBdkI7QUFDRCxPQUZNLE1BRUEsSUFBSSxLQUFLQSxJQUFMLDRCQUFKLEVBQW1DO0FBQ3hDLGFBQUtBLElBQUwsQ0FBVUksRUFBVixDQUFhLE9BQWIsRUFBc0IsZUFBTztBQUMzQixnQkFBS0osSUFBTCxDQUFVSyxNQUFWOztBQUVBO0FBQ0EsaUJBQU9WLE1BQU1DLElBQU4sUUFBaUJGLEdBQWpCLENBQVA7QUFDRCxTQUxEOztBQU9BLGFBQUtNLElBQUwsQ0FBVU0sSUFBVixDQUFlLEtBQUtMLFFBQXBCO0FBQ0QsT0FUTSxNQVNBLElBQUksT0FBTyxLQUFLRCxJQUFaLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ3hDLGFBQUtDLFFBQUwsQ0FBY0MsR0FBZCxDQUFrQixLQUFLRixJQUF2QixFQUE2QixNQUE3QjtBQUNELE9BRk0sTUFFQTtBQUNMO0FBQ0EsYUFBS08sR0FBTCxDQUFTLGNBQVQsRUFBeUIsa0JBQXpCO0FBQ0EsYUFBS04sUUFBTCxDQUFjQyxHQUFkLENBQWtCTSxLQUFLQyxTQUFMLENBQWUsS0FBS1QsSUFBcEIsQ0FBbEIsRUFBNkMsTUFBN0M7QUFDRDtBQUNGLEtBbENEOztBQUFBLGFBQXNCUixLQUF0QjtBQUFBO0FBQUE7O0FBQUEsV0FBc0JBLEtBQXRCO0FBQUE7QUFtQ0Q7O0FBRUQsU0FBU0csS0FBVCxDQUFlRCxHQUFmLEVBQTJCO0FBQ3hCLE1BQUQ7O0FBRUEsT0FBS2dCLElBQUwsQ0FBVWYsS0FBVixHQUFrQkQsR0FBbEI7O0FBRUEsTUFBSSxDQUFDQSxJQUFJaUIsTUFBVCxFQUFpQjtBQUNmLFFBQUlDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixNQUE3QixFQUFxQyxNQUFNcEIsR0FBTjtBQUNyQ0EsVUFBTSxpQ0FBTjtBQUNEOztBQUVELE1BQUksS0FBS0ssSUFBVCxFQUFlO0FBQ2IsUUFBSSxDQUFDLEtBQUtnQixRQUFWLEVBQW9CLEtBQUtkLFFBQUwsQ0FBY0MsR0FBZDtBQUNwQjtBQUNEOztBQUVELE9BQUtLLEdBQUwsQ0FBUyxjQUFULEVBQXlCLGtCQUF6Qjs7QUFFQSxPQUFLUyxNQUFMLEdBQWN0QixJQUFJc0IsTUFBSixJQUFjLEdBQTVCO0FBQ0EsT0FBS2YsUUFBTCxDQUFjQyxHQUFkLENBQWtCTSxLQUFLQyxTQUFMLENBQWVmLEdBQWYsQ0FBbEIsRUFBdUMsTUFBdkM7QUFDRCIsImZpbGUiOiJ3cml0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB7UmVhZGFibGV9IGZyb20gXCJzdHJlYW1cIlxuXG5pbXBvcnQge0ludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3cml0ZSgpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHdyaXRlKG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIEVTNyB0aGlzOjplcnJvcihlcnIpXG4gICAgICByZXR1cm4gZXJyb3IuY2FsbCh0aGlzLCBlcnIpXG4gICAgfVxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuXG4gICAgaWYgKHRoaXMuc2VudCkgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5ib2R5ID09PSBudWxsKSB7XG4gICAgICB0aGlzLnJlc3BvbnNlLmVuZCgpXG4gICAgfSBlbHNlIGlmICh0aGlzLmJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAgIHRoaXMucmVzcG9uc2UuZW5kKHRoaXMuYm9keSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm9keSBpbnN0YW5jZW9mIFJlYWRhYmxlKSB7XG4gICAgICB0aGlzLmJvZHkub24oXCJlcnJvclwiLCBlcnIgPT4ge1xuICAgICAgICB0aGlzLmJvZHkudW5waXBlKClcblxuICAgICAgICAvLyBFUzcgdGhpczo6ZXJyb3IoZXJyKVxuICAgICAgICByZXR1cm4gZXJyb3IuY2FsbCh0aGlzLCBlcnIpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmJvZHkucGlwZSh0aGlzLnJlc3BvbnNlKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuYm9keSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdGhpcy5yZXNwb25zZS5lbmQodGhpcy5ib2R5LCBcInV0ZjhcIilcbiAgICB9IGVsc2Uge1xuICAgICAgLyogVHJlYXQgYXMgSlNPTi4gKi9cbiAgICAgIHRoaXMuc2V0KFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKVxuICAgICAgdGhpcy5yZXNwb25zZS5lbmQoSlNPTi5zdHJpbmdpZnkodGhpcy5ib2R5KSwgXCJ1dGY4XCIpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yKGVycjogRXJyb3IpIHtcbiAgKHRoaXM6IENvbnRleHQpXG5cbiAgdGhpcy5kYXRhLmVycm9yID0gZXJyXG5cbiAgaWYgKCFlcnIuZXhwb3NlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIikgdGhyb3cgZXJyXG4gICAgZXJyID0gbmV3IEludGVybmFsU2VydmVyRXJyb3JcbiAgfVxuXG4gIGlmICh0aGlzLnNlbnQpIHtcbiAgICBpZiAoIXRoaXMuZmluaXNoZWQpIHRoaXMucmVzcG9uc2UuZW5kKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIHRoaXMuc2V0KFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKVxuXG4gIHRoaXMuc3RhdHVzID0gZXJyLnN0YXR1cyB8fCA1MDBcbiAgdGhpcy5yZXNwb25zZS5lbmQoSlNPTi5zdHJpbmdpZnkoZXJyKSwgXCJ1dGY4XCIpXG59XG4iXX0=