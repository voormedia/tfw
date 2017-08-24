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

      this.response.on("pipe", function (stream) {
        _this.body = stream;

        stream.on("error", function (err) {
          stream.unpipe();

          // ES7 this::error(err)
          error.call(_this, err);

          // ES7 this::send()
          send.call(_this);

          _this.response.end();
        });
      });

      try {
        yield next();
      } catch (err) {
        // ES7 this::error(err)
        error.call(this, err);
      }

      // ES7 this::send()
      send.call(this);
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

  this.body = err;
  this.status = err.status || 500;
}

function send() {
  this;

  if (this.sent) return;

  if (this.body === null) {
    this.body = Buffer.alloc(0);
  } else if (this.body instanceof Buffer) {
    /* Use as is. */
  } else if (this.body instanceof _stream.Readable) {
    this.body.pipe(this.response);
    return;
  } else if (typeof this.body === "string") {
    this.body = Buffer.from(this.body, "utf8");
  } else {
    /* Treat as JSON. */
    this.set("content-type", "application/json");
    this.body = Buffer.from(JSON.stringify(this.body), "utf8");
  }

  this.set("content-length", Buffer.byteLength(this.body));
  this.response.end(this.body);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsInJlc3BvbnNlIiwib24iLCJib2R5Iiwic3RyZWFtIiwidW5waXBlIiwiZXJyb3IiLCJjYWxsIiwiZXJyIiwic2VuZCIsImVuZCIsImRhdGEiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzdGF0dXMiLCJzZW50IiwiQnVmZmVyIiwiYWxsb2MiLCJwaXBlIiwiZnJvbSIsInNldCIsIkpTT04iLCJzdHJpbmdpZnkiLCJieXRlTGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFTd0JBLEs7O0FBTnhCOztBQUVBOzs7QUFKQTtBQUNBOzs7QUFPZSxTQUFTQSxLQUFULEdBQTZCO0FBQzFDO0FBQUEsaUNBQU8sV0FBcUJDLElBQXJCLEVBQWlDO0FBQUE7O0FBQ3JDLFVBQUQ7O0FBRUEsV0FBS0MsUUFBTCxDQUFjQyxFQUFkLENBQWlCLE1BQWpCLEVBQXlCLGtCQUFVO0FBQ2pDLGNBQUtDLElBQUwsR0FBWUMsTUFBWjs7QUFFQUEsZUFBT0YsRUFBUCxDQUFVLE9BQVYsRUFBbUIsZUFBTztBQUN4QkUsaUJBQU9DLE1BQVA7O0FBRUE7QUFDQUMsZ0JBQU1DLElBQU4sUUFBaUJDLEdBQWpCOztBQUVBO0FBQ0FDLGVBQUtGLElBQUw7O0FBRUEsZ0JBQUtOLFFBQUwsQ0FBY1MsR0FBZDtBQUNELFNBVkQ7QUFXRCxPQWREOztBQWdCQSxVQUFJO0FBQ0YsY0FBTVYsTUFBTjtBQUNELE9BRkQsQ0FFRSxPQUFPUSxHQUFQLEVBQVk7QUFDWjtBQUNBRixjQUFNQyxJQUFOLENBQVcsSUFBWCxFQUFpQkMsR0FBakI7QUFDRDs7QUFFRDtBQUNBQyxXQUFLRixJQUFMLENBQVUsSUFBVjtBQUNELEtBNUJEOztBQUFBLGFBQXNCUixLQUF0QjtBQUFBO0FBQUE7O0FBQUEsV0FBc0JBLEtBQXRCO0FBQUE7QUE2QkQ7O0FBRUQsU0FBU08sS0FBVCxDQUFlRSxHQUFmLEVBQTJCO0FBQ3hCLE1BQUQ7O0FBRUEsT0FBS0csSUFBTCxDQUFVTCxLQUFWLEdBQWtCRSxHQUFsQjs7QUFFQSxNQUFJLENBQUNBLElBQUlJLE1BQVQsRUFBaUI7QUFDZixRQUFJQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsTUFBN0IsRUFBcUMsTUFBTVAsR0FBTjtBQUNyQ0EsVUFBTSxpQ0FBTjtBQUNEOztBQUVELE9BQUtMLElBQUwsR0FBWUssR0FBWjtBQUNBLE9BQUtRLE1BQUwsR0FBY1IsSUFBSVEsTUFBSixJQUFjLEdBQTVCO0FBQ0Q7O0FBRUQsU0FBU1AsSUFBVCxHQUFnQjtBQUNiLE1BQUQ7O0FBRUEsTUFBSSxLQUFLUSxJQUFULEVBQWU7O0FBRWYsTUFBSSxLQUFLZCxJQUFMLEtBQWMsSUFBbEIsRUFBd0I7QUFDdEIsU0FBS0EsSUFBTCxHQUFZZSxPQUFPQyxLQUFQLENBQWEsQ0FBYixDQUFaO0FBQ0QsR0FGRCxNQUVPLElBQUksS0FBS2hCLElBQUwsWUFBcUJlLE1BQXpCLEVBQWlDO0FBQ3RDO0FBQ0QsR0FGTSxNQUVBLElBQUksS0FBS2YsSUFBTCw0QkFBSixFQUFtQztBQUN4QyxTQUFLQSxJQUFMLENBQVVpQixJQUFWLENBQWUsS0FBS25CLFFBQXBCO0FBQ0E7QUFDRCxHQUhNLE1BR0EsSUFBSSxPQUFPLEtBQUtFLElBQVosS0FBcUIsUUFBekIsRUFBbUM7QUFDeEMsU0FBS0EsSUFBTCxHQUFZZSxPQUFPRyxJQUFQLENBQVksS0FBS2xCLElBQWpCLEVBQXVCLE1BQXZCLENBQVo7QUFDRCxHQUZNLE1BRUE7QUFDTDtBQUNBLFNBQUttQixHQUFMLENBQVMsY0FBVCxFQUF5QixrQkFBekI7QUFDQSxTQUFLbkIsSUFBTCxHQUFZZSxPQUFPRyxJQUFQLENBQVlFLEtBQUtDLFNBQUwsQ0FBZSxLQUFLckIsSUFBcEIsQ0FBWixFQUF1QyxNQUF2QyxDQUFaO0FBQ0Q7O0FBRUQsT0FBS21CLEdBQUwsQ0FBUyxnQkFBVCxFQUEyQkosT0FBT08sVUFBUCxDQUFrQixLQUFLdEIsSUFBdkIsQ0FBM0I7QUFDQSxPQUFLRixRQUFMLENBQWNTLEdBQWQsQ0FBa0IsS0FBS1AsSUFBdkI7QUFDRCIsImZpbGUiOiJ3cml0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB7UmVhZGFibGV9IGZyb20gXCJzdHJlYW1cIlxuXG5pbXBvcnQge0ludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3cml0ZSgpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHdyaXRlKG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIHRoaXMucmVzcG9uc2Uub24oXCJwaXBlXCIsIHN0cmVhbSA9PiB7XG4gICAgICB0aGlzLmJvZHkgPSBzdHJlYW1cblxuICAgICAgc3RyZWFtLm9uKFwiZXJyb3JcIiwgZXJyID0+IHtcbiAgICAgICAgc3RyZWFtLnVucGlwZSgpXG5cbiAgICAgICAgLy8gRVM3IHRoaXM6OmVycm9yKGVycilcbiAgICAgICAgZXJyb3IuY2FsbCh0aGlzLCBlcnIpXG5cbiAgICAgICAgLy8gRVM3IHRoaXM6OnNlbmQoKVxuICAgICAgICBzZW5kLmNhbGwodGhpcylcblxuICAgICAgICB0aGlzLnJlc3BvbnNlLmVuZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmV4dCgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBFUzcgdGhpczo6ZXJyb3IoZXJyKVxuICAgICAgZXJyb3IuY2FsbCh0aGlzLCBlcnIpXG4gICAgfVxuXG4gICAgLy8gRVM3IHRoaXM6OnNlbmQoKVxuICAgIHNlbmQuY2FsbCh0aGlzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yKGVycjogRXJyb3IpIHtcbiAgKHRoaXM6IENvbnRleHQpXG5cbiAgdGhpcy5kYXRhLmVycm9yID0gZXJyXG5cbiAgaWYgKCFlcnIuZXhwb3NlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIikgdGhyb3cgZXJyXG4gICAgZXJyID0gbmV3IEludGVybmFsU2VydmVyRXJyb3JcbiAgfVxuXG4gIHRoaXMuYm9keSA9IGVyclxuICB0aGlzLnN0YXR1cyA9IGVyci5zdGF0dXMgfHwgNTAwXG59XG5cbmZ1bmN0aW9uIHNlbmQoKSB7XG4gICh0aGlzOiBDb250ZXh0KVxuXG4gIGlmICh0aGlzLnNlbnQpIHJldHVyblxuXG4gIGlmICh0aGlzLmJvZHkgPT09IG51bGwpIHtcbiAgICB0aGlzLmJvZHkgPSBCdWZmZXIuYWxsb2MoMClcbiAgfSBlbHNlIGlmICh0aGlzLmJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAvKiBVc2UgYXMgaXMuICovXG4gIH0gZWxzZSBpZiAodGhpcy5ib2R5IGluc3RhbmNlb2YgUmVhZGFibGUpIHtcbiAgICB0aGlzLmJvZHkucGlwZSh0aGlzLnJlc3BvbnNlKVxuICAgIHJldHVyblxuICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmJvZHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICB0aGlzLmJvZHkgPSBCdWZmZXIuZnJvbSh0aGlzLmJvZHksIFwidXRmOFwiKVxuICB9IGVsc2Uge1xuICAgIC8qIFRyZWF0IGFzIEpTT04uICovXG4gICAgdGhpcy5zZXQoXCJjb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG4gICAgdGhpcy5ib2R5ID0gQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkodGhpcy5ib2R5KSwgXCJ1dGY4XCIpXG4gIH1cblxuICB0aGlzLnNldChcImNvbnRlbnQtbGVuZ3RoXCIsIEJ1ZmZlci5ieXRlTGVuZ3RoKHRoaXMuYm9keSkpXG4gIHRoaXMucmVzcG9uc2UuZW5kKHRoaXMuYm9keSlcbn1cbiJdfQ==