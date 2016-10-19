"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _bufferStream = require("./buffer-stream");

var _bufferStream2 = _interopRequireDefault(_bufferStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let MemoryConsole = class MemoryConsole extends console.Console {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL21lbW9yeS1jb25zb2xlLmpzIl0sIm5hbWVzIjpbIk1lbW9yeUNvbnNvbGUiLCJjb25zb2xlIiwiQ29uc29sZSIsImNvbnN0cnVjdG9yIiwic3Rkb3V0Iiwic3RkZXJyIiwiT2JqZWN0IiwiZnJlZXplIiwiY2xlYXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7O0lBRXFCQSxhLEdBQU4sTUFBTUEsYUFBTixTQUE0QkMsUUFBUUMsT0FBcEMsQ0FBNEM7O0FBSXpEQyxnQkFBYztBQUNaLFVBQU1DLFNBQVMsNEJBQWY7QUFDQSxVQUFNQyxTQUFTLDRCQUFmO0FBQ0EsVUFBTUQsTUFBTixFQUFjQyxNQUFkOztBQUVBLFNBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBQyxXQUFPQyxNQUFQLENBQWMsSUFBZDtBQUNEOztBQUVEQyxVQUFRO0FBQ04sU0FBS0osTUFBTCxDQUFZSSxLQUFaO0FBQ0EsU0FBS0gsTUFBTCxDQUFZRyxLQUFaO0FBQ0Q7QUFqQndELEM7QUFIM0Q7O2tCQUdxQlIsYSIsImZpbGUiOiJtZW1vcnktY29uc29sZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgQnVmZmVyU3RyZWFtIGZyb20gXCIuL2J1ZmZlci1zdHJlYW1cIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW1vcnlDb25zb2xlIGV4dGVuZHMgY29uc29sZS5Db25zb2xlIHtcbiAgc3Rkb3V0OiBCdWZmZXJTdHJlYW1cbiAgc3RkZXJyOiBCdWZmZXJTdHJlYW1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzdGRvdXQgPSBuZXcgQnVmZmVyU3RyZWFtXG4gICAgY29uc3Qgc3RkZXJyID0gbmV3IEJ1ZmZlclN0cmVhbVxuICAgIHN1cGVyKHN0ZG91dCwgc3RkZXJyKVxuXG4gICAgdGhpcy5zdGRvdXQgPSBzdGRvdXRcbiAgICB0aGlzLnN0ZGVyciA9IHN0ZGVyclxuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuc3Rkb3V0LmNsZWFyKClcbiAgICB0aGlzLnN0ZGVyci5jbGVhcigpXG4gIH1cbn1cbiJdfQ==