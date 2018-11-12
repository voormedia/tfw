"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateContentType;

var _contentType = require("content-type");

var _contentType2 = _interopRequireDefault(_contentType);

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-expressions */
function validateContentType(expected) {
  return function validateContentType(next) {
    this;

    if (this.request.headers["content-length"] || this.request.headers["content-encoding"]) {
      /* If there is a body and no Content-Type, we are allowed to assume
         application/octet-stream: https://tools.ietf.org/html/rfc7231#section-3.1.1.5 */
      const { type } = _contentType2.default.parse(this.request.headers["content-type"] || "application/octet-stream");
      if (type !== expected) {
        throw new _errors.UnsupportedMediaType(`Please use ${expected} content type`);
      }
    }

    return next();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3ZhbGlkYXRlLWNvbnRlbnQtdHlwZS5qcyJdLCJuYW1lcyI6WyJ2YWxpZGF0ZUNvbnRlbnRUeXBlIiwiZXhwZWN0ZWQiLCJuZXh0IiwicmVxdWVzdCIsImhlYWRlcnMiLCJ0eXBlIiwiY29udGVudFR5cGUiLCJwYXJzZSIsIlVuc3VwcG9ydGVkTWVkaWFUeXBlIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFRd0JBLG1COztBQU54Qjs7OztBQUVBOzs7O0FBSEE7QUFPZSxTQUFTQSxtQkFBVCxDQUE2QkMsUUFBN0IsRUFBMkQ7QUFDeEUsU0FBTyxTQUFTRCxtQkFBVCxDQUE2QkUsSUFBN0IsRUFBeUM7QUFDN0MsUUFBRDs7QUFFQSxRQUFJLEtBQUtDLE9BQUwsQ0FBYUMsT0FBYixDQUFxQixnQkFBckIsS0FBMEMsS0FBS0QsT0FBTCxDQUFhQyxPQUFiLENBQXFCLGtCQUFyQixDQUE5QyxFQUF3RjtBQUN0Rjs7QUFFQSxZQUFNLEVBQUNDLElBQUQsS0FBU0Msc0JBQVlDLEtBQVosQ0FBa0IsS0FBS0osT0FBTCxDQUFhQyxPQUFiLENBQXFCLGNBQXJCLEtBQXdDLDBCQUExRCxDQUFmO0FBQ0EsVUFBSUMsU0FBU0osUUFBYixFQUF1QjtBQUNyQixjQUFNLElBQUlPLDRCQUFKLENBQTBCLGNBQWFQLFFBQVMsZUFBaEQsQ0FBTjtBQUNEO0FBQ0Y7O0FBRUQsV0FBT0MsTUFBUDtBQUNELEdBYkQ7QUFjRCIsImZpbGUiOiJ2YWxpZGF0ZS1jb250ZW50LXR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgY29udGVudFR5cGUgZnJvbSBcImNvbnRlbnQtdHlwZVwiXG5cbmltcG9ydCB7VW5zdXBwb3J0ZWRNZWRpYVR5cGV9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2YWxpZGF0ZUNvbnRlbnRUeXBlKGV4cGVjdGVkOiBzdHJpbmcpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHZhbGlkYXRlQ29udGVudFR5cGUobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgaWYgKHRoaXMucmVxdWVzdC5oZWFkZXJzW1wiY29udGVudC1sZW5ndGhcIl0gfHwgdGhpcy5yZXF1ZXN0LmhlYWRlcnNbXCJjb250ZW50LWVuY29kaW5nXCJdKSB7XG4gICAgICAvKiBJZiB0aGVyZSBpcyBhIGJvZHkgYW5kIG5vIENvbnRlbnQtVHlwZSwgd2UgYXJlIGFsbG93ZWQgdG8gYXNzdW1lXG4gICAgICAgICBhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW06IGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tMy4xLjEuNSAqL1xuICAgICAgY29uc3Qge3R5cGV9ID0gY29udGVudFR5cGUucGFyc2UodGhpcy5yZXF1ZXN0LmhlYWRlcnNbXCJjb250ZW50LXR5cGVcIl0gfHwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIilcbiAgICAgIGlmICh0eXBlICE9PSBleHBlY3RlZCkge1xuICAgICAgICB0aHJvdyBuZXcgVW5zdXBwb3J0ZWRNZWRpYVR5cGUoYFBsZWFzZSB1c2UgJHtleHBlY3RlZH0gY29udGVudCB0eXBlYClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dCgpXG4gIH1cbn1cbiJdfQ==