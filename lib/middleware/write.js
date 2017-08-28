"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = write;

var _stream = require("stream");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
/* eslint-disable no-unused-expressions */


function write() {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      this;

      yield next();

      Object.freeze(this);

      if (this.sent) return;

      if (this.body === null) {
        this.response.end();
      } else if (this.body instanceof Buffer) {
        this.response.end(this.body);
      } else if (this.body instanceof _stream.Readable) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsIk9iamVjdCIsImZyZWV6ZSIsInNlbnQiLCJib2R5IiwicmVzcG9uc2UiLCJlbmQiLCJCdWZmZXIiLCJwaXBlIiwic2V0IiwiSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBTXdCQSxLOztBQUp4Qjs7O0FBREE7OztBQUtlLFNBQVNBLEtBQVQsR0FBNkI7QUFDMUM7QUFBQSxpQ0FBTyxXQUFxQkMsSUFBckIsRUFBaUM7QUFDckMsVUFBRDs7QUFFQSxZQUFNQSxNQUFOOztBQUVBQyxhQUFPQyxNQUFQLENBQWMsSUFBZDs7QUFFQSxVQUFJLEtBQUtDLElBQVQsRUFBZTs7QUFFZixVQUFJLEtBQUtDLElBQUwsS0FBYyxJQUFsQixFQUF3QjtBQUN0QixhQUFLQyxRQUFMLENBQWNDLEdBQWQ7QUFDRCxPQUZELE1BRU8sSUFBSSxLQUFLRixJQUFMLFlBQXFCRyxNQUF6QixFQUFpQztBQUN0QyxhQUFLRixRQUFMLENBQWNDLEdBQWQsQ0FBa0IsS0FBS0YsSUFBdkI7QUFDRCxPQUZNLE1BRUEsSUFBSSxLQUFLQSxJQUFMLDRCQUFKLEVBQW1DO0FBQ3hDLGFBQUtBLElBQUwsQ0FBVUksSUFBVixDQUFlLEtBQUtILFFBQXBCO0FBQ0QsT0FGTSxNQUVBLElBQUksT0FBTyxLQUFLRCxJQUFaLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ3hDLGFBQUtDLFFBQUwsQ0FBY0MsR0FBZCxDQUFrQixLQUFLRixJQUF2QixFQUE2QixNQUE3QjtBQUNELE9BRk0sTUFFQTtBQUNMO0FBQ0EsYUFBS0ssR0FBTCxDQUFTLGNBQVQsRUFBeUIsa0JBQXpCO0FBQ0EsYUFBS0osUUFBTCxDQUFjQyxHQUFkLENBQWtCSSxLQUFLQyxTQUFMLENBQWUsS0FBS1AsSUFBcEIsQ0FBbEIsRUFBNkMsTUFBN0M7QUFDRDtBQUNGLEtBdEJEOztBQUFBLGFBQXNCTCxLQUF0QjtBQUFBO0FBQUE7O0FBQUEsV0FBc0JBLEtBQXRCO0FBQUE7QUF1QkQiLCJmaWxlIjoid3JpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQge1JlYWRhYmxlfSBmcm9tIFwic3RyZWFtXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd3JpdGUoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiB3cml0ZShuZXh0OiBOZXh0KSB7XG4gICAgKHRoaXM6IENvbnRleHQpXG5cbiAgICBhd2FpdCBuZXh0KClcblxuICAgIE9iamVjdC5mcmVlemUodGhpcylcblxuICAgIGlmICh0aGlzLnNlbnQpIHJldHVyblxuXG4gICAgaWYgKHRoaXMuYm9keSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5yZXNwb25zZS5lbmQoKVxuICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5IGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgICB0aGlzLnJlc3BvbnNlLmVuZCh0aGlzLmJvZHkpXG4gICAgfSBlbHNlIGlmICh0aGlzLmJvZHkgaW5zdGFuY2VvZiBSZWFkYWJsZSkge1xuICAgICAgdGhpcy5ib2R5LnBpcGUodGhpcy5yZXNwb25zZSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmJvZHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRoaXMucmVzcG9uc2UuZW5kKHRoaXMuYm9keSwgXCJ1dGY4XCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8qIFRyZWF0IGFzIEpTT04uICovXG4gICAgICB0aGlzLnNldChcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIilcbiAgICAgIHRoaXMucmVzcG9uc2UuZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuYm9keSksIFwidXRmOFwiKVxuICAgIH1cbiAgfVxufVxuIl19