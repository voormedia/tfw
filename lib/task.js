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
    super();

    const {
      logger = new _logger2.default(this.description)
    } = options;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90YXNrLmpzIl0sIm5hbWVzIjpbIlRhc2siLCJzdGFydCIsIm9wdGlvbnMiLCJ0YXNrIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJsb2dnZXIiLCJkZXNjcmlwdGlvbiIsIk9iamVjdCIsImZyZWV6ZSIsInJ1biIsInN0b3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQTtJQUthQSxJLFdBQUFBLEksR0FBTixNQUFNQSxJQUFOLGdDQUFnQztBQUNyQztBQUNBLFNBQU9DLEtBQVAsQ0FBYUMsVUFBdUIsRUFBcEMsRUFBd0M7QUFDdEMsVUFBTUMsT0FBTyxJQUFJLElBQUosQ0FBU0QsT0FBVCxDQUFiO0FBQ0FFLFlBQVFDLFFBQVIsQ0FBaUIsTUFBTTtBQUFDRixXQUFLRixLQUFMO0FBQWEsS0FBckM7QUFDQSxXQUFPRSxJQUFQO0FBQ0Q7O0FBRURHLGNBQVlKLFVBQXVCLEVBQW5DLEVBQXVDO0FBQ3JDOztBQUVBLFVBQU07QUFDSkssZUFBUyxxQkFBVyxLQUFLQyxXQUFoQjtBQURMLFFBRUZOLE9BRko7O0FBSUEsU0FBS0ssTUFBTCxHQUFjQSxNQUFkOztBQUVBRSxXQUFPQyxNQUFQLENBQWMsSUFBZDtBQUNEOztBQUVELFFBQU1ULEtBQU4sR0FBNkI7QUFDM0IsVUFBTSxNQUFNQSxLQUFOLEVBQU47QUFDQSxVQUFNLEtBQUtVLEdBQUwsRUFBTjtBQUNBLFVBQU0sS0FBS0MsSUFBTCxFQUFOO0FBQ0Q7O0FBRUQsUUFBTUQsR0FBTixHQUEyQixDQUFFO0FBMUJRLEM7a0JBNkJ4QlgsSSIsImZpbGUiOiJ0YXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBcIi4vdXRpbC9wb2x5ZmlsbFwiXG5cbmltcG9ydCBBYnN0cmFjdFRhc2sgZnJvbSBcIi4vdXRpbC9hYnN0cmFjdC10YXNrXCJcbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vdXRpbC9sb2dnZXJcIlxuXG4vKiAkU2hhcGU8VD4gbWFrZXMgZXZlcnkgcHJvcGVydHkgb3B0aW9uYWwuICovXG5leHBvcnQgdHlwZSBUYXNrT3B0aW9ucyA9ICRTaGFwZTx7XG4gIGxvZ2dlcjogTG9nZ2VyLFxufT5cblxuZXhwb3J0IGNsYXNzIFRhc2sgZXh0ZW5kcyBBYnN0cmFjdFRhc2sge1xuICAvKiBTdGFydCBhIG5ldyB0YXNrIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgaW4gbmV4dCB0aWNrLiAqL1xuICBzdGF0aWMgc3RhcnQob3B0aW9uczogVGFza09wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHRhc2sgPSBuZXcgdGhpcyhvcHRpb25zKVxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge3Rhc2suc3RhcnQoKX0pXG4gICAgcmV0dXJuIHRhc2tcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFRhc2tPcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG5cbiAgICBjb25zdCB7XG4gICAgICBsb2dnZXIgPSBuZXcgTG9nZ2VyKHRoaXMuZGVzY3JpcHRpb24pLFxuICAgIH0gPSBvcHRpb25zXG5cbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlclxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgc3VwZXIuc3RhcnQoKVxuICAgIGF3YWl0IHRoaXMucnVuKClcbiAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICB9XG5cbiAgYXN5bmMgcnVuKCk6IFByb21pc2U8dm9pZD4ge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGFza1xuIl19