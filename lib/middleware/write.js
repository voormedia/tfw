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
      } catch (err) {
        setError(ctx, err);
      }

      setHeaders(ctx);
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
    try {
      ctx.res.setHeader(name, value);
    } catch (err) {
      setError(ctx, err);
    }
  }
}

function setError(ctx, err) {
  ctx.data.error = err;

  if (!err.expose) {
    if (process.env.NODE_ENV === "test") throw err;
    err = new _errors.InternalServerError();
  }

  ctx.body = err;
  ctx.status = err.status;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsImN0eCIsInN0cmVhbWluZyIsInN0cmVhbSIsInNldEhlYWRlcnMiLCJyZXMiLCJ3cml0ZUhlYWQiLCJzdGF0dXMiLCJwaXBlIiwiZXJyIiwic2V0RXJyb3IiLCJzZXRSZXNwb25zZSIsIm5hbWUiLCJ2YWx1ZSIsImhlYWRlcnMiLCJzZXRIZWFkZXIiLCJkYXRhIiwiZXJyb3IiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJib2R5IiwiQnVmZmVyIiwiYWxsb2MiLCJmcm9tIiwiSlNPTiIsInN0cmluZ2lmeSIsImxlbmd0aCIsImJ5dGVMZW5ndGgiLCJ0b1N0cmluZyIsImVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBTXdCQSxLOztBQUp4Qjs7O0FBREE7OztBQUtlLFNBQVNBLEtBQVQsR0FBNkI7QUFDMUM7QUFBQSxpQ0FBTyxXQUFxQkMsSUFBckIsRUFBaUM7QUFDdEMsWUFBTUMsTUFBZSxJQUFyQjs7QUFFQSxVQUFJO0FBQ0YsWUFBSUMsWUFBWSxLQUFoQjtBQUNBRCxZQUFJRSxNQUFKLEdBQWEsa0JBQVU7QUFDckJDLHFCQUFXSCxHQUFYO0FBQ0FBLGNBQUlJLEdBQUosQ0FBUUMsU0FBUixDQUFrQkwsSUFBSU0sTUFBdEI7QUFDQUosaUJBQU9LLElBQVAsQ0FBWVAsSUFBSUksR0FBaEI7QUFDQUgsc0JBQVksSUFBWjtBQUNELFNBTEQ7O0FBT0EsY0FBTUYsTUFBTjs7QUFFQSxZQUFJRSxTQUFKLEVBQWU7QUFDaEIsT0FaRCxDQVlFLE9BQU9PLEdBQVAsRUFBWTtBQUNaQyxpQkFBU1QsR0FBVCxFQUFjUSxHQUFkO0FBQ0Q7O0FBRURMLGlCQUFXSCxHQUFYO0FBQ0FVLGtCQUFZVixHQUFaO0FBQ0QsS0FyQkQ7O0FBQUEsYUFBc0JGLEtBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsS0FBdEI7QUFBQTtBQXNCRDs7QUFFRCxTQUFTSyxVQUFULENBQW9CSCxHQUFwQixFQUFrQztBQUNoQyxPQUFLLE1BQU0sQ0FBQ1csSUFBRCxFQUFPQyxLQUFQLENBQVgsSUFBNEJaLElBQUlhLE9BQWhDLEVBQXlDO0FBQ3ZDLFFBQUk7QUFDRmIsVUFBSUksR0FBSixDQUFRVSxTQUFSLENBQWtCSCxJQUFsQixFQUF3QkMsS0FBeEI7QUFDRCxLQUZELENBRUUsT0FBT0osR0FBUCxFQUFZO0FBQ1pDLGVBQVNULEdBQVQsRUFBY1EsR0FBZDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFTQyxRQUFULENBQWtCVCxHQUFsQixFQUFnQ1EsR0FBaEMsRUFBMEM7QUFDeENSLE1BQUllLElBQUosQ0FBU0MsS0FBVCxHQUFpQlIsR0FBakI7O0FBRUEsTUFBSSxDQUFDQSxJQUFJUyxNQUFULEVBQWlCO0FBQ2YsUUFBSUMsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLE1BQTdCLEVBQXFDLE1BQU1aLEdBQU47QUFDckNBLFVBQU0saUNBQU47QUFDRDs7QUFFRFIsTUFBSXFCLElBQUosR0FBV2IsR0FBWDtBQUNBUixNQUFJTSxNQUFKLEdBQWFFLElBQUlGLE1BQWpCO0FBQ0Q7O0FBRUQsU0FBU0ksV0FBVCxDQUFxQlYsR0FBckIsRUFBbUM7QUFDakMsTUFBSUEsSUFBSXFCLElBQUosS0FBYSxJQUFqQixFQUF1QjtBQUNyQnJCLFFBQUlxQixJQUFKLEdBQVdDLE9BQU9DLEtBQVAsQ0FBYSxDQUFiLENBQVg7QUFDRCxHQUZELE1BRU8sSUFBSSxPQUFPdkIsSUFBSXFCLElBQVgsS0FBb0IsUUFBeEIsRUFBa0M7QUFDdkNyQixRQUFJcUIsSUFBSixHQUFXQyxPQUFPRSxJQUFQLENBQVl4QixJQUFJcUIsSUFBaEIsRUFBc0IsTUFBdEIsQ0FBWDtBQUNELEdBRk0sTUFFQSxJQUFJckIsSUFBSXFCLElBQUosWUFBb0JDLE1BQXhCLEVBQWdDO0FBQ3JDO0FBQ0QsR0FGTSxNQUVBO0FBQ0w7QUFDQXRCLFFBQUlJLEdBQUosQ0FBUVUsU0FBUixDQUFrQixjQUFsQixFQUFrQyxrQkFBbEM7QUFDQWQsUUFBSXFCLElBQUosR0FBV0MsT0FBT0UsSUFBUCxDQUFZQyxLQUFLQyxTQUFMLENBQWUxQixJQUFJcUIsSUFBbkIsQ0FBWixFQUFzQyxNQUF0QyxDQUFYO0FBQ0Q7O0FBRUQsTUFBSXJCLElBQUlxQixJQUFKLENBQVNNLE1BQWIsRUFBcUI7QUFDbkIzQixRQUFJSSxHQUFKLENBQVFVLFNBQVIsQ0FBa0IsZ0JBQWxCLEVBQW9DUSxPQUFPTSxVQUFQLENBQWtCNUIsSUFBSXFCLElBQXRCLEVBQTRCUSxRQUE1QixFQUFwQztBQUNEOztBQUVEN0IsTUFBSUksR0FBSixDQUFRQyxTQUFSLENBQWtCTCxJQUFJTSxNQUF0QjtBQUNBTixNQUFJSSxHQUFKLENBQVEwQixHQUFSLENBQVk5QixJQUFJcUIsSUFBaEI7QUFDRCIsImZpbGUiOiJ3cml0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1leC1hc3NpZ24gKi9cbmltcG9ydCB7SW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4uL2Vycm9yc1wiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdyaXRlKCk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gd3JpdGUobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcblxuICAgIHRyeSB7XG4gICAgICBsZXQgc3RyZWFtaW5nID0gZmFsc2VcbiAgICAgIGN0eC5zdHJlYW0gPSBzdHJlYW0gPT4ge1xuICAgICAgICBzZXRIZWFkZXJzKGN0eClcbiAgICAgICAgY3R4LnJlcy53cml0ZUhlYWQoY3R4LnN0YXR1cylcbiAgICAgICAgc3RyZWFtLnBpcGUoY3R4LnJlcylcbiAgICAgICAgc3RyZWFtaW5nID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBhd2FpdCBuZXh0KClcblxuICAgICAgaWYgKHN0cmVhbWluZykgcmV0dXJuXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzZXRFcnJvcihjdHgsIGVycilcbiAgICB9XG5cbiAgICBzZXRIZWFkZXJzKGN0eClcbiAgICBzZXRSZXNwb25zZShjdHgpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0SGVhZGVycyhjdHg6IENvbnRleHQpIHtcbiAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIGN0eC5oZWFkZXJzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGN0eC5yZXMuc2V0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoY3R4LCBlcnIpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEVycm9yKGN0eDogQ29udGV4dCwgZXJyOiBhbnkpIHtcbiAgY3R4LmRhdGEuZXJyb3IgPSBlcnJcblxuICBpZiAoIWVyci5leHBvc2UpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiKSB0aHJvdyBlcnJcbiAgICBlcnIgPSBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvclxuICB9XG5cbiAgY3R4LmJvZHkgPSBlcnJcbiAgY3R4LnN0YXR1cyA9IGVyci5zdGF0dXNcbn1cblxuZnVuY3Rpb24gc2V0UmVzcG9uc2UoY3R4OiBDb250ZXh0KSB7XG4gIGlmIChjdHguYm9keSA9PT0gbnVsbCkge1xuICAgIGN0eC5ib2R5ID0gQnVmZmVyLmFsbG9jKDApXG4gIH0gZWxzZSBpZiAodHlwZW9mIGN0eC5ib2R5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgY3R4LmJvZHkgPSBCdWZmZXIuZnJvbShjdHguYm9keSwgXCJ1dGY4XCIpXG4gIH0gZWxzZSBpZiAoY3R4LmJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAvKiBVc2UgYXMgaXMuICovXG4gIH0gZWxzZSB7XG4gICAgLyogVHJlYXQgYXMgSlNPTi4gKi9cbiAgICBjdHgucmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIilcbiAgICBjdHguYm9keSA9IEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGN0eC5ib2R5KSwgXCJ1dGY4XCIpXG4gIH1cblxuICBpZiAoY3R4LmJvZHkubGVuZ3RoKSB7XG4gICAgY3R4LnJlcy5zZXRIZWFkZXIoXCJDb250ZW50LUxlbmd0aFwiLCBCdWZmZXIuYnl0ZUxlbmd0aChjdHguYm9keSkudG9TdHJpbmcoKSlcbiAgfVxuXG4gIGN0eC5yZXMud3JpdGVIZWFkKGN0eC5zdGF0dXMpXG4gIGN0eC5yZXMuZW5kKGN0eC5ib2R5KVxufVxuIl19