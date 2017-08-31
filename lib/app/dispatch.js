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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAvZGlzcGF0Y2guanMiXSwibmFtZXMiOlsiZGlzcGF0Y2giLCJpbml0aWFsU3RhY2siLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJzdGFjayIsInNsaWNlIiwiaGFuZGxlciIsIlByb21pc2UiLCJyZXNvbHZlIiwiY2F0Y2giLCJlcnIiLCJwcm9jZXNzIiwibmV4dFRpY2siXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU93QkEsUTs7QUFOeEI7Ozs7QUFDQTs7Ozs7O0FBS2UsU0FBU0EsUUFBVCxDQUFrQkMsWUFBbEIsRUFBdUM7QUFDcEQsU0FBTyxTQUFTRCxRQUFULENBQWtCRSxPQUFsQixFQUFvQ0MsUUFBcEMsRUFBOEQ7QUFDbkUsVUFBTUMsUUFBUUgsYUFBYUksS0FBYixDQUFtQixDQUFuQixDQUFkO0FBQ0EsVUFBTUMsVUFBVSx1QkFBUUYsS0FBUixFQUFlLHNCQUFZQSxLQUFaLEVBQW1CRixPQUFuQixFQUE0QkMsUUFBNUIsQ0FBZixDQUFoQjs7QUFFQUksWUFBUUMsT0FBUixDQUFnQkYsU0FBaEIsRUFBMkJHLEtBQTNCLENBQWlDQyxPQUFPO0FBQ3RDQyxjQUFRQyxRQUFSLENBQWlCLE1BQU07QUFBQyxjQUFNRixHQUFOO0FBQVUsT0FBbEM7QUFDRCxLQUZEO0FBR0QsR0FQRDtBQVFEIiwiZmlsZSI6ImRpc3BhdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBDb250ZXh0IGZyb20gXCIuL2NvbnRleHRcIlxuaW1wb3J0IGNvbXBvc2UgZnJvbSBcIi4vY29tcG9zZVwiXG5cbmltcG9ydCB0eXBlIHtTdGFja30gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tIFwiLi9jb250ZXh0XCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlzcGF0Y2goaW5pdGlhbFN0YWNrOiBTdGFjaykge1xuICByZXR1cm4gZnVuY3Rpb24gZGlzcGF0Y2gocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhY2sgPSBpbml0aWFsU3RhY2suc2xpY2UoMClcbiAgICBjb25zdCBoYW5kbGVyID0gY29tcG9zZShzdGFjaywgbmV3IENvbnRleHQoc3RhY2ssIHJlcXVlc3QsIHJlc3BvbnNlKSlcblxuICAgIFByb21pc2UucmVzb2x2ZShoYW5kbGVyKCkpLmNhdGNoKGVyciA9PiB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHt0aHJvdyBlcnJ9KVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==