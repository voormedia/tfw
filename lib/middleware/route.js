"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = route;

var _router = require("../router");

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function route(router) {
  return function route(next) {
    this;

    const url = this.url;
    let method = this.method;
    if (method === "HEAD") {
      /* Treat HEAD requests as GET. */
      method = "GET";
    }

    const { handler, params } = router.match(method, url);

    if (handler) {
      this.data.params = params;

      if (handler.stack) this.stack.push(...handler.stack);
      this.stack.push(handler);
    }

    return next();
  };
}
/* eslint-disable no-unused-expressions */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3JvdXRlLmpzIl0sIm5hbWVzIjpbInJvdXRlIiwicm91dGVyIiwibmV4dCIsInVybCIsIm1ldGhvZCIsImhhbmRsZXIiLCJwYXJhbXMiLCJtYXRjaCIsImRhdGEiLCJzdGFjayIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU13QkEsSzs7QUFKeEI7Ozs7OztBQUllLFNBQVNBLEtBQVQsQ0FBZUMsTUFBZixFQUEyQztBQUN4RCxTQUFPLFNBQVNELEtBQVQsQ0FBZUUsSUFBZixFQUEyQjtBQUMvQixRQUFEOztBQUVBLFVBQU1DLE1BQU0sS0FBS0EsR0FBakI7QUFDQSxRQUFJQyxTQUFTLEtBQUtBLE1BQWxCO0FBQ0EsUUFBSUEsV0FBVyxNQUFmLEVBQXVCO0FBQ3JCO0FBQ0FBLGVBQVMsS0FBVDtBQUNEOztBQUVELFVBQU0sRUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQW9CTCxPQUFPTSxLQUFQLENBQWFILE1BQWIsRUFBcUJELEdBQXJCLENBQTFCOztBQUVBLFFBQUlFLE9BQUosRUFBYTtBQUNYLFdBQUtHLElBQUwsQ0FBVUYsTUFBVixHQUFtQkEsTUFBbkI7O0FBRUEsVUFBSUQsUUFBUUksS0FBWixFQUFtQixLQUFLQSxLQUFMLENBQVdDLElBQVgsQ0FBZ0IsR0FBR0wsUUFBUUksS0FBM0I7QUFDbkIsV0FBS0EsS0FBTCxDQUFXQyxJQUFYLENBQWdCTCxPQUFoQjtBQUNEOztBQUVELFdBQU9ILE1BQVA7QUFDRCxHQXBCRDtBQXFCRDtBQTNCRCIsImZpbGUiOiJyb3V0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCBSb3V0ZXIgZnJvbSBcIi4uL3JvdXRlclwiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJvdXRlKHJvdXRlcjogUm91dGVyKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBmdW5jdGlvbiByb3V0ZShuZXh0OiBOZXh0KSB7XG4gICAgKHRoaXM6IENvbnRleHQpXG5cbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybFxuICAgIGxldCBtZXRob2QgPSB0aGlzLm1ldGhvZFxuICAgIGlmIChtZXRob2QgPT09IFwiSEVBRFwiKSB7XG4gICAgICAvKiBUcmVhdCBIRUFEIHJlcXVlc3RzIGFzIEdFVC4gKi9cbiAgICAgIG1ldGhvZCA9IFwiR0VUXCJcbiAgICB9XG5cbiAgICBjb25zdCB7aGFuZGxlciwgcGFyYW1zfSA9IHJvdXRlci5tYXRjaChtZXRob2QsIHVybClcblxuICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICB0aGlzLmRhdGEucGFyYW1zID0gcGFyYW1zXG5cbiAgICAgIGlmIChoYW5kbGVyLnN0YWNrKSB0aGlzLnN0YWNrLnB1c2goLi4uaGFuZGxlci5zdGFjaylcbiAgICAgIHRoaXMuc3RhY2sucHVzaChoYW5kbGVyKVxuICAgIH1cblxuICAgIHJldHVybiBuZXh0KClcbiAgfVxufVxuIl19