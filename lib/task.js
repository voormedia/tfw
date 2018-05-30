"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Task = undefined;

require("./util/polyfill");

var _abstractTask = require("./util/abstract-task");

var _abstractTask2 = _interopRequireDefault(_abstractTask);

var _logger = require("./util/logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* $Shape<T> makes every property optional. */
let Task = exports.Task = class Task extends _abstractTask2.default {
  /* Start a new task with the given options in next tick. */
  static start(options = {}) {
    const task = new Task(options);
    process.nextTick(() => {
      task.start();
    });
    return task;
  }

  constructor(options = {}) {
    const {
      logger = new _logger2.default()
    } = options;

    super();

    this.logger = logger;

    Object.freeze(this);
  }

  async start() {
    await super.start();
    await this.run();
    await this.stop();
  }

  async run() {}
};
exports.default = Task;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90YXNrLmpzIl0sIm5hbWVzIjpbIlRhc2siLCJzdGFydCIsIm9wdGlvbnMiLCJ0YXNrIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJsb2dnZXIiLCJPYmplY3QiLCJmcmVlemUiLCJydW4iLCJzdG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUE7SUFLYUEsSSxXQUFBQSxJLEdBQU4sTUFBTUEsSUFBTixnQ0FBZ0M7QUFDckM7QUFDQSxTQUFPQyxLQUFQLENBQWFDLFVBQXVCLEVBQXBDLEVBQXdDO0FBQ3RDLFVBQU1DLE9BQU8sSUFBSUgsSUFBSixDQUFTRSxPQUFULENBQWI7QUFDQUUsWUFBUUMsUUFBUixDQUFpQixNQUFNO0FBQUNGLFdBQUtGLEtBQUw7QUFBYSxLQUFyQztBQUNBLFdBQU9FLElBQVA7QUFDRDs7QUFFREcsY0FBWUosVUFBdUIsRUFBbkMsRUFBdUM7QUFDckMsVUFBTTtBQUNKSyxlQUFTO0FBREwsUUFFRkwsT0FGSjs7QUFJQTs7QUFFQSxTQUFLSyxNQUFMLEdBQWNBLE1BQWQ7O0FBRUFDLFdBQU9DLE1BQVAsQ0FBYyxJQUFkO0FBQ0Q7O0FBRUQsUUFBTVIsS0FBTixHQUE2QjtBQUMzQixVQUFNLE1BQU1BLEtBQU4sRUFBTjtBQUNBLFVBQU0sS0FBS1MsR0FBTCxFQUFOO0FBQ0EsVUFBTSxLQUFLQyxJQUFMLEVBQU47QUFDRDs7QUFFRCxRQUFNRCxHQUFOLEdBQTJCLENBQUU7QUExQlEsQztrQkE2QnhCVixJIiwiZmlsZSI6InRhc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IFwiLi91dGlsL3BvbHlmaWxsXCJcblxuaW1wb3J0IEFic3RyYWN0VGFzayBmcm9tIFwiLi91dGlsL2Fic3RyYWN0LXRhc2tcIlxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi91dGlsL2xvZ2dlclwiXG5cbi8qICRTaGFwZTxUPiBtYWtlcyBldmVyeSBwcm9wZXJ0eSBvcHRpb25hbC4gKi9cbmV4cG9ydCB0eXBlIFRhc2tPcHRpb25zID0gJFNoYXBlPHtcbiAgbG9nZ2VyOiBMb2dnZXIsXG59PlxuXG5leHBvcnQgY2xhc3MgVGFzayBleHRlbmRzIEFic3RyYWN0VGFzayB7XG4gIC8qIFN0YXJ0IGEgbmV3IHRhc2sgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBUYXNrT3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdGFzayA9IG5ldyBUYXNrKG9wdGlvbnMpXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7dGFzay5zdGFydCgpfSlcbiAgICByZXR1cm4gdGFza1xuICB9XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogVGFza09wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIHN1cGVyKClcblxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG4gIH1cblxuICBhc3luYyBzdGFydCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzdXBlci5zdGFydCgpXG4gICAgYXdhaXQgdGhpcy5ydW4oKVxuICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gIH1cblxuICBhc3luYyBydW4oKTogUHJvbWlzZTx2b2lkPiB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBUYXNrXG4iXX0=