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

const description = `${_hostPkg2.default.name} service ${process.env.HOSTNAME || ""}`.trim();
let Application = exports.Application = class Application {

  /* Start a new application with the given options in next tick. */
  static start(options = Object.seal({})) {
    const app = new Application(options);
    process.nextTick(() => {
      app.start();
    });
    return app;
  }

  constructor(options = Object.seal({})) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInNodXRkb3duIiwicm91dGUiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJzdG9wIiwiZXhpdCIsImVyciIsImNyaXRpY2FsIiwia2lsbCIsInByb21pc2UiLCJ0b1N0cmluZyIsIm5vdGljZSIsImxpc3RlbiIsIlByb21pc2UiLCJyZXNvbHZlIiwib25jZSIsImNsb3NlIiwid2FybmluZyIsInVucmVmIiwic2V0VGltZW91dCIsImluc3BlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBRUE7O0lBQVlBLFU7Ozs7OztBQVdaLE1BQU1DLGNBQWUsR0FBRSxrQkFBUUMsSUFBSyxZQUFXQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosSUFBd0IsRUFBRyxFQUF0RCxDQUF3REMsSUFBeEQsRUFBcEI7SUFFYUMsVyxXQUFBQSxXLEdBQU4sTUFBTUEsV0FBTixDQUFrQjs7QUFTdkI7QUFDQSxTQUFPQyxLQUFQLENBQWFDLFVBQThCQyxPQUFPQyxJQUFQLENBQVksRUFBWixDQUEzQyxFQUE0RDtBQUMxRCxVQUFNQyxNQUFNLElBQUlMLFdBQUosQ0FBZ0JFLE9BQWhCLENBQVo7QUFDQU4sWUFBUVUsUUFBUixDQUFpQixNQUFNO0FBQUNELFVBQUlKLEtBQUo7QUFBWSxLQUFwQztBQUNBLFdBQU9JLEdB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QUwsQ0FBWTBCLElBQVosQ0FBaUIsT0FBakIsRUFBMEIsTUFBTUQsUUFBUSxJQUFSLENBQWhDO0FBQ0QsS0FGTSxDQUFQO0FBR0Q7O0FBRUROLFNBQTZCO0FBQzNCLFNBQUtoQixNQUFMLENBQVl5QixPQUFaLENBQXFCLHNCQUFxQixLQUFLMUMsV0FBWSxFQUEzRDs7QUFFQTs7OztBQUlBLFNBQUtjLE1BQUwsQ0FBWTJCLEtBQVo7QUFDQSxTQUFLM0IsTUFBTCxDQUFZNkIsS0FBWjs7QUFFQSxXQUFPLElBQUlMLE9BQUosQ0FBWUMsV0FBVztBQUM1QkssaUJBQVcsTUFBTUwsUUFBUSxJQUFSLENBQWpCLEVBQWdDLEdBQWhDO0FBQ0QsS0FGTSxDQUFQO0FBR0Q7O0FBRURNLFlBQVU7QUFDUixXQUFPO0FBQ0w3QixjQUFRLEtBQUtBLE1BRFI7QUFFTEksYUFBTyxLQUFLQSxLQUZQO0FBR0xOLGNBQVE7QUFISCxLQUFQO0FBS0Q7QUFuSHNCLEM7a0JBc0hWUixXIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBcIi4vdXRpbC9wb2x5ZmlsbFwiXG5cbmltcG9ydCBob3N0UGtnIGZyb20gXCIuL3V0aWwvaG9zdC1wa2dcIlxuXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL3V0aWwvbG9nZ2VyXCJcbmltcG9ydCBSb3V0ZXIgZnJvbSBcIi4vcm91dGVyXCJcblxuaW1wb3J0IENsb3NhYmxlU2VydmVyIGZyb20gXCIuL2FwcC9jbG9zYWJsZS1zZXJ2ZXJcIlxuaW1wb3J0IGRpc3BhdGNoIGZyb20gXCIuL2FwcC9kaXNwYXRjaFwiXG5cbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uT3B0aW9ucyA9IHt8XG4gIHBvcnQ/OiBudW1iZXIsXG4gIGxvZ2dlcj86IExvZ2dlcixcbiAgcm91dGVyPzogUm91dGVyLFxuICB0ZXJtaW5hdGlvbkdyYWNlPzogbnVtYmVyLFxufH1cblxuY29uc3QgZGVzY3JpcHRpb24gPSBgJHtob3N0UGtnLm5hbWV9IHNlcnZpY2UgJHtwcm9jZXNzLmVudi5IT1NUTkFNRSB8fCBcIlwifWAudHJpbSgpXG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIHBvcnQ6IG51bWJlclxuICByb3V0ZXI6IFJvdXRlclxuICBsb2dnZXI6IExvZ2dlclxuICBzdGFjazogU3RhY2tcblxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gZGVzY3JpcHRpb25cbiAgc2VydmVyOiBDbG9zYWJsZVNlcnZlciA9IG5ldyBDbG9zYWJsZVNlcnZlcigpXG5cbiAgLyogU3RhcnQgYSBuZXcgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSBPYmplY3Quc2VhbCh7fSkpIHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24ob3B0aW9ucylcbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHthcHAuc3RhcnQoKX0pXG4gICAgcmV0dXJuIGFwcFxuICB9XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3Qge1xuICAgICAgcG9ydCA9IDMwMDAsXG4gICAgICByb3V0ZXIgPSBuZXcgUm91dGVyLFxuICAgICAgbG9nZ2VyID0gbmV3IExvZ2dlcixcbiAgICAgIHRlcm1pbmF0aW9uR3JhY2UgPSAyNSxcbiAgICB9ID0gb3B0aW9uc1xuXG4gICAgLyogQXNzaWduIGRlZmF1bHQgZW52LiAqL1xuICAgIGlmICghcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJkZXZlbG9wbWVudFwiXG4gICAgfVxuXG4gICAgdGhpcy5wb3J0ID0gcG9ydFxuICAgIHRoaXMucm91dGVyID0gcm91dGVyXG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJcblxuICAgIC8qIEJhcmUgbWluaW11bSBzdGFjayB0byBkbyBhbnl0aGluZyB1c2VmdWwuICovXG4gICAgdGhpcy5zdGFjayA9IFtcbiAgICAgIG1pZGRsZXdhcmUubG9nKGxvZ2dlciksXG4gICAgICBtaWRkbGV3YXJlLndyaXRlKCksXG4gICAgICBtaWRkbGV3YXJlLnJlc2N1ZSgpLFxuICAgICAgbWlkZGxld2FyZS5zaHV0ZG93bih0ZXJtaW5hdGlvbkdyYWNlKSxcbiAgICAgIG1pZGRsZXdhcmUucm91dGUocm91dGVyKSxcbiAgICBdXG5cbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG4gIH1cblxuICBzdGFydCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5zZXJ2ZXIudGltZW91dCA9IDBcblxuICAgIHByb2Nlc3Mub24oXCJTSUdJTlRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgxMjggKyAyKVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHVEVSTVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDEyOCArIDE1KVxuICAgIH0pXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgICBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIiwgYXN5bmMgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuY2F1Z2h0ICR7ZXJyLnN0YWNrfWApXG4gICAgICAgIGF3YWl0IHRoaXMua2lsbCgpXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgfSlcblxuICAgICAgcHJvY2Vzcy5vbihcInVuaGFuZGxlZFJlamVjdGlvblwiLCBhc3luYyAoZXJyOiBFcnJvciwgcHJvbWlzZTogUHJvbWlzZTxhbnk+KSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmNyaXRpY2FsKGB1bmhhbmRsZWQgJHtlcnIuc3RhY2sgfHwgZXJyLnRvU3RyaW5nKCl9YClcbiAgICAgICAgYXdhaXQgdGhpcy5raWxsKClcbiAgICAgICAgcHJvY2Vzcy5leGl0KDIpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIEVTNzogdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIDo6dGhpcy5kaXNwYXRjaClcbiAgICB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgZGlzcGF0Y2godGhpcy5zdGFjaykpXG5cbiAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYHN0YXJ0aW5nICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgdGhpcy5zZXJ2ZXIubGlzdGVuKHRoaXMucG9ydClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJsaXN0ZW5pbmdcIiwgKCkgPT4gcmVzb2x2ZSh0aGlzKSlcbiAgICB9KVxuICB9XG5cbiAgc3RvcCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdG9wcGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIHRoaXMuc2VydmVyLmNsb3NlKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJjbG9zZVwiLCAoKSA9PiByZXNvbHZlKHRoaXMpKVxuICAgIH0pXG4gIH1cblxuICBraWxsKCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLmxvZ2dlci53YXJuaW5nKGBmb3JjZWZ1bGx5IHN0b3BwZWQgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICAvKiBEb24ndCB3YWl0IGZvciBzZXJ2ZXIgdG8gcXVpdGUgZ3JhY2VmdWxseSwgYnV0IHF1aXQgYWZ0ZXIgc2hvcnQgZGVsYXkuXG4gICAgICAgVGhpcyBhdm9pZHMgcHJvY2Vzc2VzIGhhbmdpbmcgZm9yIGEgbG9uZyB0aW1lIGJlY2F1c2UgYVxuICAgICAgIHJlcXVlc3QgZmFpbGVkIHRvIGZpbmlzaC4gV2Ugc2FjcmlmaWNlIGFsbCBydW5uaW5nIHJlcXVlc3RzIGZvciBhXG4gICAgICAgbW9yZSBzcGVlZHkgcmVjb3ZlcnkgYmVjYXVzZSB0aGUgc2VydmVyIHdpbGwgcmVzdGFydC4gKi9cbiAgICB0aGlzLnNlcnZlci5jbG9zZSgpXG4gICAgdGhpcy5zZXJ2ZXIudW5yZWYoKVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKHRoaXMpLCA1MDApXG4gICAgfSlcbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdXRlcjogdGhpcy5yb3V0ZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIHNlcnZlcjogXCI8bm9kZSBzZXJ2ZXI+XCIsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uXG4iXX0=