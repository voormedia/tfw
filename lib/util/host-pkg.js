"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pkg = function () {
  let pkg;
  let mod = module;
  do {
    mod = mod.parent;
    if (!mod) throw new Error("No root module found!");
  } while (mod.id !== ".");

  let dir = mod.filename;
  do {
    dir = _path2.default.dirname(dir);
    if (dir === "/") throw new Error("No package.json found!");

    pkg = _path2.default.join(dir, "package.json");
  } while (!_fs2.default.existsSync(pkg));

  return require(pkg);
}();

exports.default = pkg;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2hvc3QtcGtnLmpzIl0sIm5hbWVzIjpbInBrZyIsIm1vZCIsIm1vZHVsZSIsInBhcmVudCIsIkVycm9yIiwiaWQiLCJkaXIiLCJmaWxlbmFtZSIsInBhdGgiLCJkaXJuYW1lIiwiam9pbiIsImZzIiwiZXhpc3RzU3luYyIsInJlcXVpcmUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLE1BQU0sWUFBVztBQUNyQixNQUFJQSxHQUFKO0FBQ0EsTUFBSUMsTUFBTUMsTUFBVjtBQUNBLEtBQUc7QUFDREQsVUFBTUEsSUFBSUUsTUFBVjtBQUNBLFFBQUksQ0FBQ0YsR0FBTCxFQUFVLE1BQU0sSUFBSUcsS0FBSixDQUFVLHVCQUFWLENBQU47QUFDWCxHQUhELFFBR1NILElBQUlJLEVBQUosS0FBVyxHQUhwQjs7QUFLQSxNQUFJQyxNQUFNTCxJQUFJTSxRQUFkO0FBQ0EsS0FBRztBQUNERCxVQUFNRSxlQUFLQyxPQUFMLENBQWFILEdBQWIsQ0FBTjtBQUNBLFFBQUlBLFFBQVEsR0FBWixFQUFpQixNQUFNLElBQUlGLEtBQUosQ0FBVSx3QkFBVixDQUFOOztBQUVqQkosVUFBTVEsZUFBS0UsSUFBTCxDQUFVSixHQUFWLEVBQWUsY0FBZixDQUFOO0FBQ0QsR0FMRCxRQUtTLENBQUNLLGFBQUdDLFVBQUgsQ0FBY1osR0FBZCxDQUxWOztBQU9BLFNBQU9hLFFBQVFiLEdBQVIsQ0FBUDtBQUNELENBakJXLEVBQVo7O2tCQW1CZUEsRyIsImZpbGUiOiJob3N0LXBrZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgZnMgZnJvbSBcImZzXCJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcblxuY29uc3QgcGtnID0gZnVuY3Rpb24oKSB7XG4gIGxldCBwa2dcbiAgbGV0IG1vZCA9IG1vZHVsZVxuICBkbyB7XG4gICAgbW9kID0gbW9kLnBhcmVudFxuICAgIGlmICghbW9kKSB0aHJvdyBuZXcgRXJyb3IoXCJObyByb290IG1vZHVsZSBmb3VuZCFcIilcbiAgfSB3aGlsZSAobW9kLmlkICE9PSBcIi5cIilcblxuICBsZXQgZGlyID0gbW9kLmZpbGVuYW1lXG4gIGRvIHtcbiAgICBkaXIgPSBwYXRoLmRpcm5hbWUoZGlyKVxuICAgIGlmIChkaXIgPT09IFwiL1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJObyBwYWNrYWdlLmpzb24gZm91bmQhXCIpXG5cbiAgICBwa2cgPSBwYXRoLmpvaW4oZGlyLCBcInBhY2thZ2UuanNvblwiKVxuICB9IHdoaWxlICghZnMuZXhpc3RzU3luYyhwa2cpKVxuXG4gIHJldHVybiByZXF1aXJlKHBrZylcbn0oKVxuXG5leHBvcnQgZGVmYXVsdCBwa2dcbiJdfQ==