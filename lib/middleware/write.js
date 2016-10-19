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

      /* https://github.com/facebook/flow/issues/285 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3dyaXRlLmpzIl0sIm5hbWVzIjpbIndyaXRlIiwibmV4dCIsInNldEhlYWRlcnMiLCJuYW1lIiwidmFsdWUiLCJjdHgiLCJoZWFkZXJzIiwicmVzIiwic2V0SGVhZGVyIiwic3RyZWFtaW5nIiwic3RyZWFtIiwid3JpdGVIZWFkIiwic3RhdHVzIiwicGlwZSIsImJvZHkiLCJCdWZmZXIiLCJhbGxvYyIsImZyb20iLCJzZXQiLCJKU09OIiwic3RyaW5naWZ5IiwibGVuZ3RoIiwiYnl0ZUxlbmd0aCIsInRvU3RyaW5nIiwiZW5kIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFNd0JBLEs7Ozs7QUFBVCxTQUFTQSxLQUFULEdBQTZCO0FBQzFDO0FBQUEsaUNBQU8sV0FBcUJDLElBQXJCLEVBQWlDO0FBQ3RDLGVBQVNDLFVBQVQsR0FBc0I7QUFDcEIsYUFBSyxNQUFNLENBQUNDLElBQUQsRUFBT0MsS0FBUCxDQUFYLElBQTRCQyxJQUFJQyxPQUFoQyxFQUF5QztBQUN2Q0QsY0FBSUUsR0FBSixDQUFRQyxTQUFSLENBQWtCTCxJQUFsQixFQUF3QkMsS0FBeEI7QUFDRDtBQUNGOztBQUVELFlBQU1DLE1BQWUsSUFBckI7O0FBRUEsVUFBSUksWUFBWSxLQUFoQjs7QUFFQTtBQUNBSixVQUFJSyxNQUFKLEdBQWEsa0JBQVU7QUFDckI7QUFDQVI7QUFDQUcsWUFBSUUsR0FBSixDQUFRSSxTQUFSLENBQWtCTixJQUFJTyxNQUF0QjtBQUNBRixlQUFPRyxJQUFQLENBQVlSLElBQUlFLEdBQWhCO0FBQ0FFLG9CQUFZLElBQVo7QUFDRCxPQU5EOztBQVFBLFlBQU1SLE1BQU47O0FBRUEsVUFBSVEsU0FBSixFQUFlOztBQUVmLFVBQUlKLElBQUlTLElBQUosS0FBYSxJQUFqQixFQUF1QjtBQUNyQlQsWUFBSVMsSUFBSixHQUFXQyxPQUFPQyxLQUFQLENBQWEsQ0FBYixDQUFYO0FBQ0QsT0FGRCxNQUVPLElBQUksT0FBT1gsSUFBSVMsSUFBWCxLQUFvQixRQUF4QixFQUFrQztBQUN2Q1QsWUFBSVMsSUFBSixHQUFXQyxPQUFPRSxJQUFQLENBQVlaLElBQUlTLElBQWhCLEVBQXNCLE1BQXRCLENBQVg7QUFDRCxPQUZNLE1BRUEsSUFBSVQsSUFBSVMsSUFBSixZQUFvQkMsTUFBeEIsRUFBZ0M7QUFDckM7QUFDRCxPQUZNLE1BRUE7QUFDTDtBQUNBVixZQUFJQyxPQUFKLENBQVlZLEdBQVosQ0FBZ0IsY0FBaEIsRUFBZ0Msa0JBQWhDO0FBQ0FiLFlBQUlTLElBQUosR0FBV0MsT0FBT0UsSUFBUCxDQUFZRSxLQUFLQyxTQUFMLENBQWVmLElBQUlTLElBQW5CLENBQVosRUFBc0MsTUFBdEMsQ0FBWDtBQUNEOztBQUVEWjs7QUFFQSxVQUFJRyxJQUFJUyxJQUFKLENBQVNPLE1BQWIsRUFBcUI7QUFDbkJoQixZQUFJRSxHQUFKLENBQVFDLFNBQVIsQ0FBa0IsZ0JBQWxCLEVBQW9DTyxPQUFPTyxVQUFQLENBQWtCakIsSUFBSVMsSUFBdEIsRUFBNEJTLFFBQTVCLEVBQXBDO0FBQ0Q7O0FBRURsQixVQUFJRSxHQUFKLENBQVFJLFNBQVIsQ0FBa0JOLElBQUlPLE1BQXRCO0FBQ0FQLFVBQUlFLEdBQUosQ0FBUWlCLEdBQVIsQ0FBWW5CLElBQUlTLElBQWhCO0FBQ0QsS0E1Q0Q7O0FBQUEsYUFBc0JkLEtBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsS0FBdEI7QUFBQTtBQTZDRDtBQW5ERCIsImZpbGUiOiJ3cml0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vLyBpbXBvcnQge1JlYWRhYmxlfSBmcm9tIFwic3RyZWFtXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3cml0ZSgpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHdyaXRlKG5leHQ6IE5leHQpIHtcbiAgICBmdW5jdGlvbiBzZXRIZWFkZXJzKCkge1xuICAgICAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIGN0eC5oZWFkZXJzKSB7XG4gICAgICAgIGN0eC5yZXMuc2V0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcblxuICAgIGxldCBzdHJlYW1pbmcgPSBmYWxzZVxuXG4gICAgLyogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvaXNzdWVzLzI4NSAqL1xuICAgIGN0eC5zdHJlYW0gPSBzdHJlYW0gPT4ge1xuICAgICAgLy8gaWYgKHN0cmVhbSBpbnN0YW5jZW9mIFJlYWRhYmxlKSB0aHJvdyBuZXcgRXJyb3JcbiAgICAgIHNldEhlYWRlcnMoKVxuICAgICAgY3R4LnJlcy53cml0ZUhlYWQoY3R4LnN0YXR1cylcbiAgICAgIHN0cmVhbS5waXBlKGN0eC5yZXMpXG4gICAgICBzdHJlYW1pbmcgPSB0cnVlXG4gICAgfVxuXG4gICAgYXdhaXQgbmV4dCgpXG5cbiAgICBpZiAoc3RyZWFtaW5nKSByZXR1cm5cblxuICAgIGlmIChjdHguYm9keSA9PT0gbnVsbCkge1xuICAgICAgY3R4LmJvZHkgPSBCdWZmZXIuYWxsb2MoMClcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjdHguYm9keSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgY3R4LmJvZHkgPSBCdWZmZXIuZnJvbShjdHguYm9keSwgXCJ1dGY4XCIpXG4gICAgfSBlbHNlIGlmIChjdHguYm9keSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgLyogVXNlIGFzIGlzLiAqL1xuICAgIH0gZWxzZSB7XG4gICAgICAvKiBUcmVhdCBhcyBKU09OLiAqL1xuICAgICAgY3R4LmhlYWRlcnMuc2V0KFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKVxuICAgICAgY3R4LmJvZHkgPSBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShjdHguYm9keSksIFwidXRmOFwiKVxuICAgIH1cblxuICAgIHNldEhlYWRlcnMoKVxuXG4gICAgaWYgKGN0eC5ib2R5Lmxlbmd0aCkge1xuICAgICAgY3R4LnJlcy5zZXRIZWFkZXIoXCJDb250ZW50LUxlbmd0aFwiLCBCdWZmZXIuYnl0ZUxlbmd0aChjdHguYm9keSkudG9TdHJpbmcoKSlcbiAgICB9XG5cbiAgICBjdHgucmVzLndyaXRlSGVhZChjdHguc3RhdHVzKVxuICAgIGN0eC5yZXMuZW5kKGN0eC5ib2R5KVxuICB9XG59XG4iXX0=