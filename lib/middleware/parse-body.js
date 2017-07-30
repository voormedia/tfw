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
    /* TODO: Assume '{"' means we have JSON? */
    // "application/json": Buffer.from([0x7b, 0x22]),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWJvZHkuanMiXSwibmFtZXMiOlsicGFyc2VCb2R5IiwibmV4dCIsImN0eCIsImJ1ZmZlcnMiLCJyZXEiLCJvbiIsInB1c2giLCJjaHVuayIsIlByb21pc2UiLCJyZXNvbHZlIiwiYm9keSIsIkJ1ZmZlciIsImNvbmNhdCIsImxlbmd0aCIsInBhcnNlZCIsInBhcnNlIiwiZ3Vlc3NUeXBlIiwiZXJyIiwidHlwZSIsInBhcmFtZXRlcnMiLCJjaGFyc2V0IiwidG9Mb3dlckNhc2UiLCJkYXRhIiwidG9TdHJpbmciLCJtYXhLZXlzIiwiSlNPTiIsIm1lc3NhZ2UiLCJtYWdpYyIsImZyb20iLCJoZWFkZXIiLCJzbGljZSIsImVxdWFscyIsImhlYWRlcnMiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQVF3QkEsUzs7QUFQeEI7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFJZSxTQUFTQSxTQUFULEdBQWlDO0FBQzlDO0FBQUEsaUNBQU8sV0FBeUJDLElBQXpCLEVBQXFDO0FBQzFDLFlBQU1DLE1BQWUsSUFBckI7O0FBRUEsWUFBTUMsVUFBVSxFQUFoQjs7QUFFQUQsVUFBSUUsR0FBSixDQUFRQyxFQUFSLENBQVcsTUFBWCxFQUFtQixpQkFBUztBQUMxQkYsZ0JBQVFHLElBQVIsQ0FBYUMsS0FBYjtBQUNELE9BRkQ7O0FBSUEsWUFBTSxJQUFJQyxPQUFKLENBQVksbUJBQVc7QUFDM0JOLFlBQUlFLEdBQUosQ0FBUUMsRUFBUixDQUFXLEtBQVgsRUFBa0JJLE9BQWxCO0FBQ0QsT0FGSyxDQUFOOztBQUlBLFlBQU1DLE9BQU9DLE9BQU9DLE1BQVAsQ0FBY1QsT0FBZCxDQUFiOztBQUVBLFVBQUlPLEtBQUtHLE1BQVQsRUFBaUI7QUFDZixZQUFJQyxNQUFKO0FBQ0EsWUFBSTtBQUNGOzs7QUFHQUEsbUJBQVMsc0JBQVlDLEtBQVosQ0FBa0JDLFVBQVVkLElBQUlFLEdBQWQsRUFBbUJNLElBQW5CLENBQWxCLENBQVQ7QUFDRCxTQUxELENBS0UsT0FBT08sR0FBUCxFQUFZO0FBQ1osZ0JBQU0sdUJBQWUseUJBQWYsQ0FBTjtBQUNEOztBQUVELGNBQU0sRUFBQ0MsSUFBRCxFQUFPQyxZQUFZLEVBQUNDLFVBQVUsT0FBWCxFQUFuQixLQUEwQ04sTUFBaEQ7O0FBRUEsWUFBSU0sUUFBUUMsV0FBUixPQUEwQixPQUE5QixFQUF1QztBQUNyQyxnQkFBTSxpQ0FBMEIsV0FBVUQsUUFBUUMsV0FBUixFQUFzQixtQkFBMUQsQ0FBTjtBQUNEOztBQUVELGdCQUFRSCxJQUFSO0FBQ0UsZUFBSyxtQ0FBTDtBQUNFLGdCQUFJO0FBQ0Y7QUFDQWhCLGtCQUFJb0IsSUFBSixDQUFTWixJQUFULEdBQWdCLHNCQUFZSyxLQUFaLENBQWtCTCxLQUFLYSxRQUFMLEVBQWxCLEVBQW1DLElBQW5DLEVBQXlDLElBQXpDLEVBQStDLEVBQUNDLFNBQVMsQ0FBVixFQUEvQyxDQUFoQjtBQUNELGFBSEQsQ0FHRSxPQUFPUCxHQUFQLEVBQVk7QUFDWjtBQUNBZixrQkFBSW9CLElBQUosQ0FBU1osSUFBVCxHQUFnQixFQUFoQjtBQUNEO0FBQ0Q7O0FBRUYsZUFBSyxrQkFBTDtBQUNFLGdCQUFJO0FBQ0ZSLGtCQUFJb0IsSUFBSixDQUFTWixJQUFULEdBQWdCZSxLQUFLVixLQUFMLENBQVdMLEtBQUthLFFBQUwsRUFBWCxDQUFoQjtBQUNELGFBRkQsQ0FFRSxPQUFPTixHQUFQLEVBQVk7QUFDWixvQkFBTSx1QkFBZUEsSUFBSVMsT0FBbkIsQ0FBTjtBQUNEO0FBQ0Q7O0FBRUY7QUFDRXhCLGdCQUFJb0IsSUFBSixDQUFTWixJQUFULEdBQWdCQSxJQUFoQjtBQXBCSjtBQXNCRDs7QUFFRCxhQUFPLE1BQU1ULE1BQWI7QUFDRCxLQXpERDs7QUFBQSxhQUFzQkQsU0FBdEI7QUFBQTtBQUFBOztBQUFBLFdBQXNCQSxTQUF0QjtBQUFBO0FBMEREOztBQUVELFNBQVNnQixTQUFULENBQW1CWixHQUFuQixFQUF3Qk0sSUFBeEIsRUFBOEI7QUFDNUI7QUFDQSxRQUFNaUIsUUFBUTtBQUNaLGlCQUFvQmhCLE9BQU9pQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWixDQURSO0FBRVosa0JBQW9CakIsT0FBT2lCLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUFaLENBRlI7QUFHWixpQkFBb0JqQixPQUFPaUIsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLENBQVosQ0FIUjtBQUlaLHVCQUFvQmpCLE9BQU9pQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWjtBQUNwQjtBQUNBO0FBTlksR0FBZDs7QUFTQSxNQUFJbEIsZ0JBQWdCQyxNQUFwQixFQUE0QjtBQUMxQjtBQUNBLFNBQUssTUFBTU8sSUFBWCxJQUFtQlMsS0FBbkIsRUFBMEI7QUFDeEIsVUFBSUUsU0FBU0YsTUFBTVQsSUFBTixDQUFiO0FBQ0EsVUFBSVIsS0FBS29CLEtBQUwsQ0FBVyxDQUFYLEVBQWNELE9BQU9oQixNQUFyQixFQUE2QmtCLE1BQTdCLENBQW9DRixNQUFwQyxDQUFKLEVBQWlELE9BQU9YLElBQVA7QUFDbEQ7QUFDRjs7QUFFRCxTQUFPZCxJQUFJNEIsT0FBSixDQUFZLGNBQVosS0FBK0IsMEJBQXRDO0FBQ0QiLCJmaWxlIjoicGFyc2UtYm9keS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSBcInF1ZXJ5c3RyaW5nXCJcbmltcG9ydCBjb250ZW50VHlwZSBmcm9tIFwiY29udGVudC10eXBlXCJcblxuaW1wb3J0IHtCYWRSZXF1ZXN0LCBVbnN1cHBvcnRlZE1lZGlhVHlwZX0gZnJvbSBcIi4uL2Vycm9yc1wiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlQm9keSgpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHBhcnNlQm9keShuZXh0OiBOZXh0KSB7XG4gICAgY29uc3QgY3R4OiBDb250ZXh0ID0gdGhpc1xuXG4gICAgY29uc3QgYnVmZmVycyA9IFtdXG5cbiAgICBjdHgucmVxLm9uKFwiZGF0YVwiLCBjaHVuayA9PiB7XG4gICAgICBidWZmZXJzLnB1c2goY2h1bmspXG4gICAgfSlcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgY3R4LnJlcS5vbihcImVuZFwiLCByZXNvbHZlKVxuICAgIH0pXG5cbiAgICBjb25zdCBib2R5ID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKVxuXG4gICAgaWYgKGJvZHkubGVuZ3RoKSB7XG4gICAgICBsZXQgcGFyc2VkXG4gICAgICB0cnkge1xuICAgICAgICAvKiBHdWVzcyB0aGUgdHlwZSBvZiB0aGUgY29udGVudCBiYXNlZCBvbiBtYWdpYyBoZWFkZXJzLlxuICAgICAgICAgICBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgY2xpZW50cyB0aGF0IGFjY2lkZW50YWxseSBzZXQgYXBwbGljYXRpb24vanNvblxuICAgICAgICAgICBDb250ZW50LVR5cGUgaGVhZGVyIHdoZW4gdXBsb2FkaW5nIGltYWdlcy4gKi9cbiAgICAgICAgcGFyc2VkID0gY29udGVudFR5cGUucGFyc2UoZ3Vlc3NUeXBlKGN0eC5yZXEsIGJvZHkpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KFwiQmFkIENvbnRlbnQtVHlwZSBoZWFkZXJcIilcbiAgICAgIH1cblxuICAgICAgY29uc3Qge3R5cGUsIHBhcmFtZXRlcnM6IHtjaGFyc2V0ID0gXCJ1dGYtOFwifX0gPSBwYXJzZWRcblxuICAgICAgaWYgKGNoYXJzZXQudG9Mb3dlckNhc2UoKSAhPT0gXCJ1dGYtOFwiKSB7XG4gICAgICAgIHRocm93IG5ldyBVbnN1cHBvcnRlZE1lZGlhVHlwZShgQ2hhcnNldCAke2NoYXJzZXQudG9Mb3dlckNhc2UoKX0gaXMgbm90IHN1cHBvcnRlZGApXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCI6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qIFZhbGlkYXRlIHF1ZXJ5IHN0cmluZz8gKi9cbiAgICAgICAgICAgIGN0eC5kYXRhLmJvZHkgPSBxdWVyeXN0cmluZy5wYXJzZShib2R5LnRvU3RyaW5nKCksIG51bGwsIG51bGwsIHttYXhLZXlzOiAwfSlcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8qIFRPRE86IFRocm93IGVycm9yIHRvIGNsaWVudD8gKi9cbiAgICAgICAgICAgIGN0eC5kYXRhLmJvZHkgPSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgXCJhcHBsaWNhdGlvbi9qc29uXCI6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGN0eC5kYXRhLmJvZHkgPSBKU09OLnBhcnNlKGJvZHkudG9TdHJpbmcoKSlcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KGVyci5tZXNzYWdlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY3R4LmRhdGEuYm9keSA9IGJvZHlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgbmV4dCgpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ3Vlc3NUeXBlKHJlcSwgYm9keSkge1xuICAvKiBEZXRlY3QgR0lGIGFuZCBQREYgdG8gcHJvdmlkZSBiZXR0ZXIgZXJyb3IgbWVzc2FnZXMuICovXG4gIGNvbnN0IG1hZ2ljID0ge1xuICAgIFwiaW1hZ2UvcG5nXCI6ICAgICAgICBCdWZmZXIuZnJvbShbMHg4OSwgMHg1MCwgMHg0ZSwgMHg0N10pLFxuICAgIFwiaW1hZ2UvanBlZ1wiOiAgICAgICBCdWZmZXIuZnJvbShbMHhmZiwgMHhkOCwgMHhmZl0pLFxuICAgIFwiaW1hZ2UvZ2lmXCI6ICAgICAgICBCdWZmZXIuZnJvbShbMHg0NywgMHg0OSwgMHg0Nl0pLFxuICAgIFwiYXBwbGljYXRpb24vcGRmXCI6ICBCdWZmZXIuZnJvbShbMHgyNSwgMHg1MCwgMHg0NCwgMHg0Nl0pLFxuICAgIC8qIFRPRE86IEFzc3VtZSAne1wiJyBtZWFucyB3ZSBoYXZlIEpTT04/ICovXG4gICAgLy8gXCJhcHBsaWNhdGlvbi9qc29uXCI6IEJ1ZmZlci5mcm9tKFsweDdiLCAweDIyXSksXG4gIH1cblxuICBpZiAoYm9keSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgIC8qIENoZWNrIGZvciBtYWdpYyBoZWFkZXJzIG9mIHZhcmlvdXMgYmluYXJ5IGZpbGVzLiAqL1xuICAgIGZvciAoY29uc3QgdHlwZSBpbiBtYWdpYykge1xuICAgICAgbGV0IGhlYWRlciA9IG1hZ2ljW3R5cGVdXG4gICAgICBpZiAoYm9keS5zbGljZSgwLCBoZWFkZXIubGVuZ3RoKS5lcXVhbHMoaGVhZGVyKSkgcmV0dXJuIHR5cGVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVxLmhlYWRlcnNbXCJjb250ZW50LXR5cGVcIl0gfHwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIlxufVxuIl19