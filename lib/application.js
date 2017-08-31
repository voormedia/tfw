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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    var _this = this;

    this.server.timeout = 0;

    process.on("SIGINT", _asyncToGenerator(function* () {
      yield _this.stop();
      process.exit(128 + 2);
    }));

    process.on("SIGTERM", _asyncToGenerator(function* () {
      yield _this.stop();
      process.exit(128 + 15);
    }));

    if (process.env.NODE_ENV !== "test") {
      process.on("uncaughtException", (() => {
        var _ref3 = _asyncToGenerator(function* (err) {
          _this.logger.critical(`uncaught ${err.stack}`);
          yield _this.kill();
          process.exit(1);
        });

        return function (_x) {
          return _ref3.apply(this, arguments);
        };
      })());

      process.on("unhandledRejection", (() => {
        var _ref4 = _asyncToGenerator(function* (err, promise) {
          _this.logger.critical(`unhandled ${err.stack} from ${promise.toString()}`);
          yield _this.kill();
          process.exit(2);
        });

        return function (_x2, _x3) {
          return _ref4.apply(this, arguments);
        };
      })());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInNodXRkb3duIiwicm91dGUiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJzdG9wIiwiZXhpdCIsImVyciIsImNyaXRpY2FsIiwia2lsbCIsInByb21pc2UiLCJ0b1N0cmluZyIsIm5vdGljZSIsImxpc3RlbiIsIlByb21pc2UiLCJyZXNvbHZlIiwib25jZSIsImNsb3NlIiwid2FybmluZyIsInVucmVmIiwic2V0VGltZW91dCIsImluc3BlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBRUE7O0lBQVlBLFU7Ozs7Ozs7O0FBV1osTUFBTUMsY0FBZSxHQUFFLGtCQUFRQyxJQUFLLFlBQVdDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixJQUF3QixFQUFHLEVBQXRELENBQXdEQyxJQUF4RCxFQUFwQjs7SUFFYUMsVyxXQUFBQSxXLEdBQU4sTUFBTUEsV0FBTixDQUFrQjs7QUFTdkI7QUFDQSxTQUFPQyxLQUFQLENBQWFDLFVBQThCQyxPQUFPQyxJQUFQLENBQVksRUFBWixDQUEzQyxFQUE0RDtBQUMxRCxVQUFNQyxNQUFNLElBQUlMLFdBQUosQ0FBZ0JFLE9BQWhCLENBQVo7QUFDQU4sWUFBUVUsUUFBUixDQUFpQixNQUFNO0FBQUNELFVBQUlKLEtBQUo7QUFBWSxLQUFwQztBQUNBLFdBQU9J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QUFLYyxNQUFMLENBQVkyQixLQUFaOztBQUVBLFdBQU8sSUFBSUgsT0FBSixDQUFZQyxXQUFXO0FBQzVCLFdBQUt6QixNQUFMLENBQVkwQixJQUFaLENBQWlCLE9BQWpCLEVBQTBCLE1BQU1ELFFBQVEsSUFBUixDQUFoQztBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVETixTQUE2QjtBQUMzQixTQUFLaEIsTUFBTCxDQUFZeUIsT0FBWixDQUFxQixzQkFBcUIsS0FBSzFDLFdBQVksRUFBM0Q7O0FBRUE7Ozs7QUFJQSxTQUFLYyxNQUFMLENBQVkyQixLQUFaO0FBQ0EsU0FBSzNCLE1BQUwsQ0FBWTZCLEtBQVo7O0FBRUEsV0FBTyxJQUFJTCxPQUFKLENBQVlDLFdBQVc7QUFDNUJLLGlCQUFXLE1BQU1MLFFBQVEsSUFBUixDQUFqQixFQUFnQyxHQUFoQztBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVETSxZQUFVO0FBQ1IsV0FBTztBQUNMN0IsY0FBUSxLQUFLQSxNQURSO0FBRUxJLGFBQU8sS0FBS0EsS0FGUDtBQUdMTixjQUFRO0FBSEgsS0FBUDtBQUtEO0FBbkhzQixDO2tCQXNIVlIsVyIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgXCIuL3V0aWwvcG9seWZpbGxcIlxuXG5pbXBvcnQgaG9zdFBrZyBmcm9tIFwiLi91dGlsL2hvc3QtcGtnXCJcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi91dGlsL2xvZ2dlclwiXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuL3JvdXRlclwiXG5cbmltcG9ydCBDbG9zYWJsZVNlcnZlciBmcm9tIFwiLi9hcHAvY2xvc2FibGUtc2VydmVyXCJcbmltcG9ydCBkaXNwYXRjaCBmcm9tIFwiLi9hcHAvZGlzcGF0Y2hcIlxuXG5pbXBvcnQgKiBhcyBtaWRkbGV3YXJlIGZyb20gXCIuL21pZGRsZXdhcmVcIlxuXG5pbXBvcnQgdHlwZSB7U3RhY2t9IGZyb20gXCIuL21pZGRsZXdhcmVcIlxuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fFxuICBwb3J0PzogbnVtYmVyLFxuICBsb2dnZXI/OiBMb2dnZXIsXG4gIHJvdXRlcj86IFJvdXRlcixcbiAgdGVybWluYXRpb25HcmFjZT86IG51bWJlcixcbnx9XG5cbmNvbnN0IGRlc2NyaXB0aW9uID0gYCR7aG9zdFBrZy5uYW1lfSBzZXJ2aWNlICR7cHJvY2Vzcy5lbnYuSE9TVE5BTUUgfHwgXCJcIn1gLnRyaW0oKVxuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuICBwb3J0OiBudW1iZXJcbiAgcm91dGVyOiBSb3V0ZXJcbiAgbG9nZ2VyOiBMb2dnZXJcbiAgc3RhY2s6IFN0YWNrXG5cbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IGRlc2NyaXB0aW9uXG4gIHNlcnZlcjogQ2xvc2FibGVTZXJ2ZXIgPSBuZXcgQ2xvc2FibGVTZXJ2ZXIoKVxuXG4gIC8qIFN0YXJ0IGEgbmV3IGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgaW4gbmV4dCB0aWNrLiAqL1xuICBzdGF0aWMgc3RhcnQob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKG9wdGlvbnMpXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7YXBwLnN0YXJ0KCl9KVxuICAgIHJldHVybiBhcHBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IE9iamVjdC5zZWFsKHt9KSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvcnQgPSAzMDAwLFxuICAgICAgcm91dGVyID0gbmV3IFJvdXRlcixcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgICB0ZXJtaW5hdGlvbkdyYWNlID0gMjUsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cblxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICAvKiBCYXJlIG1pbmltdW0gc3RhY2sgdG8gZG8gYW55dGhpbmcgdXNlZnVsLiAqL1xuICAgIHRoaXMuc3RhY2sgPSBbXG4gICAgICBtaWRkbGV3YXJlLmxvZyhsb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSgpLFxuICAgICAgbWlkZGxld2FyZS5yZXNjdWUoKSxcbiAgICAgIG1pZGRsZXdhcmUuc2h1dGRvd24odGVybWluYXRpb25HcmFjZSksXG4gICAgICBtaWRkbGV3YXJlLnJvdXRlKHJvdXRlciksXG4gICAgXVxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgc3RhcnQoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMuc2VydmVyLnRpbWVvdXQgPSAwXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHSU5UXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMTI4ICsgMilcbiAgICB9KVxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR1RFUk1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgxMjggKyAxNSlcbiAgICB9KVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInRlc3RcIikge1xuICAgICAgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGFzeW5jIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmNyaXRpY2FsKGB1bmNhdWdodCAke2Vyci5zdGFja31gKVxuICAgICAgICBhd2FpdCB0aGlzLmtpbGwoKVxuICAgICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIH0pXG5cbiAgICAgIHByb2Nlc3Mub24oXCJ1bmhhbmRsZWRSZWplY3Rpb25cIiwgYXN5bmMgKGVycjogRXJyb3IsIHByb21pc2U6IFByb21pc2U8YW55PikgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5jcml0aWNhbChgdW5oYW5kbGVkICR7ZXJyLnN0YWNrfSBmcm9tICR7cHJvbWlzZS50b1N0cmluZygpfWApXG4gICAgICAgIGF3YWl0IHRoaXMua2lsbCgpXG4gICAgICAgIHByb2Nlc3MuZXhpdCgyKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBFUzc6IHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCA6OnRoaXMuZGlzcGF0Y2gpXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIGRpc3BhdGNoKHRoaXMuc3RhY2spKVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdGFydGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwibGlzdGVuaW5nXCIsICgpID0+IHJlc29sdmUodGhpcykpXG4gICAgfSlcbiAgfVxuXG4gIHN0b3AoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RvcHBpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICB0aGlzLnNlcnZlci5jbG9zZSgpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwiY2xvc2VcIiwgKCkgPT4gcmVzb2x2ZSh0aGlzKSlcbiAgICB9KVxuICB9XG5cbiAga2lsbCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5sb2dnZXIud2FybmluZyhgZm9yY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgLyogRG9uJ3Qgd2FpdCBmb3Igc2VydmVyIHRvIHF1aXRlIGdyYWNlZnVsbHksIGJ1dCBxdWl0IGFmdGVyIHNob3J0IGRlbGF5LlxuICAgICAgIFRoaXMgYXZvaWRzIHByb2Nlc3NlcyBoYW5naW5nIGZvciBhIGxvbmcgdGltZSBiZWNhdXNlIGFcbiAgICAgICByZXF1ZXN0IGZhaWxlZCB0byBmaW5pc2guIFdlIHNhY3JpZmljZSBhbGwgcnVubmluZyByZXF1ZXN0cyBmb3IgYVxuICAgICAgIG1vcmUgc3BlZWR5IHJlY292ZXJ5IGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIHJlc3RhcnQuICovXG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2UoKVxuICAgIHRoaXMuc2VydmVyLnVucmVmKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSh0aGlzKSwgNTAwKVxuICAgIH0pXG4gIH1cblxuICBpbnNwZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICByb3V0ZXI6IHRoaXMucm91dGVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICBzZXJ2ZXI6IFwiPG5vZGUgc2VydmVyPlwiLFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBsaWNhdGlvblxuIl19