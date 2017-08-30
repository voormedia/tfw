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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL21lbW9yeS1jb25zb2xlLmpzIl0sIm5hbWVzIjpbIk1lbW9yeUNvbnNvbGUiLCJjb25zb2xlIiwiQ29uc29sZSIsImNvbnN0cnVjdG9yIiwic3Rkb3V0Iiwic3RkZXJyIiwiT2JqZWN0IiwiZnJlZXplIiwiY2xlYXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7O0lBRWFBLGEsV0FBQUEsYSxHQUFOLE1BQU1BLGFBQU4sU0FBNEJDLFFBQVFDLE9BQXBDLENBQTRDOztBQUlqREMsZ0JBQWM7QUFDWixVQUFNQyxTQUFTLDRCQUFmO0FBQ0EsVUFBTUMsU0FBUyw0QkFBZjtBQUNBLFVBQU1ELE1BQU4sRUFBY0MsTUFBZDs7QUFFQSxTQUFLRCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDQUMsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFREMsVUFBUTtBQUNOLFNBQUtKLE1BQUwsQ0FBWUksS0FBWjtBQUNBLFNBQUtILE1BQUwsQ0FBWUcsS0FBWjtBQUNEO0FBakJnRCxDO0FBSG5EOztrQkF1QmVSLGEiLCJmaWxlIjoibWVtb3J5LWNvbnNvbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IEJ1ZmZlclN0cmVhbSBmcm9tIFwiLi9idWZmZXItc3RyZWFtXCJcblxuZXhwb3J0IGNsYXNzIE1lbW9yeUNvbnNvbGUgZXh0ZW5kcyBjb25zb2xlLkNvbnNvbGUge1xuICBzdGRvdXQ6IEJ1ZmZlclN0cmVhbVxuICBzdGRlcnI6IEJ1ZmZlclN0cmVhbVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHN0ZG91dCA9IG5ldyBCdWZmZXJTdHJlYW1cbiAgICBjb25zdCBzdGRlcnIgPSBuZXcgQnVmZmVyU3RyZWFtXG4gICAgc3VwZXIoc3Rkb3V0LCBzdGRlcnIpXG5cbiAgICB0aGlzLnN0ZG91dCA9IHN0ZG91dFxuICAgIHRoaXMuc3RkZXJyID0gc3RkZXJyXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5zdGRvdXQuY2xlYXIoKVxuICAgIHRoaXMuc3RkZXJyLmNsZWFyKClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZW1vcnlDb25zb2xlXG4iXX0=