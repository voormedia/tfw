"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = write;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function write() {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      function setHeaders() {
        for (const [name, value] of ctx.headers) {
          ctx.res.setHeader(name, value);
        }
      }

      const ctx = this;

      let streaming = false;

      ctx.stream = function (stream) {
        // if (stream instanceof Readable) throw new Error
        setHeaders();
        ctx.res.writeHead(ctx.status);
        stream.pipe(ctx.res);
        streaming = true;
      };

      yield next();

      if (streaming) return;

      if (ctx.body === null) {
        ctx.body = Buffer.alloc(0);
      } else if (typeof ctx.body === "string") {
        ctx.body = Buffer.from(ctx.body, "utf8");
      } else if (ctx.body instanceof Buffer) {
        /* Use as is. */
      } else {
        /* Treat as JSON. */
        ctx.headers.set("Content-Type", "application/json");
        ctx.body = Buffer.from(JSON.stringify(ctx.body), "utf8");
      }

      setHeaders();

      if (ctx.body.length) {
        ctx.res.setHeader("Content-Length", Buffer.byteLength(ctx.body).toString());
      }

      ctx.res.writeHead(ctx.status);
      ctx.res.end(ctx.body);
    });

    function write(_x) {
      return _ref.apply(this, arguments);
    }

    return write;
  })();
}
// import {Readable} from "stream"
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsInNldEhlYWRlcnMiLCJuYW1lIiwidmFsdWUiLCJjdHgiLCJoZWFkZXJzIiwicmVzIiwic2V0SGVhZGVyIiwic3RyZWFtaW5nIiwic3RyZWFtIiwid3JpdGVIZWFkIiwic3RhdHVzIiwicGlwZSIsImJvZHkiLCJCdWZmZXIiLCJhbGxvYyIsImZyb20iLCJzZXQiLCJKU09OIiwic3RyaW5naWZ5IiwibGVuZ3RoIiwiYnl0ZUxlbmd0aCIsInRvU3RyaW5nIiwiZW5kIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFNd0JBLEs7Ozs7QUFBVCxTQUFTQSxLQUFULEdBQTZCO0FBQzFDO0FBQUEsaUNBQU8sV0FBcUJDLElBQXJCLEVBQWlDO0FBQ3RDLGVBQVNDLFVBQVQsR0FBc0I7QUFDcEIsYUFBSyxNQUFNLENBQUNDLElBQUQsRUFBT0MsS0FBUCxDQUFYLElBQTRCQyxJQUFJQyxPQUFoQyxFQUF5QztBQUN2Q0QsY0FBSUUsR0FBSixDQUFRQyxTQUFSLENBQWtCTCxJQUFsQixFQUF3QkMsS0FBeEI7QUFDRDtBQUNGOztBQUVELFlBQU1DLE1BQWUsSUFBckI7O0FBRUEsVUFBSUksWUFBWSxLQUFoQjs7QUFFQUosVUFBSUssTUFBSixHQUFhLGtCQUFVO0FBQ3JCO0FBQ0FSO0FBQ0FHLFlBQUlFLEdBQUosQ0FBUUksU0FBUixDQUFrQk4sSUFBSU8sTUFBdEI7QUFDQUYsZUFBT0csSUFBUCxDQUFZUixJQUFJRSxHQUFoQjtBQUNBRSxvQkFBWSxJQUFaO0FBQ0QsT0FORDs7QUFRQSxZQUFNUixNQUFOOztBQUVBLFVBQUlRLFNBQUosRUFBZTs7QUFFZixVQUFJSixJQUFJUyxJQUFKLEtBQWEsSUFBakIsRUFBdUI7QUFDckJULFlBQUlTLElBQUosR0FBV0MsT0FBT0MsS0FBUCxDQUFhLENBQWIsQ0FBWDtBQUNELE9BRkQsTUFFTyxJQUFJLE9BQU9YLElBQUlTLElBQVgsS0FBb0IsUUFBeEIsRUFBa0M7QUFDdkNULFlBQUlTLElBQUosR0FBV0MsT0FBT0UsSUFBUCxDQUFZWixJQUFJUyxJQUFoQixFQUFzQixNQUF0QixDQUFYO0FBQ0QsT0FGTSxNQUVBLElBQUlULElBQUlTLElBQUosWUFBb0JDLE1BQXhCLEVBQWdDO0FBQ3JDO0FBQ0QsT0FGTSxNQUVBO0FBQ0w7QUFDQVYsWUFBSUMsT0FBSixDQUFZWSxHQUFaLENBQWdCLGNBQWhCLEVBQWdDLGtCQUFoQztBQUNBYixZQUFJUyxJQUFKLEdBQVdDLE9BQU9FLElBQVAsQ0FBWUUsS0FBS0MsU0FBTCxDQUFlZixJQUFJUyxJQUFuQixDQUFaLEVBQXNDLE1BQXRDLENBQVg7QUFDRDs7QUFFRFo7O0FBRUEsVUFBSUcsSUFBSVMsSUFBSixDQUFTTyxNQUFiLEVBQXFCO0FBQ25CaEIsWUFBSUUsR0FBSixDQUFRQyxTQUFSLENBQWtCLGdCQUFsQixFQUFvQ08sT0FBT08sVUFBUCxDQUFrQmpCLElBQUlTLElBQXRCLEVBQTRCUyxRQUE1QixFQUFwQztBQUNEOztBQUVEbEIsVUFBSUUsR0FBSixDQUFRSSxTQUFSLENBQWtCTixJQUFJTyxNQUF0QjtBQUNBUCxVQUFJRSxHQUFKLENBQVFpQixHQUFSLENBQVluQixJQUFJUyxJQUFoQjtBQUNELEtBM0NEOztBQUFBLGFBQXNCZCxLQUF0QjtBQUFBO0FBQUE7O0FBQUEsV0FBc0JBLEtBQXRCO0FBQUE7QUE0Q0Q7QUFsREQiLCJmaWxlIjoid3JpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLy8gaW1wb3J0IHtSZWFkYWJsZX0gZnJvbSBcInN0cmVhbVwiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd3JpdGUoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiB3cml0ZShuZXh0OiBOZXh0KSB7XG4gICAgZnVuY3Rpb24gc2V0SGVhZGVycygpIHtcbiAgICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiBjdHguaGVhZGVycykge1xuICAgICAgICBjdHgucmVzLnNldEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjdHg6IENvbnRleHQgPSB0aGlzXG5cbiAgICBsZXQgc3RyZWFtaW5nID0gZmFsc2VcblxuICAgIGN0eC5zdHJlYW0gPSBzdHJlYW0gPT4ge1xuICAgICAgLy8gaWYgKHN0cmVhbSBpbnN0YW5jZW9mIFJlYWRhYmxlKSB0aHJvdyBuZXcgRXJyb3JcbiAgICAgIHNldEhlYWRlcnMoKVxuICAgICAgY3R4LnJlcy53cml0ZUhlYWQoY3R4LnN0YXR1cylcbiAgICAgIHN0cmVhbS5waXBlKGN0eC5yZXMpXG4gICAgICBzdHJlYW1pbmcgPSB0cnVlXG4gICAgfVxuXG4gICAgYXdhaXQgbmV4dCgpXG5cbiAgICBpZiAoc3RyZWFtaW5nKSByZXR1cm5cblxuICAgIGlmIChjdHguYm9keSA9PT0gbnVsbCkge1xuICAgICAgY3R4LmJvZHkgPSBCdWZmZXIuYWxsb2MoMClcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjdHguYm9keSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgY3R4LmJvZHkgPSBCdWZmZXIuZnJvbShjdHguYm9keSwgXCJ1dGY4XCIpXG4gICAgfSBlbHNlIGlmIChjdHguYm9keSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgLyogVXNlIGFzIGlzLiAqL1xuICAgIH0gZWxzZSB7XG4gICAgICAvKiBUcmVhdCBhcyBKU09OLiAqL1xuICAgICAgY3R4LmhlYWRlcnMuc2V0KFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKVxuICAgICAgY3R4LmJvZHkgPSBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShjdHguYm9keSksIFwidXRmOFwiKVxuICAgIH1cblxuICAgIHNldEhlYWRlcnMoKVxuXG4gICAgaWYgKGN0eC5ib2R5Lmxlbmd0aCkge1xuICAgICAgY3R4LnJlcy5zZXRIZWFkZXIoXCJDb250ZW50LUxlbmd0aFwiLCBCdWZmZXIuYnl0ZUxlbmd0aChjdHguYm9keSkudG9TdHJpbmcoKSlcbiAgICB9XG5cbiAgICBjdHgucmVzLndyaXRlSGVhZChjdHguc3RhdHVzKVxuICAgIGN0eC5yZXMuZW5kKGN0eC5ib2R5KVxuICB9XG59XG4iXX0=