"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stream = require("stream");

let BufferStream = class BufferStream extends _stream.Writable {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2J1ZmZlci1zdHJlYW0uanMiXSwibmFtZXMiOlsiQnVmZmVyU3RyZWFtIiwiYnVmZmVycyIsIl93cml0ZSIsImNodW5rIiwiZW5jb2RpbmciLCJjYWxsYmFjayIsIkJ1ZmZlciIsImZyb20iLCJwdXNoIiwiY2xlYXIiLCJsZW5ndGgiLCJpbnNwZWN0IiwiY29uY2F0IiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7SUFFcUJBLFksR0FBTixNQUFNQSxZQUFOLDBCQUFvQztBQUFBO0FBQUE7O0FBQUEsd0NBQ2pEQyxPQURpRCxHQUN4QixFQUR3QjtBQUFBOztBQUdqREMsU0FBT0MsS0FBUCxFQUErQkMsUUFBL0IsRUFBaURDLFFBQWpELEVBQXFFO0FBQ25FLFFBQUksT0FBT0YsS0FBUCxLQUFpQixRQUFyQixFQUErQkEsUUFBUUcsT0FBT0MsSUFBUCxDQUFZSixLQUFaLENBQVI7QUFDL0IsU0FBS0YsT0FBTCxDQUFhTyxJQUFiLENBQWtCTCxLQUFsQjtBQUNBRSxhQUFTLElBQVQ7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFFREksVUFBUTtBQUNOLFNBQUtSLE9BQUwsQ0FBYVMsTUFBYixHQUFzQixDQUF0QjtBQUNEOztBQUVEQyxZQUFVO0FBQ1IsV0FBT0wsT0FBT00sTUFBUCxDQUFjLEtBQUtYLE9BQW5CLEVBQTRCWSxRQUE1QixFQUFQO0FBQ0Q7O0FBRURBLGFBQVc7QUFDVCxXQUFPUCxPQUFPTSxNQUFQLENBQWMsS0FBS1gsT0FBbkIsRUFBNEJZLFFBQTVCLEVBQVA7QUFDRDtBQXBCZ0QsQztrQkFBOUJiLFkiLCJmaWxlIjoiYnVmZmVyLXN0cmVhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQge1dyaXRhYmxlfSBmcm9tIFwic3RyZWFtXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVmZmVyU3RyZWFtIGV4dGVuZHMgV3JpdGFibGUge1xuICBidWZmZXJzOiBBcnJheTxCdWZmZXI+ID0gW11cblxuICBfd3JpdGUoY2h1bms6IEJ1ZmZlciB8IHN0cmluZywgZW5jb2Rpbmc6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBjaHVuayA9PT0gXCJzdHJpbmdcIikgY2h1bmsgPSBCdWZmZXIuZnJvbShjaHVuaylcbiAgICB0aGlzLmJ1ZmZlcnMucHVzaChjaHVuaylcbiAgICBjYWxsYmFjayhudWxsKVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmJ1ZmZlcnMubGVuZ3RoID0gMFxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdCh0aGlzLmJ1ZmZlcnMpLnRvU3RyaW5nKClcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KHRoaXMuYnVmZmVycykudG9TdHJpbmcoKVxuICB9XG59XG4iXX0=