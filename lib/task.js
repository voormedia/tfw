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
    const task = new this(options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90YXNrLmpzIl0sIm5hbWVzIjpbIlRhc2siLCJzdGFydCIsIm9wdGlvbnMiLCJ0YXNrIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJsb2dnZXIiLCJPYmplY3QiLCJmcmVlemUiLCJydW4iLCJzdG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUE7SUFLYUEsSSxXQUFBQSxJLEdBQU4sTUFBTUEsSUFBTixnQ0FBZ0M7QUFDckM7QUFDQSxTQUFPQyxLQUFQLENBQWFDLFVBQXVCLEVBQXBDLEVBQXdDO0FBQ3RDLFVBQU1DLE9BQU8sSUFBSSxJQUFKLENBQVNELE9BQVQsQ0FBYjtBQUNBRSxZQUFRQyxRQUFSLENBQWlCLE1BQU07QUFBQ0YsV0FBS0YsS0FBTDtBQUFhLEtBQXJDO0FBQ0EsV0FBT0UsSUFBUDtBQUNEOztBQUVERyxjQUFZSixVQUF1QixFQUFuQyxFQUF1QztBQUNyQyxVQUFNO0FBQ0pLLGVBQVM7QUFETCxRQUVGTCxPQUZKOztBQUlBOztBQUVBLFNBQUtLLE1BQUwsR0FBY0EsTUFBZDs7QUFFQUMsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFRCxRQUFNUixLQUFOLEdBQTZCO0FBQzNCLFVBQU0sTUFBTUEsS0FBTixFQUFOO0FBQ0EsVUFBTSxLQUFLUyxHQUFMLEVBQU47QUFDQSxVQUFNLEtBQUtDLElBQUwsRUFBTjtBQUNEOztBQUVELFFBQU1ELEdBQU4sR0FBMkIsQ0FBRTtBQTFCUSxDO2tCQTZCeEJWLEkiLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgXCIuL3V0aWwvcG9seWZpbGxcIlxuXG5pbXBvcnQgQWJzdHJhY3RUYXNrIGZyb20gXCIuL3V0aWwvYWJzdHJhY3QtdGFza1wiXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL3V0aWwvbG9nZ2VyXCJcblxuLyogJFNoYXBlPFQ+IG1ha2VzIGV2ZXJ5IHByb3BlcnR5IG9wdGlvbmFsLiAqL1xuZXhwb3J0IHR5cGUgVGFza09wdGlvbnMgPSAkU2hhcGU8e1xuICBsb2dnZXI6IExvZ2dlcixcbn0+XG5cbmV4cG9ydCBjbGFzcyBUYXNrIGV4dGVuZHMgQWJzdHJhY3RUYXNrIHtcbiAgLyogU3RhcnQgYSBuZXcgdGFzayB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGluIG5leHQgdGljay4gKi9cbiAgc3RhdGljIHN0YXJ0KG9wdGlvbnM6IFRhc2tPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB0YXNrID0gbmV3IHRoaXMob3B0aW9ucylcbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHt0YXNrLnN0YXJ0KCl9KVxuICAgIHJldHVybiB0YXNrXG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBUYXNrT3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgbG9nZ2VyID0gbmV3IExvZ2dlcixcbiAgICB9ID0gb3B0aW9uc1xuXG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJcblxuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHN1cGVyLnN0YXJ0KClcbiAgICBhd2FpdCB0aGlzLnJ1bigpXG4gICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgfVxuXG4gIGFzeW5jIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHt9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhc2tcbiJdfQ==