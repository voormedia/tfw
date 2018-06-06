"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = undefined;

require("./util/polyfill");

var _abstractTask = require("./util/abstract-task");

var _abstractTask2 = _interopRequireDefault(_abstractTask);

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
let Application = exports.Application = class Application extends _abstractTask2.default {

  /* Start a new application with the given options in next tick. */
  static start(options = {}) {
    const app = new this(options);
    process.nextTick(() => {
      app.start();
    });
    return app;
  }

  constructor(options = {}) {
    super();

    this.server = new _closableServer2.default();
    const {
      port = 3000,
      router = new _router2.default(),
      logger = new _logger2.default(this.description),
      terminationGrace = 25
    } = options;

    this.port = port;
    this.router = router;
    this.logger = logger;

    /* Bare minimum stack to do anything useful. */
    this.stack = [middleware.log(logger), middleware.write(), middleware.rescue(), middleware.shutdown(terminationGrace), middleware.route(router)];

    Object.freeze(this);
  }

  async start() {
    await super.start();

    this.server.timeout = 0;

    // ES7: this.server.on("request", ::this.dispatch)
    this.server.on("request", (0, _dispatch2.default)(this.stack));

    this.server.listen(this.port);

    return new Promise(resolve => {
      this.server.once("listening", () => resolve());
    });
  }

  async stop() {
    await super.stop();

    this.server.close();

    return new Promise(resolve => {
      this.server.once("close", () => resolve());
    });
  }

  async kill() {
    await super.kill();

    /* Don't wait for server to quite gracefully, but quit after short delay.
       This avoids processes hanging for a long time because a
       request failed to finish. We sacrifice all running requests for a
       more speedy recovery because the server will restart. */
    this.server.close();
    this.server.unref();

    return new Promise(resolve => {
      setTimeout(() => resolve(), 500);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiQXBwbGljYXRpb24iLCJzdGFydCIsIm9wdGlvbnMiLCJhcHAiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJjb25zdHJ1Y3RvciIsInNlcnZlciIsInBvcnQiLCJyb3V0ZXIiLCJsb2dnZXIiLCJkZXNjcmlwdGlvbiIsInRlcm1pbmF0aW9uR3JhY2UiLCJzdGFjayIsImxvZyIsIndyaXRlIiwicmVzY3VlIiwic2h1dGRvd24iLCJyb3V0ZSIsIk9iamVjdCIsImZyZWV6ZSIsInRpbWVvdXQiLCJvbiIsImxpc3RlbiIsIlByb21pc2UiLCJyZXNvbHZlIiwib25jZSIsInN0b3AiLCJjbG9zZSIsImtpbGwiLCJ1bnJlZiIsInNldFRpbWVvdXQiLCJpbnNwZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOztJQUFZQSxVOzs7Ozs7QUFJWjtJQVFhQyxXLFdBQUFBLFcsR0FBTixNQUFNQSxXQUFOLGdDQUF1Qzs7QUFPNUM7QUFDQSxTQUFPQyxLQUFQLENBQWFDLFVBQThCLEVBQTNDLEVBQStDO0FBQzdDLFVBQU1DLE1BQU0sSUFBSSxJQUFKLENBQVNELE9BQVQsQ0FBWjtBQUNBRSxZQUFRQyxRQUFSLENBQWlCLE1BQU07QUFBQ0YsVUFBSUYsS0FBSjtBQUFZLEtBQXBDO0FBQ0EsV0FBT0UsR0FBUDtBQUNEOztBQUVERyxjQUFZSixVQUE4QixFQUExQyxFQUE4QztBQUM1Qzs7QUFENEMsU0FUOUNLLE1BUzhDLEdBVHJCLDhCQVNxQjtBQUc1QyxVQUFNO0FBQ0pDLGFBQU8sSUFESDtBQUVKQyxlQUFTLHNCQUZMO0FBR0pDLGVBQVMscUJBQVcsS0FBS0MsV0FBaEIsQ0FITDtBQUlKQyx5QkFBbUI7QUFKZixRQUtGVixPQUxKOztBQU9BLFNBQUtNLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDs7QUFFQTtBQUNBLFNBQUtHLEtBQUwsR0FBYSxDQUNYZCxXQUFXZSxHQUFYLENBQWVKLE1BQWYsQ0FEVyxFQUVYWCxXQUFXZ0IsS0FBWCxFQUZXLEVBR1hoQixXQUFXaUIsTUFBWCxFQUhXLEVBSVhqQixXQUFXa0IsUUFBWCxDQUFvQkwsZ0JBQXBCLENBSlcsRUFLWGIsV0FBV21CLEtBQVgsQ0FBaUJULE1BQWpCLENBTFcsQ0FBYjs7QUFRQVUsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFRCxRQUFNbkIsS0FBTixHQUE2QjtBQUMzQixVQUFNLE1BQU1BLEtBQU4sRUFBTjs7QUFFQSxTQUFLTSxNQUFMLENBQVljLE9BQVosR0FBc0IsQ0FBdEI7O0FBRUE7QUFDQSxTQUFLZCxNQUFMLENBQVllLEVBQVosQ0FBZSxTQUFmLEVBQTBCLHdCQUFTLEtBQUtULEtBQWQsQ0FBMUI7O0FBRUEsU0FBS04sTUFBTCxDQUFZZ0IsTUFBWixDQUFtQixLQUFLZixJQUF4Qjs7QUFFQSxXQUFPLElBQUlnQixPQUFKLENBQVlDLFdBQVc7QUFDNUIsV0FBS2xCLE1BQUwsQ0FBWW1CLElBQVosQ0FBaUIsV0FBakIsRUFBOEIsTUFBTUQsU0FBcEM7QUFDRCxLQUZNLENBQVA7QUFHRDs7QUFFRCxRQUFNRSxJQUFOLEdBQTRCO0FBQzFCLFVBQU0sTUFBTUEsSUFBTixFQUFOOztBQUVBLFNBQUtwQixNQUFMLENBQVlxQixLQUFaOztBQUVBLFdBQU8sSUFBSUosT0FBSixDQUFZQyxXQUFXO0FBQzVCLFdBQUtsQixNQUFMLENBQVltQixJQUFaLENBQWlCLE9BQWpCLEVBQTBCLE1BQU1ELFNBQWhDO0FBQ0QsS0FGTSxDQUFQO0FBR0Q7O0FBRUQsUUFBTUksSUFBTixHQUE0QjtBQUMxQixVQUFNLE1BQU1BLElBQU4sRUFBTjs7QUFFQTs7OztBQUlBLFNBQUt0QixNQUFMLENBQVlxQixLQUFaO0FBQ0EsU0FBS3JCLE1BQUwsQ0FBWXVCLEtBQVo7O0FBRUEsV0FBTyxJQUFJTixPQUFKLENBQVlDLFdBQVc7QUFDNUJNLGlCQUFXLE1BQU1OLFNBQWpCLEVBQTRCLEdBQTVCO0FBQ0QsS0FGTSxDQUFQO0FBR0Q7O0FBRURPLFlBQVU7QUFDUixXQUFPO0FBQ0x2QixjQUFRLEtBQUtBLE1BRFI7QUFFTEksYUFBTyxLQUFLQSxLQUZQO0FBR0xOLGNBQVE7QUFISCxLQUFQO0FBS0Q7QUF0RjJDLEM7a0JBeUYvQlAsVyIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgXCIuL3V0aWwvcG9seWZpbGxcIlxuXG5pbXBvcnQgQWJzdHJhY3RUYXNrIGZyb20gXCIuL3V0aWwvYWJzdHJhY3QtdGFza1wiXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL3V0aWwvbG9nZ2VyXCJcbmltcG9ydCBSb3V0ZXIgZnJvbSBcIi4vcm91dGVyXCJcblxuaW1wb3J0IENsb3NhYmxlU2VydmVyIGZyb20gXCIuL2FwcC9jbG9zYWJsZS1zZXJ2ZXJcIlxuaW1wb3J0IGRpc3BhdGNoIGZyb20gXCIuL2FwcC9kaXNwYXRjaFwiXG5cbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbi8qICRTaGFwZTxUPiBtYWtlcyBldmVyeSBwcm9wZXJ0eSBvcHRpb25hbC4gKi9cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uT3B0aW9ucyA9ICRTaGFwZTx7XG4gIHBvcnQ6IG51bWJlcixcbiAgbG9nZ2VyOiBMb2dnZXIsXG4gIHJvdXRlcjogUm91dGVyLFxuICB0ZXJtaW5hdGlvbkdyYWNlOiBudW1iZXIsXG59PlxuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRhc2sge1xuICBwb3J0OiBudW1iZXJcbiAgcm91dGVyOiBSb3V0ZXJcbiAgc3RhY2s6IFN0YWNrXG5cbiAgc2VydmVyOiBDbG9zYWJsZVNlcnZlciA9IG5ldyBDbG9zYWJsZVNlcnZlcigpXG5cbiAgLyogU3RhcnQgYSBuZXcgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFwcCA9IG5ldyB0aGlzKG9wdGlvbnMpXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7YXBwLnN0YXJ0KCl9KVxuICAgIHJldHVybiBhcHBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuXG4gICAgY29uc3Qge1xuICAgICAgcG9ydCA9IDMwMDAsXG4gICAgICByb3V0ZXIgPSBuZXcgUm91dGVyLFxuICAgICAgbG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLmRlc2NyaXB0aW9uKSxcbiAgICAgIHRlcm1pbmF0aW9uR3JhY2UgPSAyNSxcbiAgICB9ID0gb3B0aW9uc1xuXG4gICAgdGhpcy5wb3J0ID0gcG9ydFxuICAgIHRoaXMucm91dGVyID0gcm91dGVyXG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJcblxuICAgIC8qIEJhcmUgbWluaW11bSBzdGFjayB0byBkbyBhbnl0aGluZyB1c2VmdWwuICovXG4gICAgdGhpcy5zdGFjayA9IFtcbiAgICAgIG1pZGRsZXdhcmUubG9nKGxvZ2dlciksXG4gICAgICBtaWRkbGV3YXJlLndyaXRlKCksXG4gICAgICBtaWRkbGV3YXJlLnJlc2N1ZSgpLFxuICAgICAgbWlkZGxld2FyZS5zaHV0ZG93bih0ZXJtaW5hdGlvbkdyYWNlKSxcbiAgICAgIG1pZGRsZXdhcmUucm91dGUocm91dGVyKSxcbiAgICBdXG5cbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG4gIH1cblxuICBhc3luYyBzdGFydCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzdXBlci5zdGFydCgpXG5cbiAgICB0aGlzLnNlcnZlci50aW1lb3V0ID0gMFxuXG4gICAgLy8gRVM3OiB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgOjp0aGlzLmRpc3BhdGNoKVxuICAgIHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCBkaXNwYXRjaCh0aGlzLnN0YWNrKSlcblxuICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwibGlzdGVuaW5nXCIsICgpID0+IHJlc29sdmUoKSlcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgc3RvcCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCBzdXBlci5zdG9wKClcblxuICAgIHRoaXMuc2VydmVyLmNsb3NlKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJjbG9zZVwiLCAoKSA9PiByZXNvbHZlKCkpXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGtpbGwoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgc3VwZXIua2lsbCgpXG5cbiAgICAvKiBEb24ndCB3YWl0IGZvciBzZXJ2ZXIgdG8gcXVpdGUgZ3JhY2VmdWxseSwgYnV0IHF1aXQgYWZ0ZXIgc2hvcnQgZGVsYXkuXG4gICAgICAgVGhpcyBhdm9pZHMgcHJvY2Vzc2VzIGhhbmdpbmcgZm9yIGEgbG9uZyB0aW1lIGJlY2F1c2UgYVxuICAgICAgIHJlcXVlc3QgZmFpbGVkIHRvIGZpbmlzaC4gV2Ugc2FjcmlmaWNlIGFsbCBydW5uaW5nIHJlcXVlc3RzIGZvciBhXG4gICAgICAgbW9yZSBzcGVlZHkgcmVjb3ZlcnkgYmVjYXVzZSB0aGUgc2VydmVyIHdpbGwgcmVzdGFydC4gKi9cbiAgICB0aGlzLnNlcnZlci5jbG9zZSgpXG4gICAgdGhpcy5zZXJ2ZXIudW5yZWYoKVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKCksIDUwMClcbiAgICB9KVxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm91dGVyOiB0aGlzLnJvdXRlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgc2VydmVyOiBcIjxub2RlIHNlcnZlcj5cIixcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb25cbiJdfQ==