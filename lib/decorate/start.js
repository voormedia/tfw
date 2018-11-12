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
    object.instance = _application2.default.start(options);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9zdGFydC5qcyJdLCJuYW1lcyI6WyJzdGFydCIsIm9wdGlvbnMiLCJvYmplY3QiLCJyb3V0ZXIiLCJwcm90b3R5cGUiLCJpbnN0YW5jZSIsIkFwcGxpY2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7OztRQU1nQkEsSyxHQUFBQSxLOztBQUxoQjs7OztBQUNBOzs7Ozs7QUFJTyxTQUFTQSxLQUFULENBQWVDLFVBQThCLEVBQTdDLEVBQTREO0FBQ2pFLFNBQVFDLE1BQUQsSUFBb0I7QUFDekJELFlBQVFFLE1BQVIsR0FBaUIseUJBQVVELE9BQU9FLFNBQWpCLENBQWpCO0FBQ0FGLFdBQU9HLFFBQVAsR0FBa0JDLHNCQUFZTixLQUFaLENBQWtCQyxPQUFsQixDQUFsQjtBQUNELEdBSEQ7QUFJRCIsImZpbGUiOiJzdGFydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgcm91dGVyaWZ5IGZyb20gXCIuL3V0aWwvcm91dGVyaWZ5XCJcbmltcG9ydCBBcHBsaWNhdGlvbiBmcm9tIFwiLi4vYXBwbGljYXRpb25cIlxuXG5pbXBvcnQgdHlwZSB7QXBwbGljYXRpb25PcHRpb25zfSBmcm9tIFwiLi4vYXBwbGljYXRpb25cIlxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnQob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0ge30pOiBEZWNvcmF0b3Ige1xuICByZXR1cm4gKG9iamVjdDogT2JqZWN0KSA9PiB7XG4gICAgb3B0aW9ucy5yb3V0ZXIgPSByb3V0ZXJpZnkob2JqZWN0LnByb3RvdHlwZSlcbiAgICBvYmplY3QuaW5zdGFuY2UgPSBBcHBsaWNhdGlvbi5zdGFydChvcHRpb25zKVxuICB9XG59XG4iXX0=