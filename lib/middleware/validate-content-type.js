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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3ZhbGlkYXRlLWNvbnRlbnQtdHlwZS5qcyJdLCJuYW1lcyI6WyJ2YWxpZGF0ZUNvbnRlbnRUeXBlIiwiZXhwZWN0ZWQiLCJuZXh0IiwicmVxdWVzdCIsImhlYWRlcnMiLCJ0eXBlIiwicGFyc2UiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQVF3QkEsbUI7O0FBTnhCOzs7O0FBRUE7Ozs7QUFIQTtBQU9lLFNBQVNBLG1CQUFULENBQTZCQyxRQUE3QixFQUEyRDtBQUN4RSxTQUFPLFNBQVNELG1CQUFULENBQTZCRSxJQUE3QixFQUF5QztBQUM3QyxRQUFEOztBQUVBLFFBQUksS0FBS0MsT0FBTCxDQUFhQyxPQUFiLENBQXFCLGdCQUFyQixLQUEwQyxLQUFLRCxPQUFMLENBQWFDLE9BQWIsQ0FBcUIsa0JBQXJCLENBQTlDLEVBQXdGO0FBQ3RGOztBQUVBLFlBQU0sRUFBQ0MsSUFBRCxLQUFTLHNCQUFZQyxLQUFaLENBQWtCLEtBQUtILE9BQUwsQ0FBYUMsT0FBYixDQUFxQixjQUFyQixLQUF3QywwQkFBMUQsQ0FBZjtBQUNBLFVBQUlDLFNBQVNKLFFBQWIsRUFBdUI7QUFDckIsY0FBTSxpQ0FBMEIsY0FBYUEsUUFBUyxlQUFoRCxDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPQyxNQUFQO0FBQ0QsR0FiRDtBQWNEIiwiZmlsZSI6InZhbGlkYXRlLWNvbnRlbnQtdHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCBjb250ZW50VHlwZSBmcm9tIFwiY29udGVudC10eXBlXCJcblxuaW1wb3J0IHtVbnN1cHBvcnRlZE1lZGlhVHlwZX0gZnJvbSBcIi4uL2Vycm9yc1wiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHZhbGlkYXRlQ29udGVudFR5cGUoZXhwZWN0ZWQ6IHN0cmluZyk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gZnVuY3Rpb24gdmFsaWRhdGVDb250ZW50VHlwZShuZXh0OiBOZXh0KSB7XG4gICAgKHRoaXM6IENvbnRleHQpXG5cbiAgICBpZiAodGhpcy5yZXF1ZXN0LmhlYWRlcnNbXCJjb250ZW50LWxlbmd0aFwiXSB8fCB0aGlzLnJlcXVlc3QuaGVhZGVyc1tcImNvbnRlbnQtZW5jb2RpbmdcIl0pIHtcbiAgICAgIC8qIElmIHRoZXJlIGlzIGEgYm9keSBhbmQgbm8gQ29udGVudC1UeXBlLCB3ZSBhcmUgYWxsb3dlZCB0byBhc3N1bWVcbiAgICAgICAgIGFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbTogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzEjc2VjdGlvbi0zLjEuMS41ICovXG4gICAgICBjb25zdCB7dHlwZX0gPSBjb250ZW50VHlwZS5wYXJzZSh0aGlzLnJlcXVlc3QuaGVhZGVyc1tcImNvbnRlbnQtdHlwZVwiXSB8fCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKVxuICAgICAgaWYgKHR5cGUgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgIHRocm93IG5ldyBVbnN1cHBvcnRlZE1lZGlhVHlwZShgUGxlYXNlIHVzZSAke2V4cGVjdGVkfSBjb250ZW50IHR5cGVgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXh0KClcbiAgfVxufVxuIl19