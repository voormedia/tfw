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
    _application2.default.start(options);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9zdGFydC5qcyJdLCJuYW1lcyI6WyJzdGFydCIsIm9wdGlvbnMiLCJPYmplY3QiLCJzZWFsIiwib2JqZWN0Iiwicm91dGVyIiwicHJvdG90eXBlIl0sIm1hcHBpbmdzIjoiOzs7OztRQU1nQkEsSyxHQUFBQSxLOztBQUxoQjs7OztBQUNBOzs7Ozs7QUFJTyxTQUFTQSxLQUFULENBQWVDLFVBQThCQyxPQUFPQyxJQUFQLENBQVksRUFBWixDQUE3QyxFQUF5RTtBQUM5RSxTQUFRQyxNQUFELElBQW9CO0FBQ3pCSCxZQUFRSSxNQUFSLEdBQWlCLHlCQUFVRCxPQUFPRSxTQUFqQixDQUFqQjtBQUNBLDBCQUFZTixLQUFaLENBQWtCQyxPQUFsQjtBQUNELEdBSEQ7QUFJRCIsImZpbGUiOiJzdGFydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgcm91dGVyaWZ5IGZyb20gXCIuL3V0aWwvcm91dGVyaWZ5XCJcbmltcG9ydCBBcHBsaWNhdGlvbiBmcm9tIFwiLi4vYXBwbGljYXRpb25cIlxuXG5pbXBvcnQgdHlwZSB7QXBwbGljYXRpb25PcHRpb25zfSBmcm9tIFwiLi4vYXBwbGljYXRpb25cIlxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnQob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKTogRGVjb3JhdG9yIHtcbiAgcmV0dXJuIChvYmplY3Q6IE9iamVjdCkgPT4ge1xuICAgIG9wdGlvbnMucm91dGVyID0gcm91dGVyaWZ5KG9iamVjdC5wcm90b3R5cGUpXG4gICAgQXBwbGljYXRpb24uc3RhcnQob3B0aW9ucylcbiAgfVxufVxuIl19