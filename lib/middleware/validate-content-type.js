"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateContentType;

var _contentType = require("content-type");

var _contentType2 = _interopRequireDefault(_contentType);

var _errors = require("../errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateContentType(expected) {
  return function validateContentType(next) {
    const ctx = this;

    if (ctx.req.headers["content-length"] || ctx.req.headers["content-encoding"]) {
      /* If there is a body and no Content-Type, we are allowed to assume
         application/octet-stream: https://tools.ietf.org/html/rfc7231#section-3.1.1.5 */
      const { type } = _contentType2.default.parse(ctx.req.headers["content-type"] || "application/octet-stream");
      if (type !== expected) {
        throw new _errors.UnsupportedMediaType(`Please use ${expected} content type`);
      }
    }

    return next();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3ZhbGlkYXRlLWNvbnRlbnQtdHlwZS5qcyJdLCJuYW1lcyI6WyJ2YWxpZGF0ZUNvbnRlbnRUeXBlIiwiZXhwZWN0ZWQiLCJuZXh0IiwiY3R4IiwicmVxIiwiaGVhZGVycyIsInR5cGUiLCJwYXJzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBT3dCQSxtQjs7QUFOeEI7Ozs7QUFFQTs7OztBQUllLFNBQVNBLG1CQUFULENBQTZCQyxRQUE3QixFQUEyRDtBQUN4RSxTQUFPLFNBQVNELG1CQUFULENBQTZCRSxJQUE3QixFQUF5QztBQUM5QyxVQUFNQyxNQUFlLElBQXJCOztBQUVBLFFBQUlBLElBQUlDLEdBQUosQ0FBUUMsT0FBUixDQUFnQixnQkFBaEIsS0FBcUNGLElBQUlDLEdBQUosQ0FBUUMsT0FBUixDQUFnQixrQkFBaEIsQ0FBekMsRUFBOEU7QUFDNUU7O0FBRUEsWUFBTSxFQUFDQyxJQUFELEtBQVMsc0JBQVlDLEtBQVosQ0FBa0JKLElBQUlDLEdBQUosQ0FBUUMsT0FBUixDQUFnQixjQUFoQixLQUFtQywwQkFBckQsQ0FBZjtBQUNBLFVBQUlDLFNBQVNMLFFBQWIsRUFBdUI7QUFDckIsY0FBTSxpQ0FBMEIsY0FBYUEsUUFBUyxlQUFoRCxDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPQyxNQUFQO0FBQ0QsR0FiRDtBQWNEIiwiZmlsZSI6InZhbGlkYXRlLWNvbnRlbnQtdHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgY29udGVudFR5cGUgZnJvbSBcImNvbnRlbnQtdHlwZVwiXG5cbmltcG9ydCB7VW5zdXBwb3J0ZWRNZWRpYVR5cGV9IGZyb20gXCIuLi9lcnJvcnNcIlxuXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2YWxpZGF0ZUNvbnRlbnRUeXBlKGV4cGVjdGVkOiBzdHJpbmcpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHZhbGlkYXRlQ29udGVudFR5cGUobmV4dDogTmV4dCkge1xuICAgIGNvbnN0IGN0eDogQ29udGV4dCA9IHRoaXNcblxuICAgIGlmIChjdHgucmVxLmhlYWRlcnNbXCJjb250ZW50LWxlbmd0aFwiXSB8fCBjdHgucmVxLmhlYWRlcnNbXCJjb250ZW50LWVuY29kaW5nXCJdKSB7XG4gICAgICAvKiBJZiB0aGVyZSBpcyBhIGJvZHkgYW5kIG5vIENvbnRlbnQtVHlwZSwgd2UgYXJlIGFsbG93ZWQgdG8gYXNzdW1lXG4gICAgICAgICBhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW06IGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMxI3NlY3Rpb24tMy4xLjEuNSAqL1xuICAgICAgY29uc3Qge3R5cGV9ID0gY29udGVudFR5cGUucGFyc2UoY3R4LnJlcS5oZWFkZXJzW1wiY29udGVudC10eXBlXCJdIHx8IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpXG4gICAgICBpZiAodHlwZSAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFVuc3VwcG9ydGVkTWVkaWFUeXBlKGBQbGVhc2UgdXNlICR7ZXhwZWN0ZWR9IGNvbnRlbnQgdHlwZWApXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQoKVxuICB9XG59XG4iXX0=