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
            this.data.body = Object.create(null);
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

    await next();
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
      const header = magic[type];
      if (body.slice(0, header.length).equals(header)) return type;
    }
  }

  return req.headers["content-type"] || "application/octet-stream";
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWJvZHkuanMiXSwibmFtZXMiOlsicGFyc2VCb2R5IiwibmV4dCIsImJ1ZmZlcnMiLCJyZXF1ZXN0Iiwib24iLCJjaHVuayIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsImJvZHkiLCJCdWZmZXIiLCJjb25jYXQiLCJsZW5ndGgiLCJwYXJzZWQiLCJwYXJzZSIsImd1ZXNzVHlwZSIsImVyciIsInR5cGUiLCJwYXJhbWV0ZXJzIiwiY2hhcnNldCIsInRvTG93ZXJDYXNlIiwiZGF0YSIsInRvU3RyaW5nIiwibWF4S2V5cyIsIk9iamVjdCIsImNyZWF0ZSIsIkpTT04iLCJtZXNzYWdlIiwicmVxIiwibWFnaWMiLCJmcm9tIiwiaGVhZGVyIiwic2xpY2UiLCJlcXVhbHMiLCJoZWFkZXJzIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFTd0JBLFM7O0FBUHhCOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUllLFNBQVNBLFNBQVQsR0FBaUM7QUFDOUMsU0FBTyxlQUFlQSxTQUFmLENBQXlCQyxJQUF6QixFQUFxQztBQUN6QyxRQUFEOztBQUVBLFVBQU1DLFVBQVUsRUFBaEI7O0FBRUEsU0FBS0MsT0FBTCxDQUFhQyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCQyxTQUFTO0FBQy9CSCxjQUFRSSxJQUFSLENBQWFELEtBQWI7QUFDRCxLQUZEOztBQUlBLFVBQU0sSUFBSUUsT0FBSixDQUFZQyxXQUFXO0FBQzNCLFdBQUtMLE9BQUwsQ0FBYUMsRUFBYixDQUFnQixLQUFoQixFQUF1QkksT0FBdkI7QUFDRCxLQUZLLENBQU47O0FBSUEsVUFBTUMsT0FBT0MsT0FBT0MsTUFBUCxDQUFjVCxPQUFkLENBQWI7O0FBRUEsUUFBSU8sS0FBS0csTUFBVCxFQUFpQjtBQUNmLFVBQUlDLE1BQUo7QUFDQSxVQUFJO0FBQ0Y7OztBQUdBQSxpQkFBUyxzQkFBWUMsS0FBWixDQUFrQkMsVUFBVSxLQUFLWixPQUFmLEVBQXdCTSxJQUF4QixDQUFsQixDQUFUO0FBQ0QsT0FMRCxDQUtFLE9BQU9PLEdBQVAsRUFBWTtBQUNaLGNBQU0sdUJBQWUseUJBQWYsQ0FBTjtBQUNEOztBQUVELFlBQU0sRUFBQ0MsSUFBRCxFQUFPQyxZQUFZLEVBQUNDLFVBQVUsT0FBWCxFQUFuQixLQUEwQ04sTUFBaEQ7O0FBRUEsVUFBSU0sUUFBUUMsV0FBUixPQUEwQixPQUE5QixFQUF1QztBQUNyQyxjQUFNLGlDQUEwQixXQUFVRCxRQUFRQyxXQUFSLEVBQXNCLG1CQUExRCxDQUFOO0FBQ0Q7O0FBRUQsY0FBUUgsSUFBUjtBQUNFLGFBQUssbUNBQUw7QUFDRSxjQUFJO0FBQ0Y7QUFDQSxpQkFBS0ksSUFBTCxDQUFVWixJQUFWLEdBQWlCLHNCQUFZSyxLQUFaLENBQWtCTCxLQUFLYSxRQUFMLEVBQWxCLEVBQW1DLElBQW5DLEVBQXlDLElBQXpDLEVBQStDLEVBQUNDLFNBQVMsQ0FBVixFQUEvQyxDQUFqQjtBQUNELFdBSEQsQ0FHRSxPQUFPUCxHQUFQLEVBQVk7QUFDWjtBQUNBLGlCQUFLSyxJQUFMLENBQVVaLElBQVYsR0FBaUJlLE9BQU9DLE1BQVAsQ0FBYyxJQUFkLENBQWpCO0FBQ0Q7QUFDRDs7QUFFRixhQUFLLGtCQUFMO0FBQ0UsY0FBSTtBQUNGLGlCQUFLSixJQUFMLENBQVVaLElBQVYsR0FBaUJpQixLQUFLWixLQUFMLENBQVdMLEtBQUthLFFBQUwsRUFBWCxDQUFqQjtBQUNELFdBRkQsQ0FFRSxPQUFPTixHQUFQLEVBQVk7QUFDWixrQkFBTSx1QkFBZUEsSUFBSVcsT0FBbkIsQ0FBTjtBQUNEO0FBQ0Q7O0FBRUY7QUFDRSxlQUFLTixJQUFMLENBQVVaLElBQVYsR0FBaUJBLElBQWpCO0FBcEJKO0FBc0JEOztBQUVELFVBQU1SLE1BQU47QUFDRCxHQXpERDtBQTBERDtBQW5FRDs7O0FBcUVBLFNBQVNjLFNBQVQsQ0FBbUJhLEdBQW5CLEVBQXdCbkIsSUFBeEIsRUFBOEI7QUFDNUI7QUFDQSxRQUFNb0IsUUFBUTtBQUNaLGlCQUFvQm5CLE9BQU9vQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWixDQURSO0FBRVosa0JBQW9CcEIsT0FBT29CLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUFaLENBRlI7QUFHWixpQkFBb0JwQixPQUFPb0IsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLENBQVosQ0FIUjtBQUlaLHVCQUFvQnBCLE9BQU9vQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBWjtBQUNwQjtBQUNBO0FBTlksR0FBZDs7QUFTQSxNQUFJckIsZ0JBQWdCQyxNQUFwQixFQUE0QjtBQUMxQjtBQUNBLFNBQUssTUFBTU8sSUFBWCxJQUFtQlksS0FBbkIsRUFBMEI7QUFDeEIsWUFBTUUsU0FBU0YsTUFBTVosSUFBTixDQUFmO0FBQ0EsVUFBSVIsS0FBS3VCLEtBQUwsQ0FBVyxDQUFYLEVBQWNELE9BQU9uQixNQUFyQixFQUE2QnFCLE1BQTdCLENBQW9DRixNQUFwQyxDQUFKLEVBQWlELE9BQU9kLElBQVA7QUFDbEQ7QUFDRjs7QUFFRCxTQUFPVyxJQUFJTSxPQUFKLENBQVksY0FBWixLQUErQiwwQkFBdEM7QUFDRCIsImZpbGUiOiJwYXJzZS1ib2R5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IHF1ZXJ5c3RyaW5nIGZyb20gXCJxdWVyeXN0cmluZ1wiXG5pbXBvcnQgY29udGVudFR5cGUgZnJvbSBcImNvbnRlbnQtdHlwZVwiXG5cbmltcG9ydCB7QmFkUmVxdWVzdCwgVW5zdXBwb3J0ZWRNZWRpYVR5cGV9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZUJvZHkoKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBhc3luYyBmdW5jdGlvbiBwYXJzZUJvZHkobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgY29uc3QgYnVmZmVycyA9IFtdXG5cbiAgICB0aGlzLnJlcXVlc3Qub24oXCJkYXRhXCIsIGNodW5rID0+IHtcbiAgICAgIGJ1ZmZlcnMucHVzaChjaHVuaylcbiAgICB9KVxuXG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3Qub24oXCJlbmRcIiwgcmVzb2x2ZSlcbiAgICB9KVxuXG4gICAgY29uc3QgYm9keSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycylcblxuICAgIGlmIChib2R5Lmxlbmd0aCkge1xuICAgICAgbGV0IHBhcnNlZFxuICAgICAgdHJ5IHtcbiAgICAgICAgLyogR3Vlc3MgdGhlIHR5cGUgb2YgdGhlIGNvbnRlbnQgYmFzZWQgb24gbWFnaWMgaGVhZGVycy5cbiAgICAgICAgICAgVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIGNsaWVudHMgdGhhdCBhY2NpZGVudGFsbHkgc2V0IGFwcGxpY2F0aW9uL2pzb25cbiAgICAgICAgICAgQ29udGVudC1UeXBlIGhlYWRlciB3aGVuIHVwbG9hZGluZyBpbWFnZXMuICovXG4gICAgICAgIHBhcnNlZCA9IGNvbnRlbnRUeXBlLnBhcnNlKGd1ZXNzVHlwZSh0aGlzLnJlcXVlc3QsIGJvZHkpKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KFwiQmFkIENvbnRlbnQtVHlwZSBoZWFkZXJcIilcbiAgICAgIH1cblxuICAgICAgY29uc3Qge3R5cGUsIHBhcmFtZXRlcnM6IHtjaGFyc2V0ID0gXCJ1dGYtOFwifX0gPSBwYXJzZWRcblxuICAgICAgaWYgKGNoYXJzZXQudG9Mb3dlckNhc2UoKSAhPT0gXCJ1dGYtOFwiKSB7XG4gICAgICAgIHRocm93IG5ldyBVbnN1cHBvcnRlZE1lZGlhVHlwZShgQ2hhcnNldCAke2NoYXJzZXQudG9Mb3dlckNhc2UoKX0gaXMgbm90IHN1cHBvcnRlZGApXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCI6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qIFZhbGlkYXRlIHF1ZXJ5IHN0cmluZz8gKi9cbiAgICAgICAgICAgIHRoaXMuZGF0YS5ib2R5ID0gcXVlcnlzdHJpbmcucGFyc2UoYm9keS50b1N0cmluZygpLCBudWxsLCBudWxsLCB7bWF4S2V5czogMH0pXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvKiBUT0RPOiBUaHJvdyBlcnJvciB0byBjbGllbnQ/ICovXG4gICAgICAgICAgICB0aGlzLmRhdGEuYm9keSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlIFwiYXBwbGljYXRpb24vanNvblwiOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEuYm9keSA9IEpTT04ucGFyc2UoYm9keS50b1N0cmluZygpKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3QoZXJyLm1lc3NhZ2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLmRhdGEuYm9keSA9IGJvZHlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBuZXh0KClcbiAgfVxufVxuXG5mdW5jdGlvbiBndWVzc1R5cGUocmVxLCBib2R5KSB7XG4gIC8qIERldGVjdCBHSUYgYW5kIFBERiB0byBwcm92aWRlIGJldHRlciBlcnJvciBtZXNzYWdlcy4gKi9cbiAgY29uc3QgbWFnaWMgPSB7XG4gICAgXCJpbWFnZS9wbmdcIjogICAgICAgIEJ1ZmZlci5mcm9tKFsweDg5LCAweDUwLCAweDRlLCAweDQ3XSksXG4gICAgXCJpbWFnZS9qcGVnXCI6ICAgICAgIEJ1ZmZlci5mcm9tKFsweGZmLCAweGQ4LCAweGZmXSksXG4gICAgXCJpbWFnZS9naWZcIjogICAgICAgIEJ1ZmZlci5mcm9tKFsweDQ3LCAweDQ5LCAweDQ2XSksXG4gICAgXCJhcHBsaWNhdGlvbi9wZGZcIjogIEJ1ZmZlci5mcm9tKFsweDI1LCAweDUwLCAweDQ0LCAweDQ2XSksXG4gICAgLyogVE9ETzogQXNzdW1lICd7XCInIG1lYW5zIHdlIGhhdmUgSlNPTj8gKi9cbiAgICAvLyBcImFwcGxpY2F0aW9uL2pzb25cIjogQnVmZmVyLmZyb20oWzB4N2IsIDB4MjJdKSxcbiAgfVxuXG4gIGlmIChib2R5IGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgLyogQ2hlY2sgZm9yIG1hZ2ljIGhlYWRlcnMgb2YgdmFyaW91cyBiaW5hcnkgZmlsZXMuICovXG4gICAgZm9yIChjb25zdCB0eXBlIGluIG1hZ2ljKSB7XG4gICAgICBjb25zdCBoZWFkZXIgPSBtYWdpY1t0eXBlXVxuICAgICAgaWYgKGJvZHkuc2xpY2UoMCwgaGVhZGVyLmxlbmd0aCkuZXF1YWxzKGhlYWRlcikpIHJldHVybiB0eXBlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcS5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdIHx8IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCJcbn1cbiJdfQ==