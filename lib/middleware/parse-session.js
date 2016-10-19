"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseSession;

var _cookies = require("cookies");

var _cookies2 = _interopRequireDefault(_cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function decode(string) {
  const body = new Buffer(string, "base64").toString("utf8");
  return JSON.parse(body);
}

function encode(body) {
  const string = JSON.stringify(body);
  return new Buffer(string).toString("base64");
}

const day = 24 * 60 * 60 * 1000;

function parseSession({ name = "sess", keys, maxAge = 90 * day } = {}) {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      const ctx = this;

      let session, cookie;
      const socket = ctx.req.socket;
      const secure = socket.encrypted || ctx.req.headers["x-forwarded-proto"] === "https";
      const cookies = new _cookies2.default(ctx.req, ctx.res, { keys, secure });

      /* https://github.com/facebook/flow/issues/285 */
      Object.defineProperty(ctx.data, "session", {
        get: function () {
          if (session !== undefined) return session;

          cookie = cookies.get(name, { maxAge });
          if (cookie) {
            try {
              session = decode(cookie);
            } catch (err) {
              session = {};
            }
          } else {
            session = {};
          }

          return session;
        },

        set: function (value) {
          if (typeof value !== "object") {
            throw new TypeError("Session must be an object");
          }

          if (cookie === undefined) {
            cookie = cookies.get(name, { maxAge });
          }

          session = value;
        }
      });

      try {
        yield next();
      } finally {
        if (session === undefined) {
          /* Session not used. */
        } else if (session && Object.keys(session).length) {
          const encoded = encode(session);
          if (encoded !== cookie) {
            /* Only set session if it has changed. */
            cookies.set(name, encoded, { maxAge });
          }
        } else if (cookie) {
          cookies.set(name, "");
        }
      }
    });

    function parseSession(_x) {
      return _ref.apply(this, arguments);
    }

    return parseSession;
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLXNlc3Npb24uanMiXSwibmFtZXMiOlsicGFyc2VTZXNzaW9uIiwiZGVjb2RlIiwic3RyaW5nIiwiYm9keSIsIkJ1ZmZlciIsInRvU3RyaW5nIiwiSlNPTiIsInBhcnNlIiwiZW5jb2RlIiwic3RyaW5naWZ5IiwiZGF5IiwibmFtZSIsImtleXMiLCJtYXhBZ2UiLCJuZXh0IiwiY3R4Iiwic2Vzc2lvbiIsImNvb2tpZSIsInNvY2tldCIsInJlcSIsInNlY3VyZSIsImVuY3J5cHRlZCIsImhlYWRlcnMiLCJjb29raWVzIiwicmVzIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJkYXRhIiwiZ2V0IiwidW5kZWZpbmVkIiwiZXJyIiwic2V0IiwidmFsdWUiLCJUeXBlRXJyb3IiLCJsZW5ndGgiLCJlbmNvZGVkIl0sIm1hcHBpbmdzIjoiOzs7OztrQkF1QndCQSxZOztBQXBCeEI7Ozs7Ozs7O0FBUUEsU0FBU0MsTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0I7QUFDdEIsUUFBTUMsT0FBTyxJQUFJQyxNQUFKLENBQVdGLE1BQVgsRUFBbUIsUUFBbkIsRUFBNkJHLFFBQTdCLENBQXNDLE1BQXRDLENBQWI7QUFDQSxTQUFPQyxLQUFLQyxLQUFMLENBQVdKLElBQVgsQ0FBUDtBQUNEOztBQUVELFNBQVNLLE1BQVQsQ0FBZ0JMLElBQWhCLEVBQXNCO0FBQ3BCLFFBQU1ELFNBQVNJLEtBQUtHLFNBQUwsQ0FBZU4sSUFBZixDQUFmO0FBQ0EsU0FBTyxJQUFJQyxNQUFKLENBQVdGLE1BQVgsRUFBbUJHLFFBQW5CLENBQTRCLFFBQTVCLENBQVA7QUFDRDs7QUFFRCxNQUFNSyxNQUFNLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUEzQjs7QUFFZSxTQUFTVixZQUFULENBQXNCLEVBQUNXLE9BQU8sTUFBUixFQUFnQkMsSUFBaEIsRUFBc0JDLFNBQVMsS0FBS0gsR0FBcEMsS0FBMkQsRUFBakYsRUFBaUc7QUFDOUc7QUFBQSxpQ0FBTyxXQUE0QkksSUFBNUIsRUFBd0M7QUFDN0MsWUFBTUMsTUFBZSxJQUFyQjs7QUFFQSxVQUFJQyxPQUFKLEVBQWFDLE1BQWI7QUFDQSxZQUFNQyxTQUFxQ0gsSUFBSUksR0FBSixDQUFRRCxNQUFuRDtBQUNBLFlBQU1FLFNBQVNGLE9BQU9HLFNBQVAsSUFBb0JOLElBQUlJLEdBQUosQ0FBUUcsT0FBUixDQUFnQixtQkFBaEIsTUFBeUMsT0FBNUU7QUFDQSxZQUFNQyxVQUFVLHNCQUFZUixJQUFJSSxHQUFoQixFQUFxQkosSUFBSVMsR0FBekIsRUFBOEIsRUFBQ1osSUFBRCxFQUFPUSxNQUFQLEVBQTlCLENBQWhCOztBQUVBO0FBQ0FLLGFBQU9DLGNBQVAsQ0FBc0JYLElBQUlZLElBQTFCLEVBQWdDLFNBQWhDLEVBQTRDO0FBQzFDQyxhQUFLLFlBQU07QUFDVCxjQUFJWixZQUFZYSxTQUFoQixFQUEyQixPQUFPYixPQUFQOztBQUUzQkMsbUJBQVNNLFFBQVFLLEdBQVIsQ0FBWWpCLElBQVosRUFBa0IsRUFBQ0UsTUFBRCxFQUFsQixDQUFUO0FBQ0EsY0FBSUksTUFBSixFQUFZO0FBQ1YsZ0JBQUk7QUFDRkQsd0JBQVVmLE9BQU9nQixNQUFQLENBQVY7QUFDRCxhQUZELENBRUUsT0FBT2EsR0FBUCxFQUFZO0FBQ1pkLHdCQUFVLEVBQVY7QUFDRDtBQUNGLFdBTkQsTUFNTztBQUNMQSxzQkFBVSxFQUFWO0FBQ0Q7O0FBRUQsaUJBQU9BLE9BQVA7QUFDRCxTQWhCeUM7O0FBa0IxQ2UsYUFBSyxpQkFBUztBQUNaLGNBQUksT0FBT0MsS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUM3QixrQkFBTSxJQUFJQyxTQUFKLENBQWMsMkJBQWQsQ0FBTjtBQUNEOztBQUVELGNBQUloQixXQUFXWSxTQUFmLEVBQTBCO0FBQ3hCWixxQkFBU00sUUFBUUssR0FBUixDQUFZakIsSUFBWixFQUFrQixFQUFDRSxNQUFELEVBQWxCLENBQVQ7QUFDRDs7QUFFREcsb0JBQVVnQixLQUFWO0FBQ0Q7QUE1QnlDLE9BQTVDOztBQStCQSxVQUFJO0FBQ0YsY0FBTWxCLE1BQU47QUFDRCxPQUZELFNBRVU7QUFDUixZQUFJRSxZQUFZYSxTQUFoQixFQUEyQjtBQUN6QjtBQUNELFNBRkQsTUFFTyxJQUFJYixXQUFXUyxPQUFPYixJQUFQLENBQVlJLE9BQVosRUFBcUJrQixNQUFwQyxFQUE0QztBQUNqRCxnQkFBTUMsVUFBVTNCLE9BQU9RLE9BQVAsQ0FBaEI7QUFDQSxjQUFJbUIsWUFBWWxCLE1BQWhCLEVBQXdCO0FBQ3RCO0FBQ0FNLG9CQUFRUSxHQUFSLENBQVlwQixJQUFaLEVBQWtCd0IsT0FBbEIsRUFBMkIsRUFBQ3RCLE1BQUQsRUFBM0I7QUFDRDtBQUNGLFNBTk0sTUFNQSxJQUFJSSxNQUFKLEVBQVk7QUFDakJNLGtCQUFRUSxHQUFSLENBQVlwQixJQUFaLEVBQWtCLEVBQWxCO0FBQ0Q7QUFDRjtBQUNGLEtBdkREOztBQUFBLGFBQXNCWCxZQUF0QjtBQUFBO0FBQUE7O0FBQUEsV0FBc0JBLFlBQXRCO0FBQUE7QUF3REQiLCJmaWxlIjoicGFyc2Utc2Vzc2lvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5pbXBvcnQgQ29va2llcyBmcm9tIFwiY29va2llc1wiXG5cbnR5cGUgU2Vzc2lvbk9wdGlvbnMgPSB7XG4gIG5hbWU/OiBzdHJpbmcsXG4gIGtleXM/OiBBcnJheTxzdHJpbmc+LFxuICBtYXhBZ2U/OiBudW1iZXIsXG59XG5cbmZ1bmN0aW9uIGRlY29kZShzdHJpbmcpIHtcbiAgY29uc3QgYm9keSA9IG5ldyBCdWZmZXIoc3RyaW5nLCBcImJhc2U2NFwiKS50b1N0cmluZyhcInV0ZjhcIilcbiAgcmV0dXJuIEpTT04ucGFyc2UoYm9keSlcbn1cblxuZnVuY3Rpb24gZW5jb2RlKGJvZHkpIHtcbiAgY29uc3Qgc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoYm9keSlcbiAgcmV0dXJuIG5ldyBCdWZmZXIoc3RyaW5nKS50b1N0cmluZyhcImJhc2U2NFwiKVxufVxuXG5jb25zdCBkYXkgPSAyNCAqIDYwICogNjAgKiAxMDAwXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlU2Vzc2lvbih7bmFtZSA9IFwic2Vzc1wiLCBrZXlzLCBtYXhBZ2UgPSA5MCAqIGRheX06IFNlc3Npb25PcHRpb25zID0ge30pOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHBhcnNlU2Vzc2lvbihuZXh0OiBOZXh0KSB7XG4gICAgY29uc3QgY3R4OiBDb250ZXh0ID0gdGhpc1xuXG4gICAgbGV0IHNlc3Npb24sIGNvb2tpZVxuICAgIGNvbnN0IHNvY2tldDogdGxzJFRMU1NvY2tldCB8IG5ldCRTb2NrZXQgPSBjdHgucmVxLnNvY2tldFxuICAgIGNvbnN0IHNlY3VyZSA9IHNvY2tldC5lbmNyeXB0ZWQgfHwgY3R4LnJlcS5oZWFkZXJzW1wieC1mb3J3YXJkZWQtcHJvdG9cIl0gPT09IFwiaHR0cHNcIlxuICAgIGNvbnN0IGNvb2tpZXMgPSBuZXcgQ29va2llcyhjdHgucmVxLCBjdHgucmVzLCB7a2V5cywgc2VjdXJlfSlcblxuICAgIC8qIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8yODUgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3R4LmRhdGEsIFwic2Vzc2lvblwiLCAoe1xuICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgIGlmIChzZXNzaW9uICE9PSB1bmRlZmluZWQpIHJldHVybiBzZXNzaW9uXG5cbiAgICAgICAgY29va2llID0gY29va2llcy5nZXQobmFtZSwge21heEFnZX0pXG4gICAgICAgIGlmIChjb29raWUpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2Vzc2lvbiA9IGRlY29kZShjb29raWUpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzZXNzaW9uID0ge31cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2Vzc2lvbiA9IHt9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2Vzc2lvblxuICAgICAgfSxcblxuICAgICAgc2V0OiB2YWx1ZSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU2Vzc2lvbiBtdXN0IGJlIGFuIG9iamVjdFwiKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvb2tpZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29va2llID0gY29va2llcy5nZXQobmFtZSwge21heEFnZX0pXG4gICAgICAgIH1cblxuICAgICAgICBzZXNzaW9uID0gdmFsdWVcbiAgICAgIH0sXG4gICAgfTogT2JqZWN0KSlcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKHNlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvKiBTZXNzaW9uIG5vdCB1c2VkLiAqL1xuICAgICAgfSBlbHNlIGlmIChzZXNzaW9uICYmIE9iamVjdC5rZXlzKHNlc3Npb24pLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBlbmNvZGVkID0gZW5jb2RlKHNlc3Npb24pXG4gICAgICAgIGlmIChlbmNvZGVkICE9PSBjb29raWUpIHtcbiAgICAgICAgICAvKiBPbmx5IHNldCBzZXNzaW9uIGlmIGl0IGhhcyBjaGFuZ2VkLiAqL1xuICAgICAgICAgIGNvb2tpZXMuc2V0KG5hbWUsIGVuY29kZWQsIHttYXhBZ2V9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvb2tpZSkge1xuICAgICAgICBjb29raWVzLnNldChuYW1lLCBcIlwiKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19