"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dispatch;

var _context = require("./context");

var _context2 = _interopRequireDefault(_context);

var _compose = require("./compose");

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatch(initialStack) {
  return function dispatch(request, response) {
    const stack = initialStack.slice(0);
    const handler = (0, _compose2.default)(stack, new _context2.default(stack, request, response));

    Promise.resolve(handler()).catch(err => {
      process.nextTick(() => {
        throw err;
      });
    });
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAvZGlzcGF0Y2guanMiXSwibmFtZXMiOlsiZGlzcGF0Y2giLCJpbml0aWFsU3RhY2siLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzdGFjayIsInNsaWNlIiwiaGFuZGxlciIsIkNvbnRleHQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImNhdGNoIiwiZXJyIiwicHJvY2VzcyIsIm5leHRUaWNrIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFPd0JBLFE7O0FBTnhCOzs7O0FBQ0E7Ozs7OztBQUtlLFNBQVNBLFFBQVQsQ0FBa0JDLFlBQWxCLEVBQXVDO0FBQ3BELFNBQU8sU0FBU0QsUUFBVCxDQUFrQkUsT0FBbEIsRUFBb0NDLFFBQXBDLEVBQThEO0FBQ25FLFVBQU1DLFFBQVFILGFBQWFJLEtBQWIsQ0FBbUIsQ0FBbkIsQ0FBZDtBQUNBLFVBQU1DLFVBQVUsdUJBQVFGLEtBQVIsRUFBZSxJQUFJRyxpQkFBSixDQUFZSCxLQUFaLEVBQW1CRixPQUFuQixFQUE0QkMsUUFBNUIsQ0FBZixDQUFoQjs7QUFFQUssWUFBUUMsT0FBUixDQUFnQkgsU0FBaEIsRUFBMkJJLEtBQTNCLENBQWlDQyxPQUFPO0FBQ3RDQyxjQUFRQyxRQUFSLENBQWlCLE1BQU07QUFBQyxjQUFNRixHQUFOO0FBQVUsT0FBbEM7QUFDRCxLQUZEO0FBR0QsR0FQRDtBQVFEIiwiZmlsZSI6ImRpc3BhdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBDb250ZXh0IGZyb20gXCIuL2NvbnRleHRcIlxuaW1wb3J0IGNvbXBvc2UgZnJvbSBcIi4vY29tcG9zZVwiXG5cbmltcG9ydCB0eXBlIHtTdGFja30gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tIFwiLi9jb250ZXh0XCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlzcGF0Y2goaW5pdGlhbFN0YWNrOiBTdGFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gZGlzcGF0Y2gocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhY2sgPSBpbml0aWFsU3RhY2suc2xpY2UoMClcbiAgICBjb25zdCBoYW5kbGVyID0gY29tcG9zZShzdGFjaywgbmV3IENvbnRleHQoc3RhY2ssIHJlcXVlc3QsIHJlc3BvbnNlKSlcblxuICAgIFByb21pc2UucmVzb2x2ZShoYW5kbGVyKCkpLmNhdGNoKGVyciA9PiB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHt0aHJvdyBlcnJ9KVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==