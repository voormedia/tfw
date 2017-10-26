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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWJvZHkuanMiXSwibmFtZXMiOlsicGFyc2VCb2R5IiwibmV4dCIsImJ1ZmZlcnMiLCJyZXF1ZXN0Iiwib24iLCJjaHVuayIsInB1c2giLCJQcm9taXNlIiwicmVzb2x2ZSIsImJvZHkiLCJCdWZmZXIiLCJjb25jYXQiLCJsZW5ndGgiLCJwYXJzZWQiLCJwYXJzZSIsImd1ZXNzVHlwZSIsImVyciIsInR5cGUiLCJwYXJhbWV0ZXJzIiwiY2hhcnNldCIsInRvTG93ZXJDYXNlIiwiZGF0YSIsInRvU3RyaW5nIiwibWF4S2V5cyIsIk9iamVjdCIsImNyZWF0ZSIsIkpTT04iLCJtZXNzYWdlIiwicmVxIiwibWFnaWMiLCJmcm9tIiwiaGVhZGVyIiwic2xpY2UiLCJlcXVhbHMiLCJoZWFkZXJzIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFTd0JBLFM7O0FBUHhCOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUllLFNBQVNBLFNBQVQsR0FBaUM7QUFDOUMsU0FBTyxlQUFlQSxTQUFmLENBQXlCQyxJQUF6QixFQUFxQztBQUN6QyxRQUFEOztBQUVBLFVBQU1DLFVBQVUsRUFBaEI7O0FBRUEsU0FBS0MsT0FBTCxDQUFhQyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCQyxTQUFTO0FBQy9CSCxjQUFRSSxJQUFSLENBQWFELEtBQWI7QUFDRCxLQUZEOztBQUlBLFVBQU0sSUFBSUUsT0FBSixDQUFZQyxXQUFXO0FBQzNCLFdBQUtMLE9BQUwsQ0FBYUMsRUFBYixDQUFnQixLQUFoQixFQUF1QkksT0FBdkI7QUFDRCxLQUZLLENBQU47O0FBSUEsVUFBTUMsT0FBT0MsT0FBT0MsTUFBUCxDQUFjVCxPQUFkLENBQWI7O0FBRUEsUUFBSU8sS0FBS0csTUFBVCxFQUFpQjtBQUNmLFVBQUlDLE1BQUo7QUFDQSxVQUFJO0FBQ0Y7OztBQUdBQSxpQkFBUyxzQkFBWUMsS0FBWixDQUFrQkMsVUFBVSxLQUFLWixPQUFmLEVBQXdCTSxJQUF4QixDQUFsQixDQUFUO0FBQ0QsT0FMRCxDQUtFLE9BQU9PLEdBQVAsRUFBWTtBQUNaLGNBQU0sdUJBQWUseUJBQWYsQ0FBTjtBQUNEOztBQUVELFlBQU0sRUFBQ0MsSUFBRCxFQUFPQyxZQUFZLEVBQUNDLFVBQVUsT0FBWCxFQUFuQixLQUEwQ04sTUFBaEQ7O0FBRUEsVUFBSU0sUUFBUUMsV0FBUixPQUEwQixPQUE5QixFQUF1QztBQUNyQyxjQUFNLGlDQUEwQixXQUFVRCxRQUFRQyxXQUFSLEVBQXNCLG1CQUExRCxDQUFOO0FBQ0Q7O0FBRUQsY0FBUUgsSUFBUjtBQUNFLGFBQUssbUNBQUw7QUFDRSxjQUFJO0FBQ0Y7QUFDQSxpQkFBS0ksSUFBTCxDQUFVWixJQUFWLEdBQWlCLHNCQUFZSyxLQUFaLENBQWtCTCxLQUFLYSxRQUFMLEVBQWxCLEVBQW1DLElBQW5DLEVBQXlDLElBQXpDLEVBQStDLEVBQUNDLFNBQVMsQ0FBVixFQUEvQyxDQUFqQjtBQUNELFdBSEQsQ0FHRSxPQUFPUCxHQUFQLEVBQVk7QUFDWjtBQUNBLGlCQUFLSyxJQUFMLENBQVVaLElBQVYsR0FBaUJlLE9BQU9DLE1BQVAsQ0FBYyxJQUFkLENBQWpCO0FBQ0Q7QUFDRDs7QUFFRixhQUFLLGtCQUFMO0FBQ0UsY0FBSTtBQUNGLGlCQUFLSixJQUFMLENBQVVaLElBQVYsR0FBaUJpQixLQUFLWixLQUFMLENBQVdMLEtBQUthLFFBQUwsRUFBWCxDQUFqQjtBQUNELFdBRkQsQ0FFRSxPQUFPTixHQUFQLEVBQVk7QUFDWixrQkFBTSx1QkFBZUEsSUFBSVcsT0FBbkIsQ0FBTjtBQUNEO0FBQ0Q7O0FBRUY7QUFDRSxlQUFLTixJQUFMLENBQVVaLElBQVYsR0FBaUJBLElBQWpCO0FBcEJKO0FBc0JEOztBQUVELFdBQU8sTUFBTVIsTUFBYjtBQUNELEdBekREO0FBMEREO0FBbkVEOzs7QUFxRUEsU0FBU2MsU0FBVCxDQUFtQmEsR0FBbkIsRUFBd0JuQixJQUF4QixFQUE4QjtBQUM1QjtBQUNBLFFBQU1vQixRQUFRO0FBQ1osaUJBQW9CbkIsT0FBT29CLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFaLENBRFI7QUFFWixrQkFBb0JwQixPQUFPb0IsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLENBQVosQ0FGUjtBQUdaLGlCQUFvQnBCLE9BQU9vQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsQ0FBWixDQUhSO0FBSVosdUJBQW9CcEIsT0FBT29CLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFaO0FBQ3BCO0FBQ0E7QUFOWSxHQUFkOztBQVNBLE1BQUlyQixnQkFBZ0JDLE1BQXBCLEVBQTRCO0FBQzFCO0FBQ0EsU0FBSyxNQUFNTyxJQUFYLElBQW1CWSxLQUFuQixFQUEwQjtBQUN4QixVQUFJRSxTQUFTRixNQUFNWixJQUFOLENBQWI7QUFDQSxVQUFJUixLQUFLdUIsS0FBTCxDQUFXLENBQVgsRUFBY0QsT0FBT25CLE1BQXJCLEVBQTZCcUIsTUFBN0IsQ0FBb0NGLE1BQXBDLENBQUosRUFBaUQsT0FBT2QsSUFBUDtBQUNsRDtBQUNGOztBQUVELFNBQU9XLElBQUlNLE9BQUosQ0FBWSxjQUFaLEtBQStCLDBCQUF0QztBQUNEIiwiZmlsZSI6InBhcnNlLWJvZHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSBcInF1ZXJ5c3RyaW5nXCJcbmltcG9ydCBjb250ZW50VHlwZSBmcm9tIFwiY29udGVudC10eXBlXCJcblxuaW1wb3J0IHtCYWRSZXF1ZXN0LCBVbnN1cHBvcnRlZE1lZGlhVHlwZX0gZnJvbSBcIi4uL2Vycm9yc1wiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlQm9keSgpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uIHBhcnNlQm9keShuZXh0OiBOZXh0KSB7XG4gICAgKHRoaXM6IENvbnRleHQpXG5cbiAgICBjb25zdCBidWZmZXJzID0gW11cblxuICAgIHRoaXMucmVxdWVzdC5vbihcImRhdGFcIiwgY2h1bmsgPT4ge1xuICAgICAgYnVmZmVycy5wdXNoKGNodW5rKVxuICAgIH0pXG5cbiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMucmVxdWVzdC5vbihcImVuZFwiLCByZXNvbHZlKVxuICAgIH0pXG5cbiAgICBjb25zdCBib2R5ID0gQnVmZmVyLmNvbmNhdChidWZmZXJzKVxuXG4gICAgaWYgKGJvZHkubGVuZ3RoKSB7XG4gICAgICBsZXQgcGFyc2VkXG4gICAgICB0cnkge1xuICAgICAgICAvKiBHdWVzcyB0aGUgdHlwZSBvZiB0aGUgY29udGVudCBiYXNlZCBvbiBtYWdpYyBoZWFkZXJzLlxuICAgICAgICAgICBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgY2xpZW50cyB0aGF0IGFjY2lkZW50YWxseSBzZXQgYXBwbGljYXRpb24vanNvblxuICAgICAgICAgICBDb250ZW50LVR5cGUgaGVhZGVyIHdoZW4gdXBsb2FkaW5nIGltYWdlcy4gKi9cbiAgICAgICAgcGFyc2VkID0gY29udGVudFR5cGUucGFyc2UoZ3Vlc3NUeXBlKHRoaXMucmVxdWVzdCwgYm9keSkpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3QoXCJCYWQgQ29udGVudC1UeXBlIGhlYWRlclwiKVxuICAgICAgfVxuXG4gICAgICBjb25zdCB7dHlwZSwgcGFyYW1ldGVyczoge2NoYXJzZXQgPSBcInV0Zi04XCJ9fSA9IHBhcnNlZFxuXG4gICAgICBpZiAoY2hhcnNldC50b0xvd2VyQ2FzZSgpICE9PSBcInV0Zi04XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFVuc3VwcG9ydGVkTWVkaWFUeXBlKGBDaGFyc2V0ICR7Y2hhcnNldC50b0xvd2VyQ2FzZSgpfSBpcyBub3Qgc3VwcG9ydGVkYClcbiAgICAgIH1cblxuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIjpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyogVmFsaWRhdGUgcXVlcnkgc3RyaW5nPyAqL1xuICAgICAgICAgICAgdGhpcy5kYXRhLmJvZHkgPSBxdWVyeXN0cmluZy5wYXJzZShib2R5LnRvU3RyaW5nKCksIG51bGwsIG51bGwsIHttYXhLZXlzOiAwfSlcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8qIFRPRE86IFRocm93IGVycm9yIHRvIGNsaWVudD8gKi9cbiAgICAgICAgICAgIHRoaXMuZGF0YS5ib2R5ID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgXCJhcHBsaWNhdGlvbi9qc29uXCI6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5ib2R5ID0gSlNPTi5wYXJzZShib2R5LnRvU3RyaW5nKCkpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdChlcnIubWVzc2FnZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuZGF0YS5ib2R5ID0gYm9keVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCBuZXh0KClcbiAgfVxufVxuXG5mdW5jdGlvbiBndWVzc1R5cGUocmVxLCBib2R5KSB7XG4gIC8qIERldGVjdCBHSUYgYW5kIFBERiB0byBwcm92aWRlIGJldHRlciBlcnJvciBtZXNzYWdlcy4gKi9cbiAgY29uc3QgbWFnaWMgPSB7XG4gICAgXCJpbWFnZS9wbmdcIjogICAgICAgIEJ1ZmZlci5mcm9tKFsweDg5LCAweDUwLCAweDRlLCAweDQ3XSksXG4gICAgXCJpbWFnZS9qcGVnXCI6ICAgICAgIEJ1ZmZlci5mcm9tKFsweGZmLCAweGQ4LCAweGZmXSksXG4gICAgXCJpbWFnZS9naWZcIjogICAgICAgIEJ1ZmZlci5mcm9tKFsweDQ3LCAweDQ5LCAweDQ2XSksXG4gICAgXCJhcHBsaWNhdGlvbi9wZGZcIjogIEJ1ZmZlci5mcm9tKFsweDI1LCAweDUwLCAweDQ0LCAweDQ2XSksXG4gICAgLyogVE9ETzogQXNzdW1lICd7XCInIG1lYW5zIHdlIGhhdmUgSlNPTj8gKi9cbiAgICAvLyBcImFwcGxpY2F0aW9uL2pzb25cIjogQnVmZmVyLmZyb20oWzB4N2IsIDB4MjJdKSxcbiAgfVxuXG4gIGlmIChib2R5IGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgLyogQ2hlY2sgZm9yIG1hZ2ljIGhlYWRlcnMgb2YgdmFyaW91cyBiaW5hcnkgZmlsZXMuICovXG4gICAgZm9yIChjb25zdCB0eXBlIGluIG1hZ2ljKSB7XG4gICAgICBsZXQgaGVhZGVyID0gbWFnaWNbdHlwZV1cbiAgICAgIGlmIChib2R5LnNsaWNlKDAsIGhlYWRlci5sZW5ndGgpLmVxdWFscyhoZWFkZXIpKSByZXR1cm4gdHlwZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXEuaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXSB8fCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiXG59XG4iXX0=