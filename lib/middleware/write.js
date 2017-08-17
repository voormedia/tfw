"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = write;

var _errors = require("../errors");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-ex-assign */


function write() {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      const ctx = this;

      try {
        let streaming = false;
        ctx.stream = function (stream) {
          setHeaders(ctx);
          ctx.res.writeHead(ctx.status);
          stream.pipe(ctx.res);
          streaming = true;
        };

        yield next();

        if (streaming) return;
        setHeaders(ctx);
      } catch (err) {
        ctx.data.error = err;

        if (!err.expose) {
          if (process.env.NODE_ENV === "test") throw err;
          err = new _errors.InternalServerError();
        }

        ctx.body = err;
        ctx.status = err.status;
      }

      setResponse(ctx);
    });

    function write(_x) {
      return _ref.apply(this, arguments);
    }

    return write;
  })();
}

function setHeaders(ctx) {
  for (const [name, value] of ctx.headers) {
    ctx.res.setHeader(name, value);
  }
}

function setResponse(ctx) {
  if (ctx.body === null) {
    ctx.body = Buffer.alloc(0);
  } else if (typeof ctx.body === "string") {
    ctx.body = Buffer.from(ctx.body, "utf8");
  } else if (ctx.body instanceof Buffer) {
    /* Use as is. */
  } else {
    /* Treat as JSON. */
    ctx.res.setHeader("Content-Type", "application/json");
    ctx.body = Buffer.from(JSON.stringify(ctx.body), "utf8");
  }

  if (ctx.body.length) {
    ctx.res.setHeader("Content-Length", Buffer.byteLength(ctx.body).toString());
  }

  ctx.res.writeHead(ctx.status);
  ctx.res.end(ctx.body);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsImN0eCIsInN0cmVhbWluZyIsInN0cmVhbSIsInNldEhlYWRlcnMiLCJyZXMiLCJ3cml0ZUhlYWQiLCJzdGF0dXMiLCJwaXBlIiwiZXJyIiwiZGF0YSIsImVycm9yIiwiZXhwb3NlIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwiYm9keSIsInNldFJlc3BvbnNlIiwibmFtZSIsInZhbHVlIiwiaGVhZGVycyIsInNldEhlYWRlciIsIkJ1ZmZlciIsImFsbG9jIiwiZnJvbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJsZW5ndGgiLCJieXRlTGVuZ3RoIiwidG9TdHJpbmciLCJlbmQiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU13QkEsSzs7QUFKeEI7OztBQURBOzs7QUFLZSxTQUFTQSxLQUFULEdBQTZCO0FBQzFDO0FBQUEsaUNBQU8sV0FBcUJDLElBQXJCLEVBQWlDO0FBQ3RDLFlBQU1DLE1BQWUsSUFBckI7O0FBRUEsVUFBSTtBQUNGLFlBQUlDLFlBQVksS0FBaEI7QUFDQUQsWUFBSUUsTUFBSixHQUFhLGtCQUFVO0FBQ3JCQyxxQkFBV0gsR0FBWDtBQUNBQSxjQUFJSSxHQUFKLENBQVFDLFNBQVIsQ0FBa0JMLElBQUlNLE1BQXRCO0FBQ0FKLGlCQUFPSyxJQUFQLENBQVlQLElBQUlJLEdBQWhCO0FBQ0FILHNCQUFZLElBQVo7QUFDRCxTQUxEOztBQU9BLGNBQU1GLE1BQU47O0FBRUEsWUFBSUUsU0FBSixFQUFlO0FBQ2ZFLG1CQUFXSCxHQUFYO0FBQ0QsT0FiRCxDQWFFLE9BQU9RLEdBQVAsRUFBWTtBQUNaUixZQUFJUyxJQUFKLENBQVNDLEtBQVQsR0FBaUJGLEdBQWpCOztBQUVBLFlBQUksQ0FBQ0EsSUFBSUcsTUFBVCxFQUFpQjtBQUNmLGNBQUlDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixNQUE3QixFQUFxQyxNQUFNTixHQUFOO0FBQ3JDQSxnQkFBTSxpQ0FBTjtBQUNEOztBQUVEUixZQUFJZSxJQUFKLEdBQVdQLEdBQVg7QUFDQVIsWUFBSU0sTUFBSixHQUFhRSxJQUFJRixNQUFqQjtBQUNEOztBQUVEVSxrQkFBWWhCLEdBQVo7QUFDRCxLQTdCRDs7QUFBQSxhQUFzQkYsS0FBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxLQUF0QjtBQUFBO0FBOEJEOztBQUVELFNBQVNLLFVBQVQsQ0FBb0JILEdBQXBCLEVBQXlCO0FBQ3ZCLE9BQUssTUFBTSxDQUFDaUIsSUFBRCxFQUFPQyxLQUFQLENBQVgsSUFBNEJsQixJQUFJbUIsT0FBaEMsRUFBeUM7QUFDdkNuQixRQUFJSSxHQUFKLENBQVFnQixTQUFSLENBQWtCSCxJQUFsQixFQUF3QkMsS0FBeEI7QUFDRDtBQUNGOztBQUVELFNBQVNGLFdBQVQsQ0FBcUJoQixHQUFyQixFQUEwQjtBQUN4QixNQUFJQSxJQUFJZSxJQUFKLEtBQWEsSUFBakIsRUFBdUI7QUFDckJmLFFBQUllLElBQUosR0FBV00sT0FBT0MsS0FBUCxDQUFhLENBQWIsQ0FBWDtBQUNELEdBRkQsTUFFTyxJQUFJLE9BQU90QixJQUFJZSxJQUFYLEtBQW9CLFFBQXhCLEVBQWtDO0FBQ3ZDZixRQUFJZSxJQUFKLEdBQVdNLE9BQU9FLElBQVAsQ0FBWXZCLElBQUllLElBQWhCLEVBQXNCLE1BQXRCLENBQVg7QUFDRCxHQUZNLE1BRUEsSUFBSWYsSUFBSWUsSUFBSixZQUFvQk0sTUFBeEIsRUFBZ0M7QUFDckM7QUFDRCxHQUZNLE1BRUE7QUFDTDtBQUNBckIsUUFBSUksR0FBSixDQUFRZ0IsU0FBUixDQUFrQixjQUFsQixFQUFrQyxrQkFBbEM7QUFDQXBCLFFBQUllLElBQUosR0FBV00sT0FBT0UsSUFBUCxDQUFZQyxLQUFLQyxTQUFMLENBQWV6QixJQUFJZSxJQUFuQixDQUFaLEVBQXNDLE1BQXRDLENBQVg7QUFDRDs7QUFFRCxNQUFJZixJQUFJZSxJQUFKLENBQVNXLE1BQWIsRUFBcUI7QUFDbkIxQixRQUFJSSxHQUFKLENBQVFnQixTQUFSLENBQWtCLGdCQUFsQixFQUFvQ0MsT0FBT00sVUFBUCxDQUFrQjNCLElBQUllLElBQXRCLEVBQTRCYSxRQUE1QixFQUFwQztBQUNEOztBQUVENUIsTUFBSUksR0FBSixDQUFRQyxTQUFSLENBQWtCTCxJQUFJTSxNQUF0QjtBQUNBTixNQUFJSSxHQUFKLENBQVF5QixHQUFSLENBQVk3QixJQUFJZSxJQUFoQjtBQUNEIiwiZmlsZSI6IndyaXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWV4LWFzc2lnbiAqL1xuaW1wb3J0IHtJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd3JpdGUoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiB3cml0ZShuZXh0OiBOZXh0KSB7XG4gICAgY29uc3QgY3R4OiBDb250ZXh0ID0gdGhpc1xuXG4gICAgdHJ5IHtcbiAgICAgIGxldCBzdHJlYW1pbmcgPSBmYWxzZVxuICAgICAgY3R4LnN0cmVhbSA9IHN0cmVhbSA9PiB7XG4gICAgICAgIHNldEhlYWRlcnMoY3R4KVxuICAgICAgICBjdHgucmVzLndyaXRlSGVhZChjdHguc3RhdHVzKVxuICAgICAgICBzdHJlYW0ucGlwZShjdHgucmVzKVxuICAgICAgICBzdHJlYW1pbmcgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGF3YWl0IG5leHQoKVxuXG4gICAgICBpZiAoc3RyZWFtaW5nKSByZXR1cm5cbiAgICAgIHNldEhlYWRlcnMoY3R4KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY3R4LmRhdGEuZXJyb3IgPSBlcnJcblxuICAgICAgaWYgKCFlcnIuZXhwb3NlKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJ0ZXN0XCIpIHRocm93IGVyclxuICAgICAgICBlcnIgPSBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvclxuICAgICAgfVxuXG4gICAgICBjdHguYm9keSA9IGVyclxuICAgICAgY3R4LnN0YXR1cyA9IGVyci5zdGF0dXNcbiAgICB9XG5cbiAgICBzZXRSZXNwb25zZShjdHgpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0SGVhZGVycyhjdHgpIHtcbiAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIGN0eC5oZWFkZXJzKSB7XG4gICAgY3R4LnJlcy5zZXRIZWFkZXIobmFtZSwgdmFsdWUpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0UmVzcG9uc2UoY3R4KSB7XG4gIGlmIChjdHguYm9keSA9PT0gbnVsbCkge1xuICAgIGN0eC5ib2R5ID0gQnVmZmVyLmFsbG9jKDApXG4gIH0gZWxzZSBpZiAodHlwZW9mIGN0eC5ib2R5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgY3R4LmJvZHkgPSBCdWZmZXIuZnJvbShjdHguYm9keSwgXCJ1dGY4XCIpXG4gIH0gZWxzZSBpZiAoY3R4LmJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAvKiBVc2UgYXMgaXMuICovXG4gIH0gZWxzZSB7XG4gICAgLyogVHJlYXQgYXMgSlNPTi4gKi9cbiAgICBjdHgucmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIilcbiAgICBjdHguYm9keSA9IEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGN0eC5ib2R5KSwgXCJ1dGY4XCIpXG4gIH1cblxuICBpZiAoY3R4LmJvZHkubGVuZ3RoKSB7XG4gICAgY3R4LnJlcy5zZXRIZWFkZXIoXCJDb250ZW50LUxlbmd0aFwiLCBCdWZmZXIuYnl0ZUxlbmd0aChjdHguYm9keSkudG9TdHJpbmcoKSlcbiAgfVxuXG4gIGN0eC5yZXMud3JpdGVIZWFkKGN0eC5zdGF0dXMpXG4gIGN0eC5yZXMuZW5kKGN0eC5ib2R5KVxufVxuIl19