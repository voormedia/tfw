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

function start(options = Object.seal({})) {
  return object => {
    options.router = (0, _routerify2.default)(object.prototype);
    object.instance = _application2.default.start(options);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9zdGFydC5qcyJdLCJuYW1lcyI6WyJzdGFydCIsIm9wdGlvbnMiLCJPYmplY3QiLCJzZWFsIiwib2JqZWN0Iiwicm91dGVyIiwicHJvdG90eXBlIiwiaW5zdGFuY2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCQSxLLEdBQUFBLEs7O0FBTGhCOzs7O0FBQ0E7Ozs7OztBQUlPLFNBQVNBLEtBQVQsQ0FBZUMsVUFBOEJDLE9BQU9DLElBQVAsQ0FBWSxFQUFaLENBQTdDLEVBQXlFO0FBQzlFLFNBQVFDLE1BQUQsSUFBb0I7QUFDekJILFlBQVFJLE1BQVIsR0FBaUIseUJBQVVELE9BQU9FLFNBQWpCLENBQWpCO0FBQ0FGLFdBQU9HLFFBQVAsR0FBa0Isc0JBQVlQLEtBQVosQ0FBa0JDLE9BQWxCLENBQWxCO0FBQ0QsR0FIRDtBQUlEIiwiZmlsZSI6InN0YXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCByb3V0ZXJpZnkgZnJvbSBcIi4vdXRpbC9yb3V0ZXJpZnlcIlxuaW1wb3J0IEFwcGxpY2F0aW9uIGZyb20gXCIuLi9hcHBsaWNhdGlvblwiXG5cbmltcG9ydCB0eXBlIHtBcHBsaWNhdGlvbk9wdGlvbnN9IGZyb20gXCIuLi9hcHBsaWNhdGlvblwiXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSBPYmplY3Quc2VhbCh7fSkpOiBEZWNvcmF0b3Ige1xuICByZXR1cm4gKG9iamVjdDogT2JqZWN0KSA9PiB7XG4gICAgb3B0aW9ucy5yb3V0ZXIgPSByb3V0ZXJpZnkob2JqZWN0LnByb3RvdHlwZSlcbiAgICBvYmplY3QuaW5zdGFuY2UgPSBBcHBsaWNhdGlvbi5zdGFydChvcHRpb25zKVxuICB9XG59XG4iXX0=