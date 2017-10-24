"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseSession;

var _cookies = require("cookies");

var _cookies2 = _interopRequireDefault(_cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-expressions */
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
  return async function parseSession(next) {
    this;

    let session, cookie;
    const socket = this.request.socket;
    const secure = socket.encrypted || this.request.headers["x-forwarded-proto"] === "https";
    const cookies = new _cookies2.default(this.request, this.response, { keys, secure });

    /* https://github.com/facebook/flow/issues/285 */
    Object.defineProperty(this.data, "session", {
      get: () => {
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

      set: value => {
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
      await next();
    } finally {
      if (session === undefined) {
        /* Session not used. */
      } else if (session && Object.keys(session).length) {
        const encoded = encode(session);
        if (encoded !== cookie) {
          /* Only set session if it has changed. */
          cookies.set(name, encoded, { maxAge });
        }
      } else if (cookies.get(name, { signed: false })) {
        /* Session cookies were invalid. Clear session & signature. */
        cookies.set(name, null, { signed: false });
        cookies.set(name + ".sig", null, { signed: false });
      }
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLXNlc3Npb24uanMiXSwibmFtZXMiOlsicGFyc2VTZXNzaW9uIiwiZGVjb2RlIiwic3RyaW5nIiwiYm9keSIsIkJ1ZmZlciIsInRvU3RyaW5nIiwiSlNPTiIsInBhcnNlIiwiZW5jb2RlIiwic3RyaW5naWZ5IiwiZGF5IiwibmFtZSIsImtleXMiLCJtYXhBZ2UiLCJuZXh0Iiwic2Vzc2lvbiIsImNvb2tpZSIsInNvY2tldCIsInJlcXVlc3QiLCJzZWN1cmUiLCJlbmNyeXB0ZWQiLCJoZWFkZXJzIiwiY29va2llcyIsInJlc3BvbnNlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJkYXRhIiwiZ2V0IiwidW5kZWZpbmVkIiwiZXJyIiwic2V0IiwidmFsdWUiLCJUeXBlRXJyb3IiLCJsZW5ndGgiLCJlbmNvZGVkIiwic2lnbmVkIl0sIm1hcHBpbmdzIjoiOzs7OztrQkF3QndCQSxZOztBQXBCeEI7Ozs7OztBQUhBO0FBV0EsU0FBU0MsTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0I7QUFDdEIsUUFBTUMsT0FBTyxJQUFJQyxNQUFKLENBQVdGLE1BQVgsRUFBbUIsUUFBbkIsRUFBNkJHLFFBQTdCLENBQXNDLE1BQXRDLENBQWI7QUFDQSxTQUFPQyxLQUFLQyxLQUFMLENBQVdKLElBQVgsQ0FBUDtBQUNEOztBQUVELFNBQVNLLE1BQVQsQ0FBZ0JMLElBQWhCLEVBQXNCO0FBQ3BCLFFBQU1ELFNBQVNJLEtBQUtHLFNBQUwsQ0FBZU4sSUFBZixDQUFmO0FBQ0EsU0FBTyxJQUFJQyxNQUFKLENBQVdGLE1BQVgsRUFBbUJHLFFBQW5CLENBQTRCLFFBQTVCLENBQVA7QUFDRDs7QUFFRCxNQUFNSyxNQUFNLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUEzQjs7QUFFZSxTQUFTVixZQUFULENBQXNCLEVBQUNXLE9BQU8sTUFBUixFQUFnQkMsSUFBaEIsRUFBc0JDLFNBQVMsS0FBS0gsR0FBcEMsS0FBMkQsRUFBakYsRUFBaUc7QUFDOUcsU0FBTyxlQUFlVixZQUFmLENBQTRCYyxJQUE1QixFQUF3QztBQUM1QyxRQUFEOztBQUVBLFFBQUlDLE9BQUosRUFBYUMsTUFBYjtBQUNBLFVBQU1DLFNBQXFDLEtBQUtDLE9BQUwsQ0FBYUQsTUFBeEQ7QUFDQSxVQUFNRSxTQUFTRixPQUFPRyxTQUFQLElBQW9CLEtBQUtGLE9BQUwsQ0FBYUcsT0FBYixDQUFxQixtQkFBckIsTUFBOEMsT0FBakY7QUFDQSxVQUFNQyxVQUFVLHNCQUFZLEtBQUtKLE9BQWpCLEVBQTBCLEtBQUtLLFFBQS9CLEVBQXlDLEVBQUNYLElBQUQsRUFBT08sTUFBUCxFQUF6QyxDQUFoQjs7QUFFQTtBQUNBSyxXQUFPQyxjQUFQLENBQXNCLEtBQUtDLElBQTNCLEVBQWlDLFNBQWpDLEVBQTZDO0FBQzNDQyxXQUFLLE1BQU07QUFDVCxZQUFJWixZQUFZYSxTQUFoQixFQUEyQixPQUFPYixPQUFQOztBQUUzQkMsaUJBQVNNLFFBQVFLLEdBQVIsQ0FBWWhCLElBQVosRUFBa0IsRUFBQ0UsTUFBRCxFQUFsQixDQUFUO0FBQ0EsWUFBSUcsTUFBSixFQUFZO0FBQ1YsY0FBSTtBQUNGRCxzQkFBVWQsT0FBT2UsTUFBUCxDQUFWO0FBQ0QsV0FGRCxDQUVFLE9BQU9hLEdBQVAsRUFBWTtBQUNaZCxzQkFBVSxFQUFWO0FBQ0Q7QUFDRixTQU5ELE1BTU87QUFDTEEsb0JBQVUsRUFBVjtBQUNEOztBQUVELGVBQU9BLE9BQVA7QUFDRCxPQWhCMEM7O0FBa0IzQ2UsV0FBS0MsU0FBUztBQUNaLFlBQUksT0FBT0EsS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUM3QixnQkFBTSxJQUFJQyxTQUFKLENBQWMsMkJBQWQsQ0FBTjtBQUNEOztBQUVELFlBQUloQixXQUFXWSxTQUFmLEVBQTBCO0FBQ3hCWixtQkFBU00sUUFBUUssR0FBUixDQUFZaEIsSUFBWixFQUFrQixFQUFDRSxNQUFELEVBQWxCLENBQVQ7QUFDRDs7QUFFREUsa0JBQVVnQixLQUFWO0FBQ0Q7QUE1QjBDLEtBQTdDOztBQStCQSxRQUFJO0FBQ0YsWUFBTWpCLE1BQU47QUFDRCxLQUZELFNBRVU7QUFDUixVQUFJQyxZQUFZYSxTQUFoQixFQUEyQjtBQUN6QjtBQUNELE9BRkQsTUFFTyxJQUFJYixXQUFXUyxPQUFPWixJQUFQLENBQVlHLE9BQVosRUFBcUJrQixNQUFwQyxFQUE0QztBQUNqRCxjQUFNQyxVQUFVMUIsT0FBT08sT0FBUCxDQUFoQjtBQUNBLFlBQUltQixZQUFZbEIsTUFBaEIsRUFBd0I7QUFDdEI7QUFDQU0sa0JBQVFRLEdBQVIsQ0FBWW5CLElBQVosRUFBa0J1QixPQUFsQixFQUEyQixFQUFDckIsTUFBRCxFQUEzQjtBQUNEO0FBQ0YsT0FOTSxNQU1BLElBQUlTLFFBQVFLLEdBQVIsQ0FBWWhCLElBQVosRUFBa0IsRUFBQ3dCLFFBQVEsS0FBVCxFQUFsQixDQUFKLEVBQXdDO0FBQzdDO0FBQ0FiLGdCQUFRUSxHQUFSLENBQVluQixJQUFaLEVBQWtCLElBQWxCLEVBQXdCLEVBQUN3QixRQUFRLEtBQVQsRUFBeEI7QUFDQWIsZ0JBQVFRLEdBQVIsQ0FBWW5CLE9BQU8sTUFBbkIsRUFBMkIsSUFBM0IsRUFBaUMsRUFBQ3dCLFFBQVEsS0FBVCxFQUFqQztBQUNEO0FBQ0Y7QUFDRixHQXpERDtBQTBERCIsImZpbGUiOiJwYXJzZS1zZXNzaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuaW1wb3J0IENvb2tpZXMgZnJvbSBcImNvb2tpZXNcIlxuXG50eXBlIFNlc3Npb25PcHRpb25zID0ge1xuICBuYW1lPzogc3RyaW5nLFxuICBrZXlzPzogQXJyYXk8c3RyaW5nPixcbiAgbWF4QWdlPzogbnVtYmVyLFxufVxuXG5mdW5jdGlvbiBkZWNvZGUoc3RyaW5nKSB7XG4gIGNvbnN0IGJvZHkgPSBuZXcgQnVmZmVyKHN0cmluZywgXCJiYXNlNjRcIikudG9TdHJpbmcoXCJ1dGY4XCIpXG4gIHJldHVybiBKU09OLnBhcnNlKGJvZHkpXG59XG5cbmZ1bmN0aW9uIGVuY29kZShib2R5KSB7XG4gIGNvbnN0IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGJvZHkpXG4gIHJldHVybiBuZXcgQnVmZmVyKHN0cmluZykudG9TdHJpbmcoXCJiYXNlNjRcIilcbn1cblxuY29uc3QgZGF5ID0gMjQgKiA2MCAqIDYwICogMTAwMFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZVNlc3Npb24oe25hbWUgPSBcInNlc3NcIiwga2V5cywgbWF4QWdlID0gOTAgKiBkYXl9OiBTZXNzaW9uT3B0aW9ucyA9IHt9KTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBwYXJzZVNlc3Npb24obmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgbGV0IHNlc3Npb24sIGNvb2tpZVxuICAgIGNvbnN0IHNvY2tldDogdGxzJFRMU1NvY2tldCB8IG5ldCRTb2NrZXQgPSB0aGlzLnJlcXVlc3Quc29ja2V0XG4gICAgY29uc3Qgc2VjdXJlID0gc29ja2V0LmVuY3J5cHRlZCB8fCB0aGlzLnJlcXVlc3QuaGVhZGVyc1tcIngtZm9yd2FyZGVkLXByb3RvXCJdID09PSBcImh0dHBzXCJcbiAgICBjb25zdCBjb29raWVzID0gbmV3IENvb2tpZXModGhpcy5yZXF1ZXN0LCB0aGlzLnJlc3BvbnNlLCB7a2V5cywgc2VjdXJlfSlcblxuICAgIC8qIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8yODUgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5kYXRhLCBcInNlc3Npb25cIiwgKHtcbiAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICBpZiAoc2Vzc2lvbiAhPT0gdW5kZWZpbmVkKSByZXR1cm4gc2Vzc2lvblxuXG4gICAgICAgIGNvb2tpZSA9IGNvb2tpZXMuZ2V0KG5hbWUsIHttYXhBZ2V9KVxuICAgICAgICBpZiAoY29va2llKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNlc3Npb24gPSBkZWNvZGUoY29va2llKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc2Vzc2lvbiA9IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlc3Npb24gPSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlc3Npb25cbiAgICAgIH0sXG5cbiAgICAgIHNldDogdmFsdWUgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlNlc3Npb24gbXVzdCBiZSBhbiBvYmplY3RcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb29raWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvb2tpZSA9IGNvb2tpZXMuZ2V0KG5hbWUsIHttYXhBZ2V9KVxuICAgICAgICB9XG5cbiAgICAgICAgc2Vzc2lvbiA9IHZhbHVlXG4gICAgICB9LFxuICAgIH06IE9iamVjdCkpXG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmV4dCgpXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChzZXNzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLyogU2Vzc2lvbiBub3QgdXNlZC4gKi9cbiAgICAgIH0gZWxzZSBpZiAoc2Vzc2lvbiAmJiBPYmplY3Qua2V5cyhzZXNzaW9uKS5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgZW5jb2RlZCA9IGVuY29kZShzZXNzaW9uKVxuICAgICAgICBpZiAoZW5jb2RlZCAhPT0gY29va2llKSB7XG4gICAgICAgICAgLyogT25seSBzZXQgc2Vzc2lvbiBpZiBpdCBoYXMgY2hhbmdlZC4gKi9cbiAgICAgICAgICBjb29raWVzLnNldChuYW1lLCBlbmNvZGVkLCB7bWF4QWdlfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjb29raWVzLmdldChuYW1lLCB7c2lnbmVkOiBmYWxzZX0pKSB7XG4gICAgICAgIC8qIFNlc3Npb24gY29va2llcyB3ZXJlIGludmFsaWQuIENsZWFyIHNlc3Npb24gJiBzaWduYXR1cmUuICovXG4gICAgICAgIGNvb2tpZXMuc2V0KG5hbWUsIG51bGwsIHtzaWduZWQ6IGZhbHNlfSlcbiAgICAgICAgY29va2llcy5zZXQobmFtZSArIFwiLnNpZ1wiLCBudWxsLCB7c2lnbmVkOiBmYWxzZX0pXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=