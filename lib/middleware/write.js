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
  ctx.status = err.status || 500;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsImN0eCIsInN0cmVhbWluZyIsInN0cmVhbSIsInNldEhlYWRlcnMiLCJyZXMiLCJ3cml0ZUhlYWQiLCJzdGF0dXMiLCJwaXBlIiwiZXJyIiwic2V0RXJyb3IiLCJzZXRSZXNwb25zZSIsIm5hbWUiLCJ2YWx1ZSIsImhlYWRlcnMiLCJzZXRIZWFkZXIiLCJkYXRhIiwiZXJyb3IiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJib2R5IiwiQnVmZmVyIiwiYWxsb2MiLCJmcm9tIiwiSlNPTiIsInN0cmluZ2lmeSIsImxlbmd0aCIsImJ5dGVMZW5ndGgiLCJ0b1N0cmluZyIsImVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBTXdCQSxLOztBQUp4Qjs7O0FBREE7OztBQUtlLFNBQVNBLEtBQVQsR0FBNkI7QUFDMUM7QUFBQSxpQ0FBTyxXQUFxQkMsSUFBckIsRUFBaUM7QUFDdEMsWUFBTUMsTUFBZSxJQUFyQjs7QUFFQSxVQUFJO0FBQ0YsWUFBSUMsWUFBWSxLQUFoQjtBQUNBRCxZQUFJRSxNQUFKLEdBQWEsa0JBQVU7QUFDckJDLHFCQUFXSCxHQUFYO0FBQ0FBLGNBQUlJLEdBQUosQ0FBUUMsU0FBUixDQUFrQkwsSUFBSU0sTUFBdEI7QUFDQUosaUJBQU9LLElBQVAsQ0FBWVAsSUFBSUksR0FBaEI7QUFDQUgsc0JBQVksSUFBWjtBQUNELFNBTEQ7O0FBT0EsY0FBTUYsTUFBTjs7QUFFQSxZQUFJRSxTQUFKLEVBQWU7QUFDaEIsT0FaRCxDQVlFLE9BQU9PLEdBQVAsRUFBWTtBQUNaQyxpQkFBU1QsR0FBVCxFQUFjUSxHQUFkO0FBQ0Q7O0FBRURMLGlCQUFXSCxHQUFYO0FBQ0FVLGtCQUFZVixHQUFaO0FBQ0QsS0FyQkQ7O0FBQUEsYUFBc0JGLEtBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsS0FBdEI7QUFBQTtBQXNCRDs7QUFFRCxTQUFTSyxVQUFULENBQW9CSCxHQUFwQixFQUFrQztBQUNoQyxPQUFLLE1BQU0sQ0FBQ1csSUFBRCxFQUFPQyxLQUFQLENBQVgsSUFBNEJaLElBQUlhLE9BQWhDLEVBQXlDO0FBQ3ZDLFFBQUk7QUFDRmIsVUFBSUksR0FBSixDQUFRVSxTQUFSLENBQWtCSCxJQUFsQixFQUF3QkMsS0FBeEI7QUFDRCxLQUZELENBRUUsT0FBT0osR0FBUCxFQUFZO0FBQ1pDLGVBQVNULEdBQVQsRUFBY1EsR0FBZDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFTQyxRQUFULENBQWtCVCxHQUFsQixFQUFnQ1EsR0FBaEMsRUFBMEM7QUFDeENSLE1BQUllLElBQUosQ0FBU0MsS0FBVCxHQUFpQlIsR0FBakI7O0FBRUEsTUFBSSxDQUFDQSxJQUFJUyxNQUFULEVBQWlCO0FBQ2YsUUFBSUMsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLE1BQTdCLEVBQXFDLE1BQU1aLEdBQU47QUFDckNBLFVBQU0saUNBQU47QUFDRDs7QUFFRFIsTUFBSXFCLElBQUosR0FBV2IsR0FBWDtBQUNBUixNQUFJTSxNQUFKLEdBQWFFLElBQUlGLE1BQUosSUFBYyxHQUEzQjtBQUNEOztBQUVELFNBQVNJLFdBQVQsQ0FBcUJWLEdBQXJCLEVBQW1DO0FBQ2pDLE1BQUlBLElBQUlxQixJQUFKLEtBQWEsSUFBakIsRUFBdUI7QUFDckJyQixRQUFJcUIsSUFBSixHQUFXQyxPQUFPQyxLQUFQLENBQWEsQ0FBYixDQUFYO0FBQ0QsR0FGRCxNQUVPLElBQUksT0FBT3ZCLElBQUlxQixJQUFYLEtBQW9CLFFBQXhCLEVBQWtDO0FBQ3ZDckIsUUFBSXFCLElBQUosR0FBV0MsT0FBT0UsSUFBUCxDQUFZeEIsSUFBSXFCLElBQWhCLEVBQXNCLE1BQXRCLENBQVg7QUFDRCxHQUZNLE1BRUEsSUFBSXJCLElBQUlxQixJQUFKLFlBQW9CQyxNQUF4QixFQUFnQztBQUNyQztBQUNELEdBRk0sTUFFQTtBQUNMO0FBQ0F0QixRQUFJSSxHQUFKLENBQVFVLFNBQVIsQ0FBa0IsY0FBbEIsRUFBa0Msa0JBQWxDO0FBQ0FkLFFBQUlxQixJQUFKLEdBQVdDLE9BQU9FLElBQVAsQ0FBWUMsS0FBS0MsU0FBTCxDQUFlMUIsSUFBSXFCLElBQW5CLENBQVosRUFBc0MsTUFBdEMsQ0FBWDtBQUNEOztBQUVELE1BQUlyQixJQUFJcUIsSUFBSixDQUFTTSxNQUFiLEVBQXFCO0FBQ25CM0IsUUFBSUksR0FBSixDQUFRVSxTQUFSLENBQWtCLGdCQUFsQixFQUFvQ1EsT0FBT00sVUFBUCxDQUFrQjVCLElBQUlxQixJQUF0QixFQUE0QlEsUUFBNUIsRUFBcEM7QUFDRDs7QUFFRDdCLE1BQUlJLEdBQUosQ0FBUUMsU0FBUixDQUFrQkwsSUFBSU0sTUFBdEI7QUFDQU4sTUFBSUksR0FBSixDQUFRMEIsR0FBUixDQUFZOUIsSUFBSXFCLElBQWhCO0FBQ0QiLCJmaWxlIjoid3JpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tZXgtYXNzaWduICovXG5pbXBvcnQge0ludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3cml0ZSgpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHdyaXRlKG5leHQ6IE5leHQpIHtcbiAgICBjb25zdCBjdHg6IENvbnRleHQgPSB0aGlzXG5cbiAgICB0cnkge1xuICAgICAgbGV0IHN0cmVhbWluZyA9IGZhbHNlXG4gICAgICBjdHguc3RyZWFtID0gc3RyZWFtID0+IHtcbiAgICAgICAgc2V0SGVhZGVycyhjdHgpXG4gICAgICAgIGN0eC5yZXMud3JpdGVIZWFkKGN0eC5zdGF0dXMpXG4gICAgICAgIHN0cmVhbS5waXBlKGN0eC5yZXMpXG4gICAgICAgIHN0cmVhbWluZyA9IHRydWVcbiAgICAgIH1cblxuICAgICAgYXdhaXQgbmV4dCgpXG5cbiAgICAgIGlmIChzdHJlYW1pbmcpIHJldHVyblxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc2V0RXJyb3IoY3R4LCBlcnIpXG4gICAgfVxuXG4gICAgc2V0SGVhZGVycyhjdHgpXG4gICAgc2V0UmVzcG9uc2UoY3R4KVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldEhlYWRlcnMoY3R4OiBDb250ZXh0KSB7XG4gIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiBjdHguaGVhZGVycykge1xuICAgIHRyeSB7XG4gICAgICBjdHgucmVzLnNldEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHNldEVycm9yKGN0eCwgZXJyKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRFcnJvcihjdHg6IENvbnRleHQsIGVycjogYW55KSB7XG4gIGN0eC5kYXRhLmVycm9yID0gZXJyXG5cbiAgaWYgKCFlcnIuZXhwb3NlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIikgdGhyb3cgZXJyXG4gICAgZXJyID0gbmV3IEludGVybmFsU2VydmVyRXJyb3JcbiAgfVxuXG4gIGN0eC5ib2R5ID0gZXJyXG4gIGN0eC5zdGF0dXMgPSBlcnIuc3RhdHVzIHx8IDUwMFxufVxuXG5mdW5jdGlvbiBzZXRSZXNwb25zZShjdHg6IENvbnRleHQpIHtcbiAgaWYgKGN0eC5ib2R5ID09PSBudWxsKSB7XG4gICAgY3R4LmJvZHkgPSBCdWZmZXIuYWxsb2MoMClcbiAgfSBlbHNlIGlmICh0eXBlb2YgY3R4LmJvZHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICBjdHguYm9keSA9IEJ1ZmZlci5mcm9tKGN0eC5ib2R5LCBcInV0ZjhcIilcbiAgfSBlbHNlIGlmIChjdHguYm9keSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgIC8qIFVzZSBhcyBpcy4gKi9cbiAgfSBlbHNlIHtcbiAgICAvKiBUcmVhdCBhcyBKU09OLiAqL1xuICAgIGN0eC5yZXMuc2V0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKVxuICAgIGN0eC5ib2R5ID0gQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkoY3R4LmJvZHkpLCBcInV0ZjhcIilcbiAgfVxuXG4gIGlmIChjdHguYm9keS5sZW5ndGgpIHtcbiAgICBjdHgucmVzLnNldEhlYWRlcihcIkNvbnRlbnQtTGVuZ3RoXCIsIEJ1ZmZlci5ieXRlTGVuZ3RoKGN0eC5ib2R5KS50b1N0cmluZygpKVxuICB9XG5cbiAgY3R4LnJlcy53cml0ZUhlYWQoY3R4LnN0YXR1cylcbiAgY3R4LnJlcy5lbmQoY3R4LmJvZHkpXG59XG4iXX0=