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
/* eslint-disable no-unused-expressions */


function parseBody() {
  return (() => {
    var _ref = _asyncToGenerator(function* (next) {
      var _this = this;

      this;

      const buffers = [];

      this.request.on("data", function (chunk) {
        buffers.push(chunk);
      });

      yield new Promise(function (resolve) {
        _this.request.on("end", resolve);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWJvZHkuanMiXSwibmFtZXMiOlsicGFyc2VCb2R5IiwibmV4dCIsImJ1ZmZlcnMiLCJyZXF1ZXN0Iiwib24iLCJwdXNoIiwiY2h1bmsiLCJQcm9taXNlIiwicmVzb2x2ZSIsImJvZHkiLCJCdWZmZXIiLCJjb25jYXQiLCJsZW5ndGgiLCJwYXJzZWQiLCJwYXJzZSIsImd1ZXNzVHlwZSIsImVyciIsInR5cGUiLCJwYXJhbWV0ZXJzIiwiY2hhcnNldCIsInRvTG93ZXJDYXNlIiwiZGF0YSIsInRvU3RyaW5nIiwibWF4S2V5cyIsIkpTT04iLCJtZXNzYWdlIiwicmVxIiwibWFnaWMiLCJmcm9tIiwiaGVhZGVyIiwic2xpY2UiLCJlcXVhbHMiLCJoZWFkZXJzIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFTd0JBLFM7O0FBUHhCOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7QUFKQTs7O0FBUWUsU0FBU0EsU0FBVCxHQUFpQztBQUM5QztBQUFBLGlDQUFPLFdBQXlCQyxJQUF6QixFQUFxQztBQUFBOztBQUN6QyxVQUFEOztBQUVBLFlBQU1DLFVBQVUsRUFBaEI7O0FBRUEsV0FBS0MsT0FBTCxDQUFhQyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCLGlCQUFTO0FBQy9CRixnQkFBUUcsSUFBUixDQUFhQyxLQUFiO0FBQ0QsT0FGRDs7QUFJQSxZQUFNLElBQUlDLE9BQUosQ0FBWSxtQkFBVztBQUMzQixjQUFLSixPQUFMLENBQWFDLEVBQWIsQ0FBZ0IsS0FBaEIsRUFBdUJJLE9BQXZCO0FBQ0QsT0FGSyxDQUFOOztBQUlBLFlBQU1DLE9BQU9DLE9BQU9DLE1BQVAsQ0FBY1QsT0FBZCxDQUFiOztBQUVBLFVBQUlPLEtBQUtHLE1BQVQsRUFBaUI7QUFDZixZQUFJQyxNQUFKO0FBQ0EsWUFBSTtBQUNGOzs7QUFHQUEsbUJBQVMsc0JBQVlDLEtBQVosQ0FBa0JDLFVBQVUsS0FBS1osT0FBZixFQUF3Qk0sSUFBeEIsQ0FBbEIsQ0FBVDtBQUNELFNBTEQsQ0FLRSxPQUFPTyxHQUFQLEVBQVk7QUFDWixnQkFBTSx1QkFBZSx5QkFBZixDQUFOO0FBQ0Q7O0FBRUQsY0FBTSxFQUFDQyxJQUFELEVBQU9DLFlBQVksRUFBQ0MsVUFBVSxPQUFYLEVBQW5CLEtBQTBDTixNQUFoRDs7QUFFQSxZQUFJTSxRQUFRQyxXQUFSLE9BQTBCLE9BQTlCLEVBQXVDO0FBQ3JDLGdCQUFNLGlDQUEwQixXQUFVRCxRQUFRQyxXQUFSLEVBQXNCLG1CQUExRCxDQUFOO0FBQ0Q7O0FBRUQsZ0JBQVFILElBQVI7QUFDRSxlQUFLLG1DQUFMO0FBQ0UsZ0JBQUk7QUFDRjtBQUNBLG1CQUFLSSxJQUFMLENBQVVaLElBQVYsR0FBaUIsc0JBQVlLLEtBQVosQ0FBa0JMLEtBQUthLFFBQUwsRUFBbEIsRUFBbUMsSUFBbkMsRUFBeUMsSUFBekMsRUFBK0MsRUFBQ0MsU0FBUyxDQUFWLEVBQS9DLENBQWpCO0FBQ0QsYUFIRCxDQUdFLE9BQU9QLEdBQVAsRUFBWTtBQUNaO0FBQ0EsbUJBQUtLLElBQUwsQ0FBVVosSUFBVixHQUFpQixFQUFqQjtBQUNEO0FBQ0Q7O0FBRUYsZUFBSyxrQkFBTDtBQUNFLGdCQUFJO0FBQ0YsbUJBQUtZLElBQUwsQ0FBVVosSUFBVixHQUFpQmUsS0FBS1YsS0FBTCxDQUFXTCxLQUFLYSxRQUFMLEVBQVgsQ0FBakI7QUFDRCxhQUZELENBRUUsT0FBT04sR0FBUCxFQUFZO0FBQ1osb0JBQU0sdUJBQWVBLElBQUlTLE9BQW5CLENBQU47QUFDRDtBQUNEOztBQUVGO0FBQ0UsaUJBQUtKLElBQUwsQ0FBVVosSUFBVixHQUFpQkEsSUFBakI7QUFwQko7QUFzQkQ7O0FBRUQsYUFBTyxNQUFNUixNQUFiO0FBQ0QsS0F6REQ7O0FBQUEsYUFBc0JELFNBQXRCO0FBQUE7QUFBQTs7QUFBQSxXQUFzQkEsU0FBdEI7QUFBQTtBQTBERDs7QUFFRCxTQUFTZSxTQUFULENBQW1CVyxHQUFuQixFQUF3QmpCLElBQXhCLEVBQThCO0FBQzVCO0FBQ0EsUUFBTWtCLFFBQVE7QUFDWixpQkFBb0JqQixPQUFPa0IsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQVosQ0FEUjtBQUVaLGtCQUFvQmxCLE9BQU9rQixJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsQ0FBWixDQUZSO0FBR1osaUJBQW9CbEIsT0FBT2tCLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixDQUFaLENBSFI7QUFJWix1QkFBb0JsQixPQUFPa0IsSUFBUCxDQUFZLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQVo7QUFDcEI7QUFDQTtBQU5ZLEdBQWQ7O0FBU0EsTUFBSW5CLGdCQUFnQkMsTUFBcEIsRUFBNEI7QUFDMUI7QUFDQSxTQUFLLE1BQU1PLElBQVgsSUFBbUJVLEtBQW5CLEVBQTBCO0FBQ3hCLFVBQUlFLFNBQVNGLE1BQU1WLElBQU4sQ0FBYjtBQUNBLFVBQUlSLEtBQUtxQixLQUFMLENBQVcsQ0FBWCxFQUFjRCxPQUFPakIsTUFBckIsRUFBNkJtQixNQUE3QixDQUFvQ0YsTUFBcEMsQ0FBSixFQUFpRCxPQUFPWixJQUFQO0FBQ2xEO0FBQ0Y7O0FBRUQsU0FBT1MsSUFBSU0sT0FBSixDQUFZLGNBQVosS0FBK0IsMEJBQXRDO0FBQ0QiLCJmaWxlIjoicGFyc2UtYm9keS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCBxdWVyeXN0cmluZyBmcm9tIFwicXVlcnlzdHJpbmdcIlxuaW1wb3J0IGNvbnRlbnRUeXBlIGZyb20gXCJjb250ZW50LXR5cGVcIlxuXG5pbXBvcnQge0JhZFJlcXVlc3QsIFVuc3VwcG9ydGVkTWVkaWFUeXBlfSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VCb2R5KCk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gcGFyc2VCb2R5KG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIGNvbnN0IGJ1ZmZlcnMgPSBbXVxuXG4gICAgdGhpcy5yZXF1ZXN0Lm9uKFwiZGF0YVwiLCBjaHVuayA9PiB7XG4gICAgICBidWZmZXJzLnB1c2goY2h1bmspXG4gICAgfSlcblxuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5yZXF1ZXN0Lm9uKFwiZW5kXCIsIHJlc29sdmUpXG4gICAgfSlcblxuICAgIGNvbnN0IGJvZHkgPSBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpXG5cbiAgICBpZiAoYm9keS5sZW5ndGgpIHtcbiAgICAgIGxldCBwYXJzZWRcbiAgICAgIHRyeSB7XG4gICAgICAgIC8qIEd1ZXNzIHRoZSB0eXBlIG9mIHRoZSBjb250ZW50IGJhc2VkIG9uIG1hZ2ljIGhlYWRlcnMuXG4gICAgICAgICAgIFRoaXMgaXMgYSB3b3JrYXJvdW5kIGZvciBjbGllbnRzIHRoYXQgYWNjaWRlbnRhbGx5IHNldCBhcHBsaWNhdGlvbi9qc29uXG4gICAgICAgICAgIENvbnRlbnQtVHlwZSBoZWFkZXIgd2hlbiB1cGxvYWRpbmcgaW1hZ2VzLiAqL1xuICAgICAgICBwYXJzZWQgPSBjb250ZW50VHlwZS5wYXJzZShndWVzc1R5cGUodGhpcy5yZXF1ZXN0LCBib2R5KSlcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdChcIkJhZCBDb250ZW50LVR5cGUgaGVhZGVyXCIpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHt0eXBlLCBwYXJhbWV0ZXJzOiB7Y2hhcnNldCA9IFwidXRmLThcIn19ID0gcGFyc2VkXG5cbiAgICAgIGlmIChjaGFyc2V0LnRvTG93ZXJDYXNlKCkgIT09IFwidXRmLThcIikge1xuICAgICAgICB0aHJvdyBuZXcgVW5zdXBwb3J0ZWRNZWRpYVR5cGUoYENoYXJzZXQgJHtjaGFyc2V0LnRvTG93ZXJDYXNlKCl9IGlzIG5vdCBzdXBwb3J0ZWRgKVxuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiOlxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKiBWYWxpZGF0ZSBxdWVyeSBzdHJpbmc/ICovXG4gICAgICAgICAgICB0aGlzLmRhdGEuYm9keSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKGJvZHkudG9TdHJpbmcoKSwgbnVsbCwgbnVsbCwge21heEtleXM6IDB9KVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLyogVE9ETzogVGhyb3cgZXJyb3IgdG8gY2xpZW50PyAqL1xuICAgICAgICAgICAgdGhpcy5kYXRhLmJvZHkgPSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgXCJhcHBsaWNhdGlvbi9qc29uXCI6XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZGF0YS5ib2R5ID0gSlNPTi5wYXJzZShib2R5LnRvU3RyaW5nKCkpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmFkUmVxdWVzdChlcnIubWVzc2FnZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuZGF0YS5ib2R5ID0gYm9keVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhd2FpdCBuZXh0KClcbiAgfVxufVxuXG5mdW5jdGlvbiBndWVzc1R5cGUocmVxLCBib2R5KSB7XG4gIC8qIERldGVjdCBHSUYgYW5kIFBERiB0byBwcm92aWRlIGJldHRlciBlcnJvciBtZXNzYWdlcy4gKi9cbiAgY29uc3QgbWFnaWMgPSB7XG4gICAgXCJpbWFnZS9wbmdcIjogICAgICAgIEJ1ZmZlci5mcm9tKFsweDg5LCAweDUwLCAweDRlLCAweDQ3XSksXG4gICAgXCJpbWFnZS9qcGVnXCI6ICAgICAgIEJ1ZmZlci5mcm9tKFsweGZmLCAweGQ4LCAweGZmXSksXG4gICAgXCJpbWFnZS9naWZcIjogICAgICAgIEJ1ZmZlci5mcm9tKFsweDQ3LCAweDQ5LCAweDQ2XSksXG4gICAgXCJhcHBsaWNhdGlvbi9wZGZcIjogIEJ1ZmZlci5mcm9tKFsweDI1LCAweDUwLCAweDQ0LCAweDQ2XSksXG4gICAgLyogVE9ETzogQXNzdW1lICd7XCInIG1lYW5zIHdlIGhhdmUgSlNPTj8gKi9cbiAgICAvLyBcImFwcGxpY2F0aW9uL2pzb25cIjogQnVmZmVyLmZyb20oWzB4N2IsIDB4MjJdKSxcbiAgfVxuXG4gIGlmIChib2R5IGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgLyogQ2hlY2sgZm9yIG1hZ2ljIGhlYWRlcnMgb2YgdmFyaW91cyBiaW5hcnkgZmlsZXMuICovXG4gICAgZm9yIChjb25zdCB0eXBlIGluIG1hZ2ljKSB7XG4gICAgICBsZXQgaGVhZGVyID0gbWFnaWNbdHlwZV1cbiAgICAgIGlmIChib2R5LnNsaWNlKDAsIGhlYWRlci5sZW5ndGgpLmVxdWFscyhoZWFkZXIpKSByZXR1cm4gdHlwZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXEuaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXSB8fCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiXG59XG4iXX0=