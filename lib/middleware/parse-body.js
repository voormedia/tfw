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

function parseBody() {
  return async function parseBody(next) {
    this;

    const buffers = [];

    this.request.on("data", chunk => {
      buffers.push(chunk);
    });

    await new Promise(resolve => {
      this.request.on("end", resolve);
    });

    const body = Buffer.concat(buffers);

    if (body.length) {
      let parsed;
      try {
        /* Guess the type of the content based on magic headers.
           This is a workaround for clients that accidentally set application/json
           Content-Type header when uploading images. */
        parsed = _contentType2.default.parse(guessType(this.request, body));
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
            this.data.body = _querystring2.default.parse(body.toString(), null, null, { maxKeys: 0 });
          } catch (err) {
            /* TODO: Throw error to client? */
            this.data.body = {};
          }
          break;

        case "application/json":
          try {
            this.data.body = JSON.parse(body.toString());
          } catch (err) {
            throw new _errors.BadRequest(err.message);
          }
          break;

        default:
          this.data.body = body;
      }
    }

    return await next();
  };
}
/* eslint-disable no-unused-expressions */


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWJvZHkuanMiXSwibmFtZXMiOlsicGFyc2VCb2R5IiwibmV4dCIsImJ1ZmZlcnMiLCJyZXF1ZXN0Iiwib24iLCJjaHVuayIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsImJvZHkiLCJCdWZmZXIiLCJjb25jYXQiLCJsZW5ndGgiLCJwYXJzZWQiLCJwYXJzZSIsImd1ZXNzVHlwZSIsImVyciIsInR5cGUiLCJwYXJhbWV0ZXJzIiwiY2hhcnNldCIsInRvTG93ZXJDYXNlIiwiZGF0YSIsInRvU3RyaW5nIiwibWF4S2V5cyIsIkpTT04iLCJtZXNzYWdlIiwicmVxIiwibWFnaWMiLCJmcm9tIiwiaGVhZGVyIiwic2xpY2UiLCJlcXVhbHMiLCJoZWFkZXJzIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFTd0JBLFM7O0FBUHhCOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUllLFNBQVNBLFNBQVQsR0FBaUM7QUFDOUMsU0FBTyxlQUFlQSxTQUFmLENBQXlCQyxJQUF6QixFQUFxQztBQUN6QyxRQUFEOztBQUVBLFVBQU1DLFVBQVUsRUFBaEI7O0FBRUEsU0FBS0MsT0FBTCxDQUFhQyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCQyxTQUFTO0FBQy9CSCxjQUFRSSxJQUFSLENBQWFELEtBQWI7QUFDRCxLQUZEOztBQUlBLFVBQU0sSUFBSUUsT0FBSixDQUFZQyxXQUFXO0FBQzNCLFdBQUtMLE9BQUwsQ0FBYUMsRUFBYixDQUFnQixLQUFoQixFQUF1QkksT0FBdkI7QUFDRCxLQUZLLENBQU47O0FBSUEsVUFBTUMsT0FBT0MsT0FBT0MsTUFBUCxDQUFjVCxPQUFkLENBQWI7O0FBRUEsUUFBSU8sS0FBS0csTUFBVCxFQUFpQjtBQUNmLFVBQUlDLE1BQUo7QUFDQSxVQUFJO0FBQ0Y7OztBQUdBQSxpQkFBUyxzQkFBWUMsS0FBWixDQUFrQkMsVUFBVSxLQUFLWixPQUFmLEVBQXdCTSxJQUF4QixDQUFsQixDQUFUO0FBQ0QsT0FMRCxDQUtFLE9BQU9PLEdBQVAsRUFBWTtBQUNaLGNBQU0sdUJBQWUseUJBQWYsQ0FBTjtBQUNEOztBQUVELFlBQU0sRUFBQ0MsSUFBRCxFQUFPQyxZQUFZLEVBQUNDLFVBQVUsT0FBWCxFQUFuQixLQUEwQ04sTUFBaEQ7O0FBRUEsVUFBSU0sUUFBUUMsV0FBUixPQUEwQixPQUE5QixFQUF1QztBQUNyQyxjQUFNLGlDQUEwQixXQUFVRCxRQUFRQyxXQUFSLEVBQXNCLG1CQUExRCxDQUFOO0FBQ0Q7O0FBRUQsY0FBUUgsSUFBUjtBQUNFLGFBQUssbUNBQUw7QUFDRSxjQUFJO0FBQ0Y7QUFDQSxpQkFBS0ksSUFBTCxDQUFVWixJQUFWLEdBQWlCLHNCQUFZSyxLQUFaLENBQWtCTCxLQUFLYSxRQUFMLEVBQWxCLEVBQW1DLElBQW5DLEVBQXlDLElBQXpDLEVBQStDLEVBQUNDLFNBQVMsQ0FBVixFQUEvQyxDQUFqQjtBQUNELFdBSEQsQ0FHRSxPQUFPUCxHQUFQLEVBQVk7QUFDWjtBQUNBLGlCQUFLSyxJQUFMLENBQVVaLElBQVYsR0FBaUIsRUFBakI7QUFDRDtBQUNEOztBQUVGLGFBQUssa0JBQUw7QUFDRSxjQUFJO0FBQ0YsaUJBQUtZLElBQUwsQ0FBVVosSUFBVixHQUFpQmUsS0FBS1YsS0FBTCxDQUFXTCxLQUFLYSxRQUFMLEVBQVgsQ0FBakI7QUFDRCxXQUZELENBRUUsT0FBT04sR0FBUCxFQUFZO0FBQ1osa0JBQU0sdUJBQWVBLElBQUlTLE9BQW5CLENBQU47QUFDRDtBQUNEOztBQUVGO0FBQ0UsZUFBS0osSUFBTCxDQUFVWixJQUFWLEdBQWlCQSxJQUFqQjtBQXBCSjtBQXNCRDs7QUFFRCxXQUFPLE1BQU1SLE1BQWI7QUFDRCxHQXpERDtBQTBERDtBQW5FRDs7O0FBcUVBLFNBQVNjLFNBQVQsQ0FBbUJXLEdBQW5CLEVBQXdCakIsSUFBeEIsRUFBOEI7QUFDNUI7QUFDQSxRQUFNa0IsUUFBUTtBQUNaLGlCQUFvQmpCLE9BQU9rQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWixDQURSO0FBRVosa0JBQW9CbEIsT0FBT2tCLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUFaLENBRlI7QUFHWixpQkFBb0JsQixPQUFPa0IsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLENBQVosQ0FIUjtBQUlaLHVCQUFvQmxCLE9BQU9rQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWjtBQUNwQjtBQUNBO0FBTlksR0FBZDs7QUFTQSxNQUFJbkIsZ0JBQWdCQyxNQUFwQixFQUE0QjtBQUMxQjtBQUNBLFNBQUssTUFBTU8sSUFBWCxJQUFtQlUsS0FBbkIsRUFBMEI7QUFDeEIsVUFBSUUsU0FBU0YsTUFBTVYsSUFBTixDQUFiO0FBQ0EsVUFBSVIsS0FBS3FCLEtBQUwsQ0FBVyxDQUFYLEVBQWNELE9BQU9qQixNQUFyQixFQUE2Qm1CLE1BQTdCLENBQW9DRixNQUFwQyxDQUFKLEVBQWlELE9BQU9aLElBQVA7QUFDbEQ7QUFDRjs7QUFFRCxTQUFPUyxJQUFJTSxPQUFKLENBQVksY0FBWixLQUErQiwwQkFBdEM7QUFDRCIsImZpbGUiOiJwYXJzZS1ib2R5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gXCJxdWVyeXN0cmluZ1wiXG5pbXBvcnQgY29udGVudFR5cGUgZnJvbSBcImNvbnRlbnQtdHlwZVwiXG5cbmltcG9ydCB7QmFkUmVxdWVzdCwgVW5zdXBwb3J0ZWRNZWRpYVR5cGV9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZUJvZHkoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBwYXJzZUJvZHkobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgY29uc3QgYnVmZmVycyA9IFtdXG5cbiAgICB0aGlzLnJlcXVlc3Qub24oXCJkYXRhXCIsIGNodW5rID0+IHtcbiAgICAgIGJ1ZmZlcnMucHVzaChjaHVuaylcbiAgICB9KVxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3Qub24oXCJlbmRcIiwgcmVzb2x2ZSlcbiAgICB9KVxuXG4gICAgY29uc3QgYm9keSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycylcblxuICAgIGlmIChib2R5Lmxlbmd0aCkge1xuICAgICAgbGV0IHBhcnNlZFxuICAgICAgdHJ5IHtcbiAgICAgICAgLyogR3Vlc3MgdGhlIHR5cGUgb2YgdGhlIGNvbnRlbnQgYmFzZWQgb24gbWFnaWMgaGVhZGVycy5cbiAgICAgICAgICAgVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIGNsaWVudHMgdGhhdCBhY2NpZGVudGFsbHkgc2V0IGFwcGxpY2F0aW9uL2pzb25cbiAgICAgICAgICAgQ29udGVudC1UeXBlIGhlYWRlciB3aGVuIHVwbG9hZGluZyBpbWFnZXMuICovXG4gICAgICAgIHBhcnNlZCA9IGNvbnRlbnRUeXBlLnBhcnNlKGd1ZXNzVHlwZSh0aGlzLnJlcXVlc3QsIGJvZHkpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KFwiQmFkIENvbnRlbnQtVHlwZSBoZWFkZXJcIilcbiAgICAgIH1cblxuICAgICAgY29uc3Qge3R5cGUsIHBhcmFtZXRlcnM6IHtjaGFyc2V0ID0gXCJ1dGYtOFwifX0gPSBwYXJzZWRcblxuICAgICAgaWYgKGNoYXJzZXQudG9Mb3dlckNhc2UoKSAhPT0gXCJ1dGYtOFwiKSB7XG4gICAgICAgIHRocm93IG5ldyBVbnN1cHBvcnRlZE1lZGlhVHlwZShgQ2hhcnNldCAke2NoYXJzZXQudG9Mb3dlckNhc2UoKX0gaXMgbm90IHN1cHBvcnRlZGApXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCI6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qIFZhbGlkYXRlIHF1ZXJ5IHN0cmluZz8gKi9cbiAgICAgICAgICAgIHRoaXMuZGF0YS5ib2R5ID0gcXVlcnlzdHJpbmcucGFyc2UoYm9keS50b1N0cmluZygpLCBudWxsLCBudWxsLCB7bWF4S2V5czogMH0pXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvKiBUT0RPOiBUaHJvdyBlcnJvciB0byBjbGllbnQ/ICovXG4gICAgICAgICAgICB0aGlzLmRhdGEuYm9keSA9IHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSBcImFwcGxpY2F0aW9uL2pzb25cIjpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5kYXRhLmJvZHkgPSBKU09OLnBhcnNlKGJvZHkudG9TdHJpbmcoKSlcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KGVyci5tZXNzYWdlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5kYXRhLmJvZHkgPSBib2R5XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IG5leHQoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGd1ZXNzVHlwZShyZXEsIGJvZHkpIHtcbiAgLyogRGV0ZWN0IEdJRiBhbmQgUERGIHRvIHByb3ZpZGUgYmV0dGVyIGVycm9yIG1lc3NhZ2VzLiAqL1xuICBjb25zdCBtYWdpYyA9IHtcbiAgICBcImltYWdlL3BuZ1wiOiAgICAgICAgQnVmZmVyLmZyb20oWzB4ODksIDB4NTAsIDB4NGUsIDB4NDddKSxcbiAgICBcImltYWdlL2pwZWdcIjogICAgICAgQnVmZmVyLmZyb20oWzB4ZmYsIDB4ZDgsIDB4ZmZdKSxcbiAgICBcImltYWdlL2dpZlwiOiAgICAgICAgQnVmZmVyLmZyb20oWzB4NDcsIDB4NDksIDB4NDZdKSxcbiAgICBcImFwcGxpY2F0aW9uL3BkZlwiOiAgQnVmZmVyLmZyb20oWzB4MjUsIDB4NTAsIDB4NDQsIDB4NDZdKSxcbiAgICAvKiBUT0RPOiBBc3N1bWUgJ3tcIicgbWVhbnMgd2UgaGF2ZSBKU09OPyAqL1xuICAgIC8vIFwiYXBwbGljYXRpb24vanNvblwiOiBCdWZmZXIuZnJvbShbMHg3YiwgMHgyMl0pLFxuICB9XG5cbiAgaWYgKGJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAvKiBDaGVjayBmb3IgbWFnaWMgaGVhZGVycyBvZiB2YXJpb3VzIGJpbmFyeSBmaWxlcy4gKi9cbiAgICBmb3IgKGNvbnN0IHR5cGUgaW4gbWFnaWMpIHtcbiAgICAgIGxldCBoZWFkZXIgPSBtYWdpY1t0eXBlXVxuICAgICAgaWYgKGJvZHkuc2xpY2UoMCwgaGVhZGVyLmxlbmd0aCkuZXF1YWxzKGhlYWRlcikpIHJldHVybiB0eXBlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcS5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdIHx8IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbn1cbiJdfQ==