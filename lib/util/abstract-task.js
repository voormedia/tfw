"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractTask = undefined;

var _hostPkg = require("./host-pkg");

var _hostPkg2 = _interopRequireDefault(_hostPkg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const description = `${_hostPkg2.default.name} service ${process.env.HOSTNAME || ""}`.trim();
let AbstractTask = exports.AbstractTask = class AbstractTask {

  constructor() {
    this.description = description;

    /* Assign default env. */
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = "development";
    }
  }

  async start() {
    process.on("SIGINT", async () => {
      await this.stop();
      process.exit(128 + 2);
    });

    process.on("SIGTERM", async () => {
      await this.stop();
      process.exit(128 + 15);
    });

    if (process.env.NODE_ENV !== "test") {
      process.on("uncaughtException", async err => {
        this.logger.critical(`uncaught ${err.stack}`);
        await this.kill();
        process.exit(1);
      });

      process.on("unhandledRejection", async (err, promise) => {
        this.logger.critical(`unhandled ${err.stack || err.toString()}`);
        await this.kill();
        process.exit(2);
      });
    }

    this.logger.notice(`starting ${this.description}`);
  }

  async stop() {
    this.logger.notice(`stopping ${this.description}`);
    /* Left up to implementation how to further deal with this scenario. */
  }

  async kill() {
    this.logger.warning(`forcefully stopped ${this.description}`);
    /* Left up to implementation how to further deal with this scenario. */
  }

  inspect() {
    return {};
  }
};
exports.default = AbstractTask;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2Fic3RyYWN0LXRhc2suanMiXSwibmFtZXMiOlsiZGVzY3JpcHRpb24iLCJob3N0UGtnIiwibmFtZSIsInByb2Nlc3MiLCJlbnYiLCJIT1NUTkFNRSIsInRyaW0iLCJBYnN0cmFjdFRhc2siLCJjb25zdHJ1Y3RvciIsIk5PREVfRU5WIiwic3RhcnQiLCJvbiIsInN0b3AiLCJleGl0IiwiZXJyIiwibG9nZ2VyIiwiY3JpdGljYWwiLCJzdGFjayIsImtpbGwiLCJwcm9taXNlIiwidG9TdHJpbmciLCJub3RpY2UiLCJ3YXJuaW5nIiwiaW5zcGVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7QUFJQSxNQUFNQSxjQUFlLEdBQUVDLGtCQUFRQyxJQUFLLFlBQVdDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixJQUF3QixFQUFHLEVBQXRELENBQXdEQyxJQUF4RCxFQUFwQjtJQUVhQyxZLFdBQUFBLFksR0FBTixNQUFNQSxZQUFOLENBQW1COztBQUl4QkMsZ0JBQWM7QUFBQSxTQUhkUixXQUdjLEdBSFFBLFdBR1I7O0FBQ1o7QUFDQSxRQUFJLENBQUNHLFFBQVFDLEdBQVIsQ0FBWUssUUFBakIsRUFBMkI7QUFDekJOLGNBQVFDLEdBQVIsQ0FBWUssUUFBWixHQUF1QixhQUF2QjtBQUNEO0FBQ0Y7O0FBRUQsUUFBTUMsS0FBTixHQUE2QjtBQUMzQlAsWUFBUVEsRUFBUixDQUFXLFFBQVgsRUFBcUIsWUFBWTtBQUMvQixZQUFNLEtBQUtDLElBQUwsRUFBTjtBQUNBVCxjQUFRVSxJQUFSLENBQWEsTUFBTSxDQUFuQjtBQUNELEtBSEQ7O0FBS0FWLFlBQVFRLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLFlBQVk7QUFDaEMsWUFBTSxLQUFLQyxJQUFMLEVBQU47QUFDQVQsY0FBUVUsSUFBUixDQUFhLE1BQU0sRUFBbkI7QUFDRCxLQUhEOztBQUtBLFFBQUlWLFFBQVFDLEdBQVIsQ0FBWUssUUFBWixLQUF5QixNQUE3QixFQUFxQztBQUNuQ04sY0FBUVEsRUFBUixDQUFXLG1CQUFYLEVBQWdDLE1BQU9HLEdBQVAsSUFBc0I7QUFDcEQsYUFBS0MsTUFBTCxDQUFZQyxRQUFaLENBQXNCLFlBQVdGLElBQUlHLEtBQU0sRUFBM0M7QUFDQSxjQUFNLEtBQUtDLElBQUwsRUFBTjtBQUNBZixnQkFBUVUsSUFBUixDQUFhLENBQWI7QUFDRCxPQUpEOztBQU1BVixjQUFRUSxFQUFSLENBQVcsb0JBQVgsRUFBaUMsT0FBT0csR0FBUCxFQUFtQkssT0FBbkIsS0FBNkM7QUFDNUUsYUFBS0osTUFBTCxDQUFZQyxRQUFaLENBQXNCLGFBQVlGLElBQUlHLEtBQUosSUFBYUgsSUFBSU0sUUFBSixFQUFlLEVBQTlEO0FBQ0EsY0FBTSxLQUFLRixJQUFMLEVBQU47QUFDQWYsZ0JBQVFVLElBQVIsQ0FBYSxDQUFiO0FBQ0QsT0FKRDtBQUtEOztBQUVELFNBQUtFLE1BQUwsQ0FBWU0sTUFBWixDQUFvQixZQUFXLEtBQUtyQixXQUFZLEVBQWhEO0FBQ0Q7O0FBRUQsUUFBTVksSUFBTixHQUE0QjtBQUMxQixTQUFLRyxNQUFMLENBQVlNLE1BQVosQ0FBb0IsWUFBVyxLQUFLckIsV0FBWSxFQUFoRDtBQUNBO0FBQ0Q7O0FBRUQsUUFBTWtCLElBQU4sR0FBNEI7QUFDMUIsU0FBS0gsTUFBTCxDQUFZTyxPQUFaLENBQXFCLHNCQUFxQixLQUFLdEIsV0FBWSxFQUEzRDtBQUNBO0FBQ0Q7O0FBRUR1QixZQUFVO0FBQ1IsV0FBTyxFQUFQO0FBQ0Q7QUFuRHVCLEM7a0JBc0RYaEIsWSIsImZpbGUiOiJhYnN0cmFjdC10YXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBob3N0UGtnIGZyb20gXCIuL2hvc3QtcGtnXCJcblxuaW1wb3J0IHR5cGUgTG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiXG5cbmNvbnN0IGRlc2NyaXB0aW9uID0gYCR7aG9zdFBrZy5uYW1lfSBzZXJ2aWNlICR7cHJvY2Vzcy5lbnYuSE9TVE5BTUUgfHwgXCJcIn1gLnRyaW0oKVxuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RUYXNrIHtcbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IGRlc2NyaXB0aW9uXG4gIGxvZ2dlcjogTG9nZ2VyXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyogQXNzaWduIGRlZmF1bHQgZW52LiAqL1xuICAgIGlmICghcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJkZXZlbG9wbWVudFwiXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcHJvY2Vzcy5vbihcIlNJR0lOVFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDEyOCArIDIpXG4gICAgfSlcblxuICAgIHByb2Nlc3Mub24oXCJTSUdURVJNXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMTI4ICsgMTUpXG4gICAgfSlcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJ0ZXN0XCIpIHtcbiAgICAgIHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiLCBhc3luYyAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5jcml0aWNhbChgdW5jYXVnaHQgJHtlcnIuc3RhY2t9YClcbiAgICAgICAgYXdhaXQgdGhpcy5raWxsKClcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICB9KVxuXG4gICAgICBwcm9jZXNzLm9uKFwidW5oYW5kbGVkUmVqZWN0aW9uXCIsIGFzeW5jIChlcnI6IEVycm9yLCBwcm9taXNlOiBQcm9taXNlPGFueT4pID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuaGFuZGxlZCAke2Vyci5zdGFjayB8fCBlcnIudG9TdHJpbmcoKX1gKVxuICAgICAgICBhd2FpdCB0aGlzLmtpbGwoKVxuICAgICAgICBwcm9jZXNzLmV4aXQoMilcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdGFydGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcbiAgfVxuXG4gIGFzeW5jIHN0b3AoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdG9wcGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcbiAgICAvKiBMZWZ0IHVwIHRvIGltcGxlbWVudGF0aW9uIGhvdyB0byBmdXJ0aGVyIGRlYWwgd2l0aCB0aGlzIHNjZW5hcmlvLiAqL1xuICB9XG5cbiAgYXN5bmMga2lsbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmxvZ2dlci53YXJuaW5nKGBmb3JjZWZ1bGx5IHN0b3BwZWQgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG4gICAgLyogTGVmdCB1cCB0byBpbXBsZW1lbnRhdGlvbiBob3cgdG8gZnVydGhlciBkZWFsIHdpdGggdGhpcyBzY2VuYXJpby4gKi9cbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RUYXNrXG4iXX0=