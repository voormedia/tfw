"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = write;

var _timer = require("../util/timer");

var _timer2 = _interopRequireDefault(_timer);

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-ex-assign */


function write({ terminationGrace = 25 } = {}) {
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
        let streaming = false;
        ctx.stream = function (stream) {
          setHeaders(ctx);
          ctx.res.writeHead(ctx.status);
          stream.pipe(ctx.res);
          streaming = true;
        };

        yield Promise.race([stop(), next()]);
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
      } finally {
        /* Clear timer. It frees setTimeout reference to this context, potentially
           conserving a lot of memory if most requests are short. */
        timer.clear();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwidGVybWluYXRpb25HcmFjZSIsIm5leHQiLCJjdHgiLCJ0aW1lciIsInN0b3AiLCJzbGVlcCIsInJlcSIsImNhbmNlbGxlZCIsIlByb21pc2UiLCJzdHJlYW1pbmciLCJzdHJlYW0iLCJzZXRIZWFkZXJzIiwicmVzIiwid3JpdGVIZWFkIiwic3RhdHVzIiwicGlwZSIsInJhY2UiLCJlcnIiLCJkYXRhIiwiZXJyb3IiLCJleHBvc2UiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJib2R5IiwiY2xlYXIiLCJzZXRSZXNwb25zZSIsIm5hbWUiLCJ2YWx1ZSIsImhlYWRlcnMiLCJzZXRIZWFkZXIiLCJCdWZmZXIiLCJhbGxvYyIsImZyb20iLCJKU09OIiwic3RyaW5naWZ5IiwibGVuZ3RoIiwiYnl0ZUxlbmd0aCIsInRvU3RyaW5nIiwiZW5kIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFpQndCQSxLOztBQWZ4Qjs7OztBQUVBOzs7OztBQUhBOzs7QUFnQmUsU0FBU0EsS0FBVCxDQUFlLEVBQUNDLG1CQUFtQixFQUFwQixLQUF3QyxFQUF2RCxFQUF1RTtBQUNwRjtBQUFBLGlDQUFPLFdBQXFCQyxJQUFyQixFQUFpQztBQUN0QyxZQUFNQyxNQUFlLElBQXJCOztBQUVBOztBQUVBLFlBQU1DLFFBQVEsb0JBQVVILG1CQUFtQixJQUE3QixDQUFkO0FBQ0EsWUFBTUk7QUFBQSxzQ0FBTyxhQUFZO0FBQ3ZCLGdCQUFNRCxNQUFNRSxLQUFOLEVBQU47O0FBRUEsZ0JBQU1DLE1BQXlCSixJQUFJSSxHQUFuQztBQUNBLGNBQUlBLElBQUlDLFNBQVIsRUFBbUI7QUFDakIsa0JBQU0sK0JBQXVCLDBCQUF2QixDQUFOO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsbUJBQU8sSUFBSUMsT0FBSixDQUFZLFlBQU0sQ0FBRSxDQUFwQixDQUFQO0FBQ0Q7QUFDRixTQVRLOztBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQU47O0FBV0EsVUFBSTtBQUNGLFlBQUlDLFlBQVksS0FBaEI7QUFDQVAsWUFBSVEsTUFBSixHQUFhLGtCQUFVO0FBQ3JCQyxxQkFBV1QsR0FBWDtBQUNBQSxjQUFJVSxHQUFKLENBQVFDLFNBQVIsQ0FBa0JYLElBQUlZLE1BQXRCO0FBQ0FKLGlCQUFPSyxJQUFQLENBQVliLElBQUlVLEdBQWhCO0FBQ0FILHNCQUFZLElBQVo7QUFDRCxTQUxEOztBQU9BLGNBQU1ELFFBQVFRLElBQVIsQ0FBYSxDQUFDWixNQUFELEVBQVNILE1BQVQsQ0FBYixDQUFOO0FBQ0EsWUFBSVEsU0FBSixFQUFlO0FBQ2ZFLG1CQUFXVCxHQUFYO0FBQ0QsT0FaRCxDQVlFLE9BQU9lLEdBQVAsRUFBWTtBQUNaZixZQUFJZ0IsSUFBSixDQUFTQyxLQUFULEdBQWlCRixHQUFqQjs7QUFFQSxZQUFJLENBQUNBLElBQUlHLE1BQVQsRUFBaUI7QUFDZixjQUFJQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsTUFBN0IsRUFBcUMsTUFBTU4sR0FBTjtBQUNyQ0EsZ0JBQU0saUNBQU47QUFDRDs7QUFFRGYsWUFBSXNCLElBQUosR0FBV1AsR0FBWDtBQUNBZixZQUFJWSxNQUFKLEdBQWFHLElBQUlILE1BQWpCO0FBQ0QsT0F0QkQsU0FzQlU7QUFDUjs7QUFFQVgsY0FBTXNCLEtBQU47QUFDRDs7QUFFREMsa0JBQVl4QixHQUFaO0FBQ0QsS0E5Q0Q7O0FBQUEsYUFBc0JILEtBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsS0FBdEI7QUFBQTtBQStDRDs7QUFFRCxTQUFTWSxVQUFULENBQW9CVCxHQUFwQixFQUF5QjtBQUN2QixPQUFLLE1BQU0sQ0FBQ3lCLElBQUQsRUFBT0MsS0FBUCxDQUFYLElBQTRCMUIsSUFBSTJCLE9BQWhDLEVBQXlDO0FBQ3ZDM0IsUUFBSVUsR0FBSixDQUFRa0IsU0FBUixDQUFrQkgsSUFBbEIsRUFBd0JDLEtBQXhCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTRixXQUFULENBQXFCeEIsR0FBckIsRUFBMEI7QUFDeEIsTUFBSUEsSUFBSXNCLElBQUosS0FBYSxJQUFqQixFQUF1QjtBQUNyQnRCLFFBQUlzQixJQUFKLEdBQVdPLE9BQU9DLEtBQVAsQ0FBYSxDQUFiLENBQVg7QUFDRCxHQUZELE1BRU8sSUFBSSxPQUFPOUIsSUFBSXNCLElBQVgsS0FBb0IsUUFBeEIsRUFBa0M7QUFDdkN0QixRQUFJc0IsSUFBSixHQUFXTyxPQUFPRSxJQUFQLENBQVkvQixJQUFJc0IsSUFBaEIsRUFBc0IsTUFBdEIsQ0FBWDtBQUNELEdBRk0sTUFFQSxJQUFJdEIsSUFBSXNCLElBQUosWUFBb0JPLE1BQXhCLEVBQWdDO0FBQ3JDO0FBQ0QsR0FGTSxNQUVBO0FBQ0w7QUFDQTdCLFFBQUlVLEdBQUosQ0FBUWtCLFNBQVIsQ0FBa0IsY0FBbEIsRUFBa0Msa0JBQWxDO0FBQ0E1QixRQUFJc0IsSUFBSixHQUFXTyxPQUFPRSxJQUFQLENBQVlDLEtBQUtDLFNBQUwsQ0FBZWpDLElBQUlzQixJQUFuQixDQUFaLEVBQXNDLE1BQXRDLENBQVg7QUFDRDs7QUFFRCxNQUFJdEIsSUFBSXNCLElBQUosQ0FBU1ksTUFBYixFQUFxQjtBQUNuQmxDLFFBQUlVLEdBQUosQ0FBUWtCLFNBQVIsQ0FBa0IsZ0JBQWxCLEVBQW9DQyxPQUFPTSxVQUFQLENBQWtCbkMsSUFBSXNCLElBQXRCLEVBQTRCYyxRQUE1QixFQUFwQztBQUNEOztBQUVEcEMsTUFBSVUsR0FBSixDQUFRQyxTQUFSLENBQWtCWCxJQUFJWSxNQUF0QjtBQUNBWixNQUFJVSxHQUFKLENBQVEyQixHQUFSLENBQVlyQyxJQUFJc0IsSUFBaEI7QUFDRCIsImZpbGUiOiJ3cml0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1leC1hc3NpZ24gKi9cbmltcG9ydCBUaW1lciBmcm9tIFwiLi4vdXRpbC90aW1lclwiXG5cbmltcG9ydCB7U2VydmljZVVuYXZhaWxhYmxlLCBJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcbmltcG9ydCB0eXBlIHtSZXF1ZXN0fSBmcm9tIFwiLi4vY29udGV4dFwiXG5cbnR5cGUgQ2FuY2VsbGluZ1JlcXVlc3QgPSBSZXF1ZXN0ICYge1xuICBjYW5jZWxsZWQ/OiBib29sZWFuLFxufVxuXG50eXBlIFdyaXRlT3B0aW9ucyA9IHtcbiAgdGVybWluYXRpb25HcmFjZTogbnVtYmVyLFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3cml0ZSh7dGVybWluYXRpb25HcmFjZSA9IDI1fTogV3JpdGVPcHRpb25zID0ge30pOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHdyaXRlKG5leHQ6IE5leHQpIHtcbiAgICBjb25zdCBjdHg6IENvbnRleHQgPSB0aGlzXG5cbiAgICAvKiBDYW5jZWwgcmVxdWVzdCBpZiBzZXJ2ZXIgaXMgc3RvcHBpbmcsIGJ1dCBvbmx5IGFmdGVyIGEgZ3JhY2UgcGVyaW9kLlxuICAgICAgIFRoaXMgYWxsb3dzIGEgcmVxdWVzdCB0byBiZSBoYW5kbGVkIGlmIHRoZXJlIGlzIGVub3VnaCB0aW1lLiAqL1xuICAgIGNvbnN0IHRpbWVyID0gbmV3IFRpbWVyKHRlcm1pbmF0aW9uR3JhY2UgKiAxMDAwKVxuICAgIGNvbnN0IHN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aW1lci5zbGVlcCgpXG5cbiAgICAgIGNvbnN0IHJlcTogQ2FuY2VsbGluZ1JlcXVlc3QgPSBjdHgucmVxXG4gICAgICBpZiAocmVxLmNhbmNlbGxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgU2VydmljZVVuYXZhaWxhYmxlKFwiUGxlYXNlIHJldHJ5IHRoZSByZXF1ZXN0XCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pXG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGxldCBzdHJlYW1pbmcgPSBmYWxzZVxuICAgICAgY3R4LnN0cmVhbSA9IHN0cmVhbSA9PiB7XG4gICAgICAgIHNldEhlYWRlcnMoY3R4KVxuICAgICAgICBjdHgucmVzLndyaXRlSGVhZChjdHguc3RhdHVzKVxuICAgICAgICBzdHJlYW0ucGlwZShjdHgucmVzKVxuICAgICAgICBzdHJlYW1pbmcgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGF3YWl0IFByb21pc2UucmFjZShbc3RvcCgpLCBuZXh0KCldKVxuICAgICAgaWYgKHN0cmVhbWluZykgcmV0dXJuXG4gICAgICBzZXRIZWFkZXJzKGN0eClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGN0eC5kYXRhLmVycm9yID0gZXJyXG5cbiAgICAgIGlmICghZXJyLmV4cG9zZSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiKSB0aHJvdyBlcnJcbiAgICAgICAgZXJyID0gbmV3IEludGVybmFsU2VydmVyRXJyb3JcbiAgICAgIH1cblxuICAgICAgY3R4LmJvZHkgPSBlcnJcbiAgICAgIGN0eC5zdGF0dXMgPSBlcnIuc3RhdHVzXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8qIENsZWFyIHRpbWVyLiBJdCBmcmVlcyBzZXRUaW1lb3V0IHJlZmVyZW5jZSB0byB0aGlzIGNvbnRleHQsIHBvdGVudGlhbGx5XG4gICAgICAgICBjb25zZXJ2aW5nIGEgbG90IG9mIG1lbW9yeSBpZiBtb3N0IHJlcXVlc3RzIGFyZSBzaG9ydC4gKi9cbiAgICAgIHRpbWVyLmNsZWFyKClcbiAgICB9XG5cbiAgICBzZXRSZXNwb25zZShjdHgpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0SGVhZGVycyhjdHgpIHtcbiAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIGN0eC5oZWFkZXJzKSB7XG4gICAgY3R4LnJlcy5zZXRIZWFkZXIobmFtZSwgdmFsdWUpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0UmVzcG9uc2UoY3R4KSB7XG4gIGlmIChjdHguYm9keSA9PT0gbnVsbCkge1xuICAgIGN0eC5ib2R5ID0gQnVmZmVyLmFsbG9jKDApXG4gIH0gZWxzZSBpZiAodHlwZW9mIGN0eC5ib2R5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgY3R4LmJvZHkgPSBCdWZmZXIuZnJvbShjdHguYm9keSwgXCJ1dGY4XCIpXG4gIH0gZWxzZSBpZiAoY3R4LmJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAvKiBVc2UgYXMgaXMuICovXG4gIH0gZWxzZSB7XG4gICAgLyogVHJlYXQgYXMgSlNPTi4gKi9cbiAgICBjdHgucmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIilcbiAgICBjdHguYm9keSA9IEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGN0eC5ib2R5KSwgXCJ1dGY4XCIpXG4gIH1cblxuICBpZiAoY3R4LmJvZHkubGVuZ3RoKSB7XG4gICAgY3R4LnJlcy5zZXRIZWFkZXIoXCJDb250ZW50LUxlbmd0aFwiLCBCdWZmZXIuYnl0ZUxlbmd0aChjdHguYm9keSkudG9TdHJpbmcoKSlcbiAgfVxuXG4gIGN0eC5yZXMud3JpdGVIZWFkKGN0eC5zdGF0dXMpXG4gIGN0eC5yZXMuZW5kKGN0eC5ib2R5KVxufVxuIl19