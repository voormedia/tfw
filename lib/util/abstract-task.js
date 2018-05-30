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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2Fic3RyYWN0LXRhc2suanMiXSwibmFtZXMiOlsiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFic3RyYWN0VGFzayIsImNvbnN0cnVjdG9yIiwiTk9ERV9FTlYiLCJzdGFydCIsIm9uIiwic3RvcCIsImV4aXQiLCJlcnIiLCJsb2dnZXIiLCJjcml0aWNhbCIsInN0YWNrIiwia2lsbCIsInByb21pc2UiLCJ0b1N0cmluZyIsIm5vdGljZSIsIndhcm5pbmciLCJpbnNwZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7OztBQUlBLE1BQU1BLGNBQWUsR0FBRSxrQkFBUUMsSUFBSyxZQUFXQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosSUFBd0IsRUFBRyxFQUF0RCxDQUF3REMsSUFBeEQsRUFBcEI7SUFFYUMsWSxXQUFBQSxZLEdBQU4sTUFBTUEsWUFBTixDQUFtQjs7QUFJeEJDLGdCQUFjO0FBQUEsU0FIZFAsV0FHYyxHQUhRQSxXQUdSOztBQUNaO0FBQ0EsUUFBSSxDQUFDRSxRQUFRQyxHQUFSLENBQVlLLFFBQWpCLEVBQTJCO0FBQ3pCTixjQUFRQyxHQUFSLENBQVlLLFFBQVosR0FBdUIsYUFBdkI7QUFDRDtBQUNGOztBQUVELFFBQU1DLEtBQU4sR0FBNkI7QUFDM0JQLFlBQVFRLEVBQVIsQ0FBVyxRQUFYLEVBQXFCLFlBQVk7QUFDL0IsWUFBTSxLQUFLQyxJQUFMLEVBQU47QUFDQVQsY0FBUVUsSUFBUixDQUFhLE1BQU0sQ0FBbkI7QUFDRCxLQUhEOztBQUtBVixZQUFRUSxFQUFSLENBQVcsU0FBWCxFQUFzQixZQUFZO0FBQ2hDLFlBQU0sS0FBS0MsSUFBTCxFQUFOO0FBQ0FULGNBQVFVLElBQVIsQ0FBYSxNQUFNLEVBQW5CO0FBQ0QsS0FIRDs7QUFLQSxRQUFJVixRQUFRQyxHQUFSLENBQVlLLFFBQVosS0FBeUIsTUFBN0IsRUFBcUM7QUFDbkNOLGNBQVFRLEVBQVIsQ0FBVyxtQkFBWCxFQUFnQyxNQUFPRyxHQUFQLElBQXNCO0FBQ3BELGFBQUtDLE1BQUwsQ0FBWUMsUUFBWixDQUFzQixZQUFXRixJQUFJRyxLQUFNLEVBQTNDO0FBQ0EsY0FBTSxLQUFLQyxJQUFMLEVBQU47QUFDQWYsZ0JBQVFVLElBQVIsQ0FBYSxDQUFiO0FBQ0QsT0FKRDs7QUFNQVYsY0FBUVEsRUFBUixDQUFXLG9CQUFYLEVBQWlDLE9BQU9HLEdBQVAsRUFBbUJLLE9BQW5CLEtBQTZDO0FBQzVFLGFBQUtKLE1BQUwsQ0FBWUMsUUFBWixDQUFzQixhQUFZRixJQUFJRyxLQUFKLElBQWFILElBQUlNLFFBQUosRUFBZSxFQUE5RDtBQUNBLGNBQU0sS0FBS0YsSUFBTCxFQUFOO0FBQ0FmLGdCQUFRVSxJQUFSLENBQWEsQ0FBYjtBQUNELE9BSkQ7QUFLRDs7QUFFRCxTQUFLRSxNQUFMLENBQVlNLE1BQVosQ0FBb0IsWUFBVyxLQUFLcEIsV0FBWSxFQUFoRDtBQUNEOztBQUVELFFBQU1XLElBQU4sR0FBNEI7QUFDMUIsU0FBS0csTUFBTCxDQUFZTSxNQUFaLENBQW9CLFlBQVcsS0FBS3BCLFdBQVksRUFBaEQ7QUFDQTtBQUNEOztBQUVELFFBQU1pQixJQUFOLEdBQTRCO0FBQzFCLFNBQUtILE1BQUwsQ0FBWU8sT0FBWixDQUFxQixzQkFBcUIsS0FBS3JCLFdBQVksRUFBM0Q7QUFDQTtBQUNEOztBQUVEc0IsWUFBVTtBQUNSLFdBQU8sRUFBUDtBQUNEO0FBbkR1QixDO2tCQXNEWGhCLFkiLCJmaWxlIjoiYWJzdHJhY3QtdGFzay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgaG9zdFBrZyBmcm9tIFwiLi9ob3N0LXBrZ1wiXG5cbmltcG9ydCB0eXBlIExvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIlxuXG5jb25zdCBkZXNjcmlwdGlvbiA9IGAke2hvc3RQa2cubmFtZX0gc2VydmljZSAke3Byb2Nlc3MuZW52LkhPU1ROQU1FIHx8IFwiXCJ9YC50cmltKClcblxuZXhwb3J0IGNsYXNzIEFic3RyYWN0VGFzayB7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBkZXNjcmlwdGlvblxuICBsb2dnZXI6IExvZ2dlclxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHN0YXJ0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHByb2Nlc3Mub24oXCJTSUdJTlRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgxMjggKyAyKVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHVEVSTVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDEyOCArIDE1KVxuICAgIH0pXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgICBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIiwgYXN5bmMgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuY2F1Z2h0ICR7ZXJyLnN0YWNrfWApXG4gICAgICAgIGF3YWl0IHRoaXMua2lsbCgpXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgfSlcblxuICAgICAgcHJvY2Vzcy5vbihcInVuaGFuZGxlZFJlamVjdGlvblwiLCBhc3luYyAoZXJyOiBFcnJvciwgcHJvbWlzZTogUHJvbWlzZTxhbnk+KSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmNyaXRpY2FsKGB1bmhhbmRsZWQgJHtlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCl9YClcbiAgICAgICAgYXdhaXQgdGhpcy5raWxsKClcbiAgICAgICAgcHJvY2Vzcy5leGl0KDIpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RhcnRpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG4gIH1cblxuICBhc3luYyBzdG9wKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RvcHBpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG4gICAgLyogTGVmdCB1cCB0byBpbXBsZW1lbnRhdGlvbiBob3cgdG8gZnVydGhlciBkZWFsIHdpdGggdGhpcyBzY2VuYXJpby4gKi9cbiAgfVxuXG4gIGFzeW5jIGtpbGwoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5sb2dnZXIud2FybmluZyhgZm9yY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuICAgIC8qIExlZnQgdXAgdG8gaW1wbGVtZW50YXRpb24gaG93IHRvIGZ1cnRoZXIgZGVhbCB3aXRoIHRoaXMgc2NlbmFyaW8uICovXG4gIH1cblxuICBpbnNwZWN0KCkge1xuICAgIHJldHVybiB7fVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0VGFza1xuIl19