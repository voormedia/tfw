"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routerify;

var _router = require("../../router");

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routerify(object) {
  if (!object.router) {
    Object.defineProperty(object, "router", {
      value: new _router2.default()
    });
  }

  return object.router;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kZWNvcmF0ZS91dGlsL3JvdXRlcmlmeS5qcyJdLCJuYW1lcyI6WyJyb3V0ZXJpZnkiLCJvYmplY3QiLCJyb3V0ZXIiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFHd0JBLFM7O0FBRnhCOzs7Ozs7QUFFZSxTQUFTQSxTQUFULENBQW1CQyxNQUFuQixFQUFtQztBQUNoRCxNQUFJLENBQUNBLE9BQU9DLE1BQVosRUFBb0I7QUFDbEJDLFdBQU9DLGNBQVAsQ0FBc0JILE1BQXRCLEVBQThCLFFBQTlCLEVBQXdDO0FBQ3RDSSxhQUFPO0FBRCtCLEtBQXhDO0FBR0Q7O0FBRUQsU0FBT0osT0FBT0MsTUFBZDtBQUNEIiwiZmlsZSI6InJvdXRlcmlmeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuLi8uLi9yb3V0ZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByb3V0ZXJpZnkob2JqZWN0OiBPYmplY3QpIHtcbiAgaWYgKCFvYmplY3Qucm91dGVyKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgXCJyb3V0ZXJcIiwge1xuICAgICAgdmFsdWU6IG5ldyBSb3V0ZXIsXG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBvYmplY3Qucm91dGVyXG59XG4iXX0=