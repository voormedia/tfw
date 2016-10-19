"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;

var _routerify = require("./util/routerify");

var _routerify2 = _interopRequireDefault(_routerify);

var _application = require("../application");

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start(options = {}) {
  return object => {
    options.router = (0, _routerify2.default)(object.prototype);
    _application2.default.start(options);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9zdGFydC5qcyJdLCJuYW1lcyI6WyJzdGFydCIsIm9wdGlvbnMiLCJvYmplY3QiLCJyb3V0ZXIiLCJwcm90b3R5cGUiXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCQSxLLEdBQUFBLEs7O0FBTGhCOzs7O0FBQ0E7Ozs7OztBQUlPLFNBQVNBLEtBQVQsQ0FBZUMsVUFBOEIsRUFBN0MsRUFBNEQ7QUFDakUsU0FBUUMsTUFBRCxJQUFvQjtBQUN6QkQsWUFBUUUsTUFBUixHQUFpQix5QkFBVUQsT0FBT0UsU0FBakIsQ0FBakI7QUFDQSwwQkFBWUosS0FBWixDQUFrQkMsT0FBbEI7QUFDRCxHQUhEO0FBSUQiLCJmaWxlIjoic3RhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHJvdXRlcmlmeSBmcm9tIFwiLi91dGlsL3JvdXRlcmlmeVwiXG5pbXBvcnQgQXBwbGljYXRpb24gZnJvbSBcIi4uL2FwcGxpY2F0aW9uXCJcblxuaW1wb3J0IHR5cGUge0FwcGxpY2F0aW9uT3B0aW9uc30gZnJvbSBcIi4uL2FwcGxpY2F0aW9uXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IHt9KTogRGVjb3JhdG9yIHtcbiAgcmV0dXJuIChvYmplY3Q6IE9iamVjdCkgPT4ge1xuICAgIG9wdGlvbnMucm91dGVyID0gcm91dGVyaWZ5KG9iamVjdC5wcm90b3R5cGUpXG4gICAgQXBwbGljYXRpb24uc3RhcnQob3B0aW9ucylcbiAgfVxufVxuIl19