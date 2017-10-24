"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = write;

var _stream = require("stream");

function write() {
  return async function write(next) {
    this;

    await next();

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
  };
}
/* eslint-disable no-unused-expressions */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsIk9iamVjdCIsImZyZWV6ZSIsInNlbnQiLCJib2R5IiwicmVzcG9uc2UiLCJlbmQiLCJCdWZmZXIiLCJwaXBlIiwic2V0IiwiSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBTXdCQSxLOztBQUp4Qjs7QUFJZSxTQUFTQSxLQUFULEdBQTZCO0FBQzFDLFNBQU8sZUFBZUEsS0FBZixDQUFxQkMsSUFBckIsRUFBaUM7QUFDckMsUUFBRDs7QUFFQSxVQUFNQSxNQUFOOztBQUVBQyxXQUFPQyxNQUFQLENBQWMsSUFBZDs7QUFFQSxRQUFJLEtBQUtDLElBQVQsRUFBZTs7QUFFZixRQUFJLEtBQUtDLElBQUwsS0FBYyxJQUFsQixFQUF3QjtBQUN0QixXQUFLQyxRQUFMLENBQWNDLEdBQWQ7QUFDRCxLQUZELE1BRU8sSUFBSSxLQUFLRixJQUFMLFlBQXFCRyxNQUF6QixFQUFpQztBQUN0QyxXQUFLRixRQUFMLENBQWNDLEdBQWQsQ0FBa0IsS0FBS0YsSUFBdkI7QUFDRCxLQUZNLE1BRUEsSUFBSSxLQUFLQSxJQUFMLDRCQUFKLEVBQW1DO0FBQ3hDLFdBQUtBLElBQUwsQ0FBVUksSUFBVixDQUFlLEtBQUtILFFBQXBCO0FBQ0QsS0FGTSxNQUVBLElBQUksT0FBTyxLQUFLRCxJQUFaLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ3hDLFdBQUtDLFFBQUwsQ0FBY0MsR0FBZCxDQUFrQixLQUFLRixJQUF2QixFQUE2QixNQUE3QjtBQUNELEtBRk0sTUFFQTtBQUNMO0FBQ0EsV0FBS0ssR0FBTCxDQUFTLGNBQVQsRUFBeUIsa0JBQXpCO0FBQ0EsV0FBS0osUUFBTCxDQUFjQyxHQUFkLENBQWtCSSxLQUFLQyxTQUFMLENBQWUsS0FBS1AsSUFBcEIsQ0FBbEIsRUFBNkMsTUFBN0M7QUFDRDtBQUNGLEdBdEJEO0FBdUJEO0FBN0JEIiwiZmlsZSI6IndyaXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IHtSZWFkYWJsZX0gZnJvbSBcInN0cmVhbVwiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdyaXRlKCk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gd3JpdGUobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgYXdhaXQgbmV4dCgpXG5cbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG5cbiAgICBpZiAodGhpcy5zZW50KSByZXR1cm5cblxuICAgIGlmICh0aGlzLmJvZHkgPT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVzcG9uc2UuZW5kKClcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm9keSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgdGhpcy5yZXNwb25zZS5lbmQodGhpcy5ib2R5KVxuICAgIH0gZWxzZSBpZiAodGhpcy5ib2R5IGluc3RhbmNlb2YgUmVhZGFibGUpIHtcbiAgICAgIHRoaXMuYm9keS5waXBlKHRoaXMucmVzcG9uc2UpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5ib2R5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aGlzLnJlc3BvbnNlLmVuZCh0aGlzLmJvZHksIFwidXRmOFwiKVxuICAgIH0gZWxzZSB7XG4gICAgICAvKiBUcmVhdCBhcyBKU09OLiAqL1xuICAgICAgdGhpcy5zZXQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpXG4gICAgICB0aGlzLnJlc3BvbnNlLmVuZChKU09OLnN0cmluZ2lmeSh0aGlzLmJvZHkpLCBcInV0ZjhcIilcbiAgICB9XG4gIH1cbn1cbiJdfQ==