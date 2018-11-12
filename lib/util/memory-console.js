"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MemoryConsole = undefined;

var _bufferStream = require("./buffer-stream");

var _bufferStream2 = _interopRequireDefault(_bufferStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MemoryConsole = exports.MemoryConsole = class MemoryConsole extends console.Console {

  constructor() {
    const stdout = new _bufferStream2.default();
    const stderr = new _bufferStream2.default();
    super(stdout, stderr);

    this.stdout = stdout;
    this.stderr = stderr;
    Object.freeze(this);
  }

  clear() {
    this.stdout.clear();
    this.stderr.clear();
  }
};
/* eslint-disable no-console */

exports.default = MemoryConsole;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL21lbW9yeS1jb25zb2xlLmpzIl0sIm5hbWVzIjpbIk1lbW9yeUNvbnNvbGUiLCJjb25zb2xlIiwiQ29uc29sZSIsImNvbnN0cnVjdG9yIiwic3Rkb3V0IiwiQnVmZmVyU3RyZWFtIiwic3RkZXJyIiwiT2JqZWN0IiwiZnJlZXplIiwiY2xlYXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7O0lBRWFBLGEsV0FBQUEsYSxHQUFOLE1BQU1BLGFBQU4sU0FBNEJDLFFBQVFDLE9BQXBDLENBQTRDOztBQUlqREMsZ0JBQWM7QUFDWixVQUFNQyxTQUFTLElBQUlDLHNCQUFKLEVBQWY7QUFDQSxVQUFNQyxTQUFTLElBQUlELHNCQUFKLEVBQWY7QUFDQSxVQUFNRCxNQUFOLEVBQWNFLE1BQWQ7O0FBRUEsU0FBS0YsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0UsTUFBTCxHQUFjQSxNQUFkO0FBQ0FDLFdBQU9DLE1BQVAsQ0FBYyxJQUFkO0FBQ0Q7O0FBRURDLFVBQVE7QUFDTixTQUFLTCxNQUFMLENBQVlLLEtBQVo7QUFDQSxTQUFLSCxNQUFMLENBQVlHLEtBQVo7QUFDRDtBQWpCZ0QsQztBQUhuRDs7a0JBdUJlVCxhIiwiZmlsZSI6Im1lbW9yeS1jb25zb2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCBCdWZmZXJTdHJlYW0gZnJvbSBcIi4vYnVmZmVyLXN0cmVhbVwiXG5cbmV4cG9ydCBjbGFzcyBNZW1vcnlDb25zb2xlIGV4dGVuZHMgY29uc29sZS5Db25zb2xlIHtcbiAgc3Rkb3V0OiBCdWZmZXJTdHJlYW1cbiAgc3RkZXJyOiBCdWZmZXJTdHJlYW1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzdGRvdXQgPSBuZXcgQnVmZmVyU3RyZWFtXG4gICAgY29uc3Qgc3RkZXJyID0gbmV3IEJ1ZmZlclN0cmVhbVxuICAgIHN1cGVyKHN0ZG91dCwgc3RkZXJyKVxuXG4gICAgdGhpcy5zdGRvdXQgPSBzdGRvdXRcbiAgICB0aGlzLnN0ZGVyciA9IHN0ZGVyclxuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuc3Rkb3V0LmNsZWFyKClcbiAgICB0aGlzLnN0ZGVyci5jbGVhcigpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVtb3J5Q29uc29sZVxuIl19