"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseBody;

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _contentType = require("content-type");

var _contentType2 = _interopRequireDefault(_contentType);

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function parseBody() {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      const ctx = this;

      const buffers = [];

      ctx.req.on("data", function (chunk) {
        buffers.push(chunk);
      });

      yield new Promise(function (resolve) {
        ctx.req.on("end", resolve);
      });

      const body = Buffer.concat(buffers);

      if (body.length) {
        let parsed;
        try {
          /* Guess the type of the content based on magic headers.
             This is a workaround for clients that accidentally set application/json
             Content-Type header when uploading images. */
          parsed = _contentType2.default.parse(guessType(ctx.req, body));
        } catch (err) {
          throw new _errors.BadRequest("Bad Content-Type header");
        }

        const { type, parameters: { charset = "utf-8" } } = parsed;

        if (charset.toLowerCase() !== "utf-8") {
          throw new _errors.UnsupportedMediaType(`Charset ${charset.toLowerCase()} is not supported`);
        }

        switch (type) {
          case "application/x-www-form-urlencoded":
            try {
              /* Validate query string? */
              ctx.data.body = _querystring2.default.parse(body.toString(), null, null, { maxKeys: 0 });
            } catch (err) {
              /* TODO: Throw error to client? */
              ctx.data.body = {};
            }
            break;

          case "application/json":
            try {
              ctx.data.body = JSON.parse(body.toString());
            } catch (err) {
              throw new _errors.BadRequest(err.message);
            }
            break;

          default:
            ctx.data.body = body;
        }
      }

      return yield next();
    });

    function parseBody(_x) {
      return _ref.apply(this, arguments);
    }

    return parseBody;
  })();
}

function guessType(req, body) {
  /* Detect GIF and PDF to provide better error messages. */
  const magic = {
    "image/png": Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    "image/jpeg": Buffer.from([0xff, 0xd8, 0xff]),
    "image/gif": Buffer.from([0x47, 0x49, 0x46]),
    "application/pdf": Buffer.from([0x25, 0x50, 0x44, 0x46])
  };

  if (body instanceof Buffer) {
    /* Check for magic headers of various binary files. */
    for (const type in magic) {
      let header = magic[type];
      if (body.slice(0, header.length).equals(header)) return type;
    }
  }

  return req.headers["content-type"] || "application/octet-stream";
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWJvZHkuanMiXSwibmFtZXMiOlsicGFyc2VCb2R5IiwibmV4dCIsImN0eCIsImJ1ZmZlcnMiLCJyZXEiLCJvbiIsInB1c2giLCJjaHVuayIsIlByb21pc2UiLCJyZXNvbHZlIiwiYm9keSIsIkJ1ZmZlciIsImNvbmNhdCIsImxlbmd0aCIsInBhcnNlZCIsInBhcnNlIiwiZ3Vlc3NUeXBlIiwiZXJyIiwidHlwZSIsInBhcmFtZXRlcnMiLCJjaGFyc2V0IiwidG9Mb3dlckNhc2UiLCJkYXRhIiwidG9TdHJpbmciLCJtYXhLZXlzIiwiSlNPTiIsIm1lc3NhZ2UiLCJtYWdpYyIsImZyb20iLCJoZWFkZXIiLCJzbGljZSIsImVxdWFscyIsImhlYWRlcnMiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQVF3QkEsUzs7QUFQeEI7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFJZSxTQUFTQSxTQUFULEdBQWlDO0FBQzlDO0FBQUEsaUNBQU8sV0FBeUJDLElBQXpCLEVBQXFDO0FBQzFDLFlBQU1DLE1BQWUsSUFBckI7O0FBRUEsWUFBTUMsVUFBVSxFQUFoQjs7QUFFQUQsVUFBSUUsR0FBSixDQUFRQyxFQUFSLENBQVcsTUFBWCxFQUFtQixpQkFBUztBQUMxQkYsZ0JBQVFHLElBQVIsQ0FBYUMsS0FBYjtBQUNELE9BRkQ7O0FBSUEsWUFBTSxJQUFJQyxPQUFKLENBQVksbUJBQVc7QUFDM0JOLFlBQUlFLEdBQUosQ0FBUUMsRUFBUixDQUFXLEtBQVgsRUFBa0JJLE9BQWxCO0FBQ0QsT0FGSyxDQUFOOztBQUlBLFlBQU1DLE9BQU9DLE9BQU9DLE1BQVAsQ0FBY1QsT0FBZCxDQUFiOztBQUVBLFVBQUlPLEtBQUtHLE1BQVQsRUFBaUI7QUFDZixZQUFJQyxNQUFKO0FBQ0EsWUFBSTtBQUNGOzs7QUFHQUEsbUJBQVMsc0JBQVlDLEtBQVosQ0FBa0JDLFVBQVVkLElBQUlFLEdBQWQsRUFBbUJNLElBQW5CLENBQWxCLENBQVQ7QUFDRCxTQUxELENBS0UsT0FBT08sR0FBUCxFQUFZO0FBQ1osZ0JBQU0sdUJBQWUseUJBQWYsQ0FBTjtBQUNEOztBQUVELGNBQU0sRUFBQ0MsSUFBRCxFQUFPQyxZQUFZLEVBQUNDLFVBQVUsT0FBWCxFQUFuQixLQUEwQ04sTUFBaEQ7O0FBRUEsWUFBSU0sUUFBUUMsV0FBUixPQUEwQixPQUE5QixFQUF1QztBQUNyQyxnQkFBTSxpQ0FBMEIsV0FBVUQsUUFBUUMsV0FBUixFQUFzQixtQkFBMUQsQ0FBTjtBQUNEOztBQUVELGdCQUFRSCxJQUFSO0FBQ0UsZUFBSyxtQ0FBTDtBQUNFLGdCQUFJO0FBQ0Y7QUFDQWhCLGtCQUFJb0IsSUFBSixDQUFTWixJQUFULEdBQWdCLHNCQUFZSyxLQUFaLENBQWtCTCxLQUFLYSxRQUFMLEVBQWxCLEVBQW1DLElBQW5DLEVBQXlDLElBQXpDLEVBQStDLEVBQUNDLFNBQVMsQ0FBVixFQUEvQyxDQUFoQjtBQUNELGFBSEQsQ0FHRSxPQUFPUCxHQUFQLEVBQVk7QUFDWjtBQUNBZixrQkFBSW9CLElBQUosQ0FBU1osSUFBVCxHQUFnQixFQUFoQjtBQUNEO0FBQ0Q7O0FBRUYsZUFBSyxrQkFBTDtBQUNFLGdCQUFJO0FBQ0ZSLGtCQUFJb0IsSUFBSixDQUFTWixJQUFULEdBQWdCZSxLQUFLVixLQUFMLENBQVdMLEtBQUthLFFBQUwsRUFBWCxDQUFoQjtBQUNELGFBRkQsQ0FFRSxPQUFPTixHQUFQLEVBQVk7QUFDWixvQkFBTSx1QkFBZUEsSUFBSVMsT0FBbkIsQ0FBTjtBQUNEO0FBQ0Q7O0FBRUY7QUFDRXhCLGdCQUFJb0IsSUFBSixDQUFTWixJQUFULEdBQWdCQSxJQUFoQjtBQXBCSjtBQXNCRDs7QUFFRCxhQUFPLE1BQU1ULE1BQWI7QUFDRCxLQXpERDs7QUFBQSxhQUFzQkQsU0FBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxTQUF0QjtBQUFBO0FBMEREOztBQUVELFNBQVNnQixTQUFULENBQW1CWixHQUFuQixFQUF3Qk0sSUFBeEIsRUFBOEI7QUFDNUI7QUFDQSxRQUFNaUIsUUFBUTtBQUNaLGlCQUFvQmhCLE9BQU9pQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWixDQURSO0FBRVosa0JBQW9CakIsT0FBT2lCLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUFaLENBRlI7QUFHWixpQkFBb0JqQixPQUFPaUIsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLENBQVosQ0FIUjtBQUlaLHVCQUFvQmpCLE9BQU9pQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWjtBQUpSLEdBQWQ7O0FBU0EsTUFBSWxCLGdCQUFnQkMsTUFBcEIsRUFBNEI7QUFDMUI7QUFDQSxTQUFLLE1BQU1PLElBQVgsSUFBbUJTLEtBQW5CLEVBQTBCO0FBQ3hCLFVBQUlFLFNBQVNGLE1BQU1ULElBQU4sQ0FBYjtBQUNBLFVBQUlSLEtBQUtvQixLQUFMLENBQVcsQ0FBWCxFQUFjRCxPQUFPaEIsTUFBckIsRUFBNkJrQixNQUE3QixDQUFvQ0YsTUFBcEMsQ0FBSixFQUFpRCxPQUFPWCxJQUFQO0FBQ2xEO0FBQ0Y7O0FBRUQsU0FBT2QsSUFBSTRCLE9BQUosQ0FBWSxjQUFaLEtBQStCLDBCQUF0QztBQUNEIiwiZmlsZSI6InBhcnNlLWJvZHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gXCJxdWVyeXN0cmluZ1wiXG5pbXBvcnQgY29udGVudFR5cGUgZnJvbSBcImNvbnRlbnQtdHlwZVwiXG5cbmltcG9ydCB7QmFkUmVxdWVzdCwgVW5zdXBwb3J0ZWRNZWRpYVR5cGV9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZUJvZHkoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBwYXJzZUJvZHkobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcblxuICAgIGNvbnN0IGJ1ZmZlcnMgPSBbXVxuXG4gICAgY3R4LnJlcS5vbihcImRhdGFcIiwgY2h1bmsgPT4ge1xuICAgICAgYnVmZmVycy5wdXNoKGNodW5rKVxuICAgIH0pXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGN0eC5yZXEub24oXCJlbmRcIiwgcmVzb2x2ZSlcbiAgICB9KVxuXG4gICAgY29uc3QgYm9keSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycylcblxuICAgIGlmIChib2R5Lmxlbmd0aCkge1xuICAgICAgbGV0IHBhcnNlZFxuICAgICAgdHJ5IHtcbiAgICAgICAgLyogR3Vlc3MgdGhlIHR5cGUgb2YgdGhlIGNvbnRlbnQgYmFzZWQgb24gbWFnaWMgaGVhZGVycy5cbiAgICAgICAgICAgVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIGNsaWVudHMgdGhhdCBhY2NpZGVudGFsbHkgc2V0IGFwcGxpY2F0aW9uL2pzb25cbiAgICAgICAgICAgQ29udGVudC1UeXBlIGhlYWRlciB3aGVuIHVwbG9hZGluZyBpbWFnZXMuICovXG4gICAgICAgIHBhcnNlZCA9IGNvbnRlbnRUeXBlLnBhcnNlKGd1ZXNzVHlwZShjdHgucmVxLCBib2R5KSlcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdChcIkJhZCBDb250ZW50LVR5cGUgaGVhZGVyXCIpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHt0eXBlLCBwYXJhbWV0ZXJzOiB7Y2hhcnNldCA9IFwidXRmLThcIn19ID0gcGFyc2VkXG5cbiAgICAgIGlmIChjaGFyc2V0LnRvTG93ZXJDYXNlKCkgIT09IFwidXRmLThcIikge1xuICAgICAgICB0aHJvdyBuZXcgVW5zdXBwb3J0ZWRNZWRpYVR5cGUoYENoYXJzZXQgJHtjaGFyc2V0LnRvTG93ZXJDYXNlKCl9IGlzIG5vdCBzdXBwb3J0ZWRgKVxuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKiBWYWxpZGF0ZSBxdWVyeSBzdHJpbmc/ICovXG4gICAgICAgICAgICBjdHguZGF0YS5ib2R5ID0gcXVlcnlzdHJpbmcucGFyc2UoYm9keS50b1N0cmluZygpLCBudWxsLCBudWxsLCB7bWF4S2V5czogMH0pXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvKiBUT0RPOiBUaHJvdyBlcnJvciB0byBjbGllbnQ/ICovXG4gICAgICAgICAgICBjdHguZGF0YS5ib2R5ID0ge31cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlIFwiYXBwbGljYXRpb24vanNvblwiOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjdHguZGF0YS5ib2R5ID0gSlNPTi5wYXJzZShib2R5LnRvU3RyaW5nKCkpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdChlcnIubWVzc2FnZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGN0eC5kYXRhLmJvZHkgPSBib2R5XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IG5leHQoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGd1ZXNzVHlwZShyZXEsIGJvZHkpIHtcbiAgLyogRGV0ZWN0IEdJRiBhbmQgUERGIHRvIHByb3ZpZGUgYmV0dGVyIGVycm9yIG1lc3NhZ2VzLiAqL1xuICBjb25zdCBtYWdpYyA9IHtcbiAgICBcImltYWdlL3BuZ1wiOiAgICAgICAgQnVmZmVyLmZyb20oWzB4ODksIDB4NTAsIDB4NGUsIDB4NDddKSxcbiAgICBcImltYWdlL2pwZWdcIjogICAgICAgQnVmZmVyLmZyb20oWzB4ZmYsIDB4ZDgsIDB4ZmZdKSxcbiAgICBcImltYWdlL2dpZlwiOiAgICAgICAgQnVmZmVyLmZyb20oWzB4NDcsIDB4NDksIDB4NDZdKSxcbiAgICBcImFwcGxpY2F0aW9uL3BkZlwiOiAgQnVmZmVyLmZyb20oWzB4MjUsIDB4NTAsIDB4NDQsIDB4NDZdKSxcbiAgICAvKiBUT0RPOiBBc3N1bWUgJ3tcIicgbWVhbnMgd2UgaGF2ZSBKU09OPyAqL1xuICAgIC8vIFwiYXBwbGljYXRpb24vanNvblwiOiBCdWZmZXIuZnJvbShbMHg3YiwgMHgyMl0pLFxuICB9XG5cbiAgaWYgKGJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAvKiBDaGVjayBmb3IgbWFnaWMgaGVhZGVycyBvZiB2YXJpb3VzIGJpbmFyeSBmaWxlcy4gKi9cbiAgICBmb3IgKGNvbnN0IHR5cGUgaW4gbWFnaWMpIHtcbiAgICAgIGxldCBoZWFkZXIgPSBtYWdpY1t0eXBlXVxuICAgICAgaWYgKGJvZHkuc2xpY2UoMCwgaGVhZGVyLmxlbmd0aCkuZXF1YWxzKGhlYWRlcikpIHJldHVybiB0eXBlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcS5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdIHx8IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbn1cbiJdfQ==