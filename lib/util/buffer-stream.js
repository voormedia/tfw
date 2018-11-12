"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BufferStream = undefined;

var _stream = require("stream");

let BufferStream = exports.BufferStream = class BufferStream extends _stream.Writable {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.buffers = [], _temp;
  }

  _write(chunk, encoding, callback) {
    if (typeof chunk === "string") chunk = Buffer.from(chunk);
    this.buffers.push(chunk);
    callback(null);
    return true;
  }

  clear() {
    this.buffers.length = 0;
  }

  inspect() {
    return Buffer.concat(this.buffers).toString();
  }

  toString() {
    return Buffer.concat(this.buffers).toString();
  }
};
exports.default = BufferStream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2J1ZmZlci1zdHJlYW0uanMiXSwibmFtZXMiOlsiQnVmZmVyU3RyZWFtIiwiV3JpdGFibGUiLCJidWZmZXJzIiwiX3dyaXRlIiwiY2h1bmsiLCJlbmNvZGluZyIsImNhbGxiYWNrIiwiQnVmZmVyIiwiZnJvbSIsInB1c2giLCJjbGVhciIsImxlbmd0aCIsImluc3BlY3QiLCJjb25jYXQiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztJQUVhQSxZLFdBQUFBLFksR0FBTixNQUFNQSxZQUFOLFNBQTJCQyxnQkFBM0IsQ0FBb0M7QUFBQTtBQUFBOztBQUFBLHdDQUN6Q0MsT0FEeUMsR0FDaEIsRUFEZ0I7QUFBQTs7QUFHekNDLFNBQU9DLEtBQVAsRUFBK0JDLFFBQS9CLEVBQWlEQyxRQUFqRCxFQUFxRTtBQUNuRSxRQUFJLE9BQU9GLEtBQVAsS0FBaUIsUUFBckIsRUFBK0JBLFFBQVFHLE9BQU9DLElBQVAsQ0FBWUosS0FBWixDQUFSO0FBQy9CLFNBQUtGLE9BQUwsQ0FBYU8sSUFBYixDQUFrQkwsS0FBbEI7QUFDQUUsYUFBUyxJQUFUO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRURJLFVBQVE7QUFDTixTQUFLUixPQUFMLENBQWFTLE1BQWIsR0FBc0IsQ0FBdEI7QUFDRDs7QUFFREMsWUFBVTtBQUNSLFdBQU9MLE9BQU9NLE1BQVAsQ0FBYyxLQUFLWCxPQUFuQixFQUE0QlksUUFBNUIsRUFBUDtBQUNEOztBQUVEQSxhQUFXO0FBQ1QsV0FBT1AsT0FBT00sTUFBUCxDQUFjLEtBQUtYLE9BQW5CLEVBQTRCWSxRQUE1QixFQUFQO0FBQ0Q7QUFwQndDLEM7a0JBdUI1QmQsWSIsImZpbGUiOiJidWZmZXItc3RyZWFtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCB7V3JpdGFibGV9IGZyb20gXCJzdHJlYW1cIlxuXG5leHBvcnQgY2xhc3MgQnVmZmVyU3RyZWFtIGV4dGVuZHMgV3JpdGFibGUge1xuICBidWZmZXJzOiBBcnJheTxCdWZmZXI+ID0gW11cblxuICBfd3JpdGUoY2h1bms6IEJ1ZmZlciB8IHN0cmluZywgZW5jb2Rpbmc6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBjaHVuayA9PT0gXCJzdHJpbmdcIikgY2h1bmsgPSBCdWZmZXIuZnJvbShjaHVuaylcbiAgICB0aGlzLmJ1ZmZlcnMucHVzaChjaHVuaylcbiAgICBjYWxsYmFjayhudWxsKVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmJ1ZmZlcnMubGVuZ3RoID0gMFxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdCh0aGlzLmJ1ZmZlcnMpLnRvU3RyaW5nKClcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KHRoaXMuYnVmZmVycykudG9TdHJpbmcoKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1ZmZlclN0cmVhbVxuIl19