"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = undefined;

require("./util/polyfill");

var _hostPkg = require("./util/host-pkg");

var _hostPkg2 = _interopRequireDefault(_hostPkg);

var _logger = require("./util/logger");

var _logger2 = _interopRequireDefault(_logger);

var _router = require("./router");

var _router2 = _interopRequireDefault(_router);

var _closableServer = require("./app/closable-server");

var _closableServer2 = _interopRequireDefault(_closableServer);

var _dispatch = require("./app/dispatch");

var _dispatch2 = _interopRequireDefault(_dispatch);

var _middleware = require("./middleware");

var middleware = _interopRequireWildcard(_middleware);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* $Shape<T> makes every property optional. */
const description = `${_hostPkg2.default.name} service ${process.env.HOSTNAME || ""}`.trim();
let Application = exports.Application = class Application {

  /* Start a new application with the given options in next tick. */
  static start(options = {}) {
    const app = new Application(options);
    process.nextTick(() => {
      app.start();
    });
    return app;
  }

  constructor(options = {}) {
    this.description = description;
    this.server = new _closableServer2.default();

    const {
      port = 3000,
      router = new _router2.default(),
      logger = new _logger2.default(),
      terminationGrace = 25
    } = options;

    /* Assign default env. */
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = "development";
    }

    this.port = port;
    this.router = router;
    this.logger = logger;

    /* Bare minimum stack to do anything useful. */
    this.stack = [middleware.log(logger), middleware.write(), middleware.rescue(), middleware.shutdown(terminationGrace), middleware.route(router)];

    Object.freeze(this);
  }

  start() {
    this.server.timeout = 0;

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

    // ES7: this.server.on("request", ::this.dispatch)
    this.server.on("request", (0, _dispatch2.default)(this.stack));

    this.logger.notice(`starting ${this.description}`);

    this.server.listen(this.port);

    return new Promise(resolve => {
      this.server.once("listening", () => resolve(this));
    });
  }

  stop() {
    this.logger.notice(`stopping ${this.description}`);

    this.server.close();

    return new Promise(resolve => {
      this.server.once("close", () => resolve(this));
    });
  }

  kill() {
    this.logger.warning(`forcefully stopped ${this.description}`);

    /* Don't wait for server to quite gracefully, but quit after short delay.
       This avoids processes hanging for a long time because a
       request failed to finish. We sacrifice all running requests for a
       more speedy recovery because the server will restart. */
    this.server.close();
    this.server.unref();

    return new Promise(resolve => {
      setTimeout(() => resolve(this), 500);
    });
  }

  inspect() {
    return {
      router: this.router,
      stack: this.stack,
      server: "<node server>"
    };
  }
};
exports.default = Application;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiYXBwIiwibmV4dFRpY2siLCJjb25zdHJ1Y3RvciIsInNlcnZlciIsInBvcnQiLCJyb3V0ZXIiLCJsb2dnZXIiLCJ0ZXJtaW5hdGlvbkdyYWNlIiwiTk9ERV9FTlYiLCJzdGFjayIsImxvZyIsIndyaXRlIiwicmVzY3VlIiwic2h1dGRvd24iLCJyb3V0ZSIsIk9iamVjdCIsImZyZWV6ZSIsInRpbWVvdXQiLCJvbiIsInN0b3AiLCJleGl0IiwiZXJyIiwiY3JpdGljYWwiLCJraWxsIiwicHJvbWlzZSIsInRvU3RyaW5nIiwibm90aWNlIiwibGlzdGVuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJvbmNlIiwiY2xvc2UiLCJ3YXJuaW5nIiwidW5yZWYiLCJzZXRUaW1lb3V0IiwiaW5zcGVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWUEsVTs7Ozs7O0FBSVo7QUFRQSxNQUFNQyxjQUFlLEdBQUUsa0JBQVFDLElBQUssWUFBV0MsUUFBUUMsR0FBUixDQUFZQyxRQUFaLElBQXdCLEVBQUcsRUFBdEQsQ0FBd0RDLElBQXhELEVBQXBCO0lBRWFDLFcsV0FBQUEsVyxHQUFOLE1BQU1BLFdBQU4sQ0FBa0I7O0FBU3ZCO0FBQ0EsU0FBT0MsS0FBUCxDQUFhQyxVQUE4QixFQUEzQyxFQUErQztBQUM3QyxVQUFNQyxNQUFNLElBQUlILFdBQUosQ0FBZ0JFLE9BQWhCLENBQVo7QUFDQU4sWUFBUVEsUUFBUixDQUFpQixNQUFNO0FBQUNELFVBQUlGLEtBQUo7QUFBWSxLQUFwQztBQUNBLFdBQU9FLEdBQVA7QUFDRDs7QUFFREUsY0FBWUgsVUFB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QUFoQztBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVETixTQUE2QjtBQUMzQixTQUFLakIsTUFBTCxDQUFZMEIsT0FBWixDQUFxQixzQkFBcUIsS0FBS3pDLFdBQVksRUFBM0Q7O0FBRUE7Ozs7QUFJQSxTQUFLWSxNQUFMLENBQVk0QixLQUFaO0FBQ0EsU0FBSzVCLE1BQUwsQ0FBWThCLEtBQVo7O0FBRUEsV0FBTyxJQUFJTCxPQUFKLENBQVlDLFdBQVc7QUFDNUJLLGlCQUFXLE1BQU1MLFFBQVEsSUFBUixDQUFqQixFQUFnQyxHQUFoQztBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVETSxZQUFVO0FBQ1IsV0FBTztBQUNMOUIsY0FBUSxLQUFLQSxNQURSO0FBRUxJLGFBQU8sS0FBS0EsS0FGUDtBQUdMTixjQUFRO0FBSEgsS0FBUDtBQUtEO0FBbkhzQixDO2tCQXNIVk4sVyIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgXCIuL3V0aWwvcG9seWZpbGxcIlxuXG5pbXBvcnQgaG9zdFBrZyBmcm9tIFwiLi91dGlsL2hvc3QtcGtnXCJcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi91dGlsL2xvZ2dlclwiXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuL3JvdXRlclwiXG5cbmltcG9ydCBDbG9zYWJsZVNlcnZlciBmcm9tIFwiLi9hcHAvY2xvc2FibGUtc2VydmVyXCJcbmltcG9ydCBkaXNwYXRjaCBmcm9tIFwiLi9hcHAvZGlzcGF0Y2hcIlxuXG5pbXBvcnQgKiBhcyBtaWRkbGV3YXJlIGZyb20gXCIuL21pZGRsZXdhcmVcIlxuXG5pbXBvcnQgdHlwZSB7U3RhY2t9IGZyb20gXCIuL21pZGRsZXdhcmVcIlxuXG4vKiAkU2hhcGU8VD4gbWFrZXMgZXZlcnkgcHJvcGVydHkgb3B0aW9uYWwuICovXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbk9wdGlvbnMgPSAkU2hhcGU8e1xuICBwb3J0OiBudW1iZXIsXG4gIGxvZ2dlcjogTG9nZ2VyLFxuICByb3V0ZXI6IFJvdXRlcixcbiAgdGVybWluYXRpb25HcmFjZTogbnVtYmVyLFxufT5cblxuY29uc3QgZGVzY3JpcHRpb24gPSBgJHtob3N0UGtnLm5hbWV9IHNlcnZpY2UgJHtwcm9jZXNzLmVudi5IT1NUTkFNRSB8fCBcIlwifWAudHJpbSgpXG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIHBvcnQ6IG51bWJlclxuICByb3V0ZXI6IFJvdXRlclxuICBsb2dnZXI6IExvZ2dlclxuICBzdGFjazogU3RhY2tcblxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gZGVzY3JpcHRpb25cbiAgc2VydmVyOiBDbG9zYWJsZVNlcnZlciA9IG5ldyBDbG9zYWJsZVNlcnZlcigpXG5cbiAgLyogU3RhcnQgYSBuZXcgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihvcHRpb25zKVxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge2FwcC5zdGFydCgpfSlcbiAgICByZXR1cm4gYXBwXG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvcnQgPSAzMDAwLFxuICAgICAgcm91dGVyID0gbmV3IFJvdXRlcixcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgICB0ZXJtaW5hdGlvbkdyYWNlID0gMjUsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cblxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICAvKiBCYXJlIG1pbmltdW0gc3RhY2sgdG8gZG8gYW55dGhpbmcgdXNlZnVsLiAqL1xuICAgIHRoaXMuc3RhY2sgPSBbXG4gICAgICBtaWRkbGV3YXJlLmxvZyhsb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSgpLFxuICAgICAgbWlkZGxld2FyZS5yZXNjdWUoKSxcbiAgICAgIG1pZGRsZXdhcmUuc2h1dGRvd24odGVybWluYXRpb25HcmFjZSksXG4gICAgICBtaWRkbGV3YXJlLnJvdXRlKHJvdXRlciksXG4gICAgXVxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgc3RhcnQoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMuc2VydmVyLnRpbWVvdXQgPSAwXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHSU5UXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMTI4ICsgMilcbiAgICB9KVxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR1RFUk1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgxMjggKyAxNSlcbiAgICB9KVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInRlc3RcIikge1xuICAgICAgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGFzeW5jIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmNyaXRpY2FsKGB1bmNhdWdodCAke2Vyci5zdGFja31gKVxuICAgICAgICBhd2FpdCB0aGlzLmtpbGwoKVxuICAgICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIH0pXG5cbiAgICAgIHByb2Nlc3Mub24oXCJ1bmhhbmRsZWRSZWplY3Rpb25cIiwgYXN5bmMgKGVycjogRXJyb3IsIHByb21pc2U6IFByb21pc2U8YW55PikgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5jcml0aWNhbChgdW5oYW5kbGVkICR7ZXJyLnN0YWNrIHx8IGVyci50b1N0cmluZygpfWApXG4gICAgICAgIGF3YWl0IHRoaXMua2lsbCgpXG4gICAgICAgIHByb2Nlc3MuZXhpdCgyKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBFUzc6IHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCA6OnRoaXMuZGlzcGF0Y2gpXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIGRpc3BhdGNoKHRoaXMuc3RhY2spKVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdGFydGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwibGlzdGVuaW5nXCIsICgpID0+IHJlc29sdmUodGhpcykpXG4gICAgfSlcbiAgfVxuXG4gIHN0b3AoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RvcHBpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICB0aGlzLnNlcnZlci5jbG9zZSgpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwiY2xvc2VcIiwgKCkgPT4gcmVzb2x2ZSh0aGlzKSlcbiAgICB9KVxuICB9XG5cbiAga2lsbCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5sb2dnZXIud2FybmluZyhgZm9yY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgLyogRG9uJ3Qgd2FpdCBmb3Igc2VydmVyIHRvIHF1aXRlIGdyYWNlZnVsbHksIGJ1dCBxdWl0IGFmdGVyIHNob3J0IGRlbGF5LlxuICAgICAgIFRoaXMgYXZvaWRzIHByb2Nlc3NlcyBoYW5naW5nIGZvciBhIGxvbmcgdGltZSBiZWNhdXNlIGFcbiAgICAgICByZXF1ZXN0IGZhaWxlZCB0byBmaW5pc2guIFdlIHNhY3JpZmljZSBhbGwgcnVubmluZyByZXF1ZXN0cyBmb3IgYVxuICAgICAgIG1vcmUgc3BlZWR5IHJlY292ZXJ5IGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIHJlc3RhcnQuICovXG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2UoKVxuICAgIHRoaXMuc2VydmVyLnVucmVmKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSh0aGlzKSwgNTAwKVxuICAgIH0pXG4gIH1cblxuICBpbnNwZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICByb3V0ZXI6IHRoaXMucm91dGVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICBzZXJ2ZXI6IFwiPG5vZGUgc2VydmVyPlwiLFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBsaWNhdGlvblxuIl19