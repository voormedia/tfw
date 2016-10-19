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
    const ctx = this;

    let { method, url } = ctx.req;

    if (method === "HEAD") {
      /* Treat HEAD requests as GET. */
      method = "GET";
    }

    const { handler, params } = router.match(method, url);

    if (handler) {
      ctx.data.params = params;

      if (handler.stack) ctx.stack.push(...handler.stack);
      ctx.stack.push(handler);
    }

    return next();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3JvdXRlLmpzIl0sIm5hbWVzIjpbInJvdXRlIiwicm91dGVyIiwibmV4dCIsImN0eCIsIm1ldGhvZCIsInVybCIsInJlcSIsImhhbmRsZXIiLCJwYXJhbXMiLCJtYXRjaCIsImRhdGEiLCJzdGFjayIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUt3QkEsSzs7QUFKeEI7Ozs7OztBQUllLFNBQVNBLEtBQVQsQ0FBZUMsTUFBZixFQUEyQztBQUN4RCxTQUFPLFNBQVNELEtBQVQsQ0FBZUUsSUFBZixFQUEyQjtBQUNoQyxVQUFNQyxNQUFlLElBQXJCOztBQUVBLFFBQUksRUFBQ0MsTUFBRCxFQUFTQyxHQUFULEtBQWdCRixJQUFJRyxHQUF4Qjs7QUFFQSxRQUFJRixXQUFXLE1BQWYsRUFBdUI7QUFDckI7QUFDQUEsZUFBUyxLQUFUO0FBQ0Q7O0FBRUQsVUFBTSxFQUFDRyxPQUFELEVBQVVDLE1BQVYsS0FBb0JQLE9BQU9RLEtBQVAsQ0FBYUwsTUFBYixFQUFxQkMsR0FBckIsQ0FBMUI7O0FBRUEsUUFBSUUsT0FBSixFQUFhO0FBQ1hKLFVBQUlPLElBQUosQ0FBU0YsTUFBVCxHQUFrQkEsTUFBbEI7O0FBRUEsVUFBSUQsUUFBUUksS0FBWixFQUFtQlIsSUFBSVEsS0FBSixDQUFVQyxJQUFWLENBQWUsR0FBR0wsUUFBUUksS0FBMUI7QUFDbkJSLFVBQUlRLEtBQUosQ0FBVUMsSUFBVixDQUFlTCxPQUFmO0FBQ0Q7O0FBRUQsV0FBT0wsTUFBUDtBQUNELEdBcEJEO0FBcUJEIiwiZmlsZSI6InJvdXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBSb3V0ZXIgZnJvbSBcIi4uL3JvdXRlclwiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJvdXRlKHJvdXRlcjogUm91dGVyKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBmdW5jdGlvbiByb3V0ZShuZXh0OiBOZXh0KSB7XG4gICAgY29uc3QgY3R4OiBDb250ZXh0ID0gdGhpc1xuXG4gICAgbGV0IHttZXRob2QsIHVybH0gPSBjdHgucmVxXG5cbiAgICBpZiAobWV0aG9kID09PSBcIkhFQURcIikge1xuICAgICAgLyogVHJlYXQgSEVBRCByZXF1ZXN0cyBhcyBHRVQuICovXG4gICAgICBtZXRob2QgPSBcIkdFVFwiXG4gICAgfVxuXG4gICAgY29uc3Qge2hhbmRsZXIsIHBhcmFtc30gPSByb3V0ZXIubWF0Y2gobWV0aG9kLCB1cmwpXG5cbiAgICBpZiAoaGFuZGxlcikge1xuICAgICAgY3R4LmRhdGEucGFyYW1zID0gcGFyYW1zXG5cbiAgICAgIGlmIChoYW5kbGVyLnN0YWNrKSBjdHguc3RhY2sucHVzaCguLi5oYW5kbGVyLnN0YWNrKVxuICAgICAgY3R4LnN0YWNrLnB1c2goaGFuZGxlcilcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dCgpXG4gIH1cbn1cbiJdfQ==