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
    const app = new Application(options);
    process.nextTick(() => {
      app.start();
    });
    return app;
  }

  constructor(options = {}) {
    const {
      port = 3000,
      router = new _router2.default(),
      logger = new _logger2.default(),
      terminationGrace = 25
    } = options;

    super();

    this.server = new _closableServer2.default();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiQXBwbGljYXRpb24iLCJzdGFydCIsIm9wdGlvbnMiLCJhcHAiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJjb25zdHJ1Y3RvciIsInBvcnQiLCJyb3V0ZXIiLCJsb2dnZXIiLCJ0ZXJtaW5hdGlvbkdyYWNlIiwic2VydmVyIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInNodXRkb3duIiwicm91dGUiLCJPYmplY3QiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJsaXN0ZW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9uY2UiLCJzdG9wIiwiY2xvc2UiLCJraWxsIiwidW5yZWYiLCJzZXRUaW1lb3V0IiwiaW5zcGVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7SUFBWUEsVTs7Ozs7O0FBSVo7SUFRYUMsVyxXQUFBQSxXLEdBQU4sTUFBTUEsV0FBTixnQ0FBdUM7O0FBTzVDO0FBQ0EsU0FBT0MsS0FBUCxDQUFhQyxVQUE4QixFQUEzQyxFQUErQztBQUM3QyxVQUFNQyxNQUFNLElBQUlILFdBQUosQ0FBZ0JFLE9BQWhCLENBQVo7QUFDQUUsWUFBUUMsUUFBUixDQUFpQixNQUFNO0FBQUNGLFVBQUlGLEtBQUo7QUFBWSxLQUFwQztBQUNBLFdBQU9FLEdBQVA7QUFDRDs7QUFFREcsY0FBWUosVUFBOEIsRUFBMUMsRUFBOEM7QUFDNUMsVUFBTTtBQUNKSyxhQUFPLElBREg7QUFFSkMsZUFBUyxzQkFGTDtBQUdKQyxlQUFTLHNCQUhMO0FBSUpDLHlCQUFtQjtBQUpmLFFBS0ZSLE9BTEo7O0FBT0E7O0FBUjRDLFNBVDlDUyxNQVM4QyxHQVRyQiw4QkFTcUI7QUFVNUMsU0FBS0osSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkOztBQUVBO0FBQ0EsU0FBS0csS0FBTCxHQUFhLENBQ1hiLFdBQVdjLEdBQVgsQ0FBZUosTUFBZixDQURXLEVBRVhWLFdBQVdlLEtBQVgsRUFGVyxFQUdYZixXQUFXZ0IsTUFBWCxFQUhXLEVBSVhoQixXQUFXaUIsUUFBWCxDQUFvQk4sZ0JBQXBCLENBSlcsRUFLWFgsV0FBV2tCLEtBQVgsQ0FBaUJULE1BQWpCLENBTFcsQ0FBYjs7QUFRQVUsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFRCxRQUFNbEIsS0FBTixHQUE2QjtBQUMzQixVQUFNLE1BQU1BLEtBQU4sRUFBTjs7QUFFQSxTQUFLVSxNQUFMLENBQVlTLE9BQVosR0FBc0IsQ0FBdEI7O0FBRUE7QUFDQSxTQUFLVCxNQUFMLENBQVlVLEVBQVosQ0FBZSxTQUFmLEVBQTBCLHdCQUFTLEtBQUtULEtBQWQsQ0FBMUI7O0FBRUEsU0FBS0QsTUFBTCxDQUFZVyxNQUFaLENBQW1CLEtBQUtmLElBQXhCOztBQUVBLFdBQU8sSUFBSWdCLE9BQUosQ0FBWUMsV0FBVztBQUM1QixXQUFLYixNQUFMLENBQVljLElBQVosQ0FBaUIsV0FBakIsRUFBOEIsTUFBTUQsU0FBcEM7QUFDRCxLQUZNLENBQVA7QUFHRDs7QUFFRCxRQUFNRSxJQUFOLEdBQTRCO0FBQzFCLFVBQU0sTUFBTUEsSUFBTixFQUFOOztBQUVBLFNBQUtmLE1BQUwsQ0FBWWdCLEtBQVo7O0FBRUEsV0FBTyxJQUFJSixPQUFKLENBQVlDLFdBQVc7QUFDNUIsV0FBS2IsTUFBTCxDQUFZYyxJQUFaLENBQWlCLE9BQWpCLEVBQTBCLE1BQU1ELFNBQWhDO0FBQ0QsS0FGTSxDQUFQO0FBR0Q7O0FBRUQsUUFBTUksSUFBTixHQUE0QjtBQUMxQixVQUFNLE1BQU1BLElBQU4sRUFBTjs7QUFFQTs7OztBQUlBLFNBQUtqQixNQUFMLENBQVlnQixLQUFaO0FBQ0EsU0FBS2hCLE1BQUwsQ0FBWWtCLEtBQVo7O0FBRUEsV0FBTyxJQUFJTixPQUFKLENBQVlDLFdBQVc7QUFDNUJNLGlCQUFXLE1BQU1OLFNBQWpCLEVBQTRCLEdBQTVCO0FBQ0QsS0FGTSxDQUFQO0FBR0Q7O0FBRURPLFlBQVU7QUFDUixXQUFPO0FBQ0x2QixjQUFRLEtBQUtBLE1BRFI7QUFFTEksYUFBTyxLQUFLQSxLQUZQO0FBR0xELGNBQVE7QUFISCxLQUFQO0FBS0Q7QUF0RjJDLEM7a0JBeUYvQlgsVyIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgXCIuL3V0aWwvcG9seWZpbGxcIlxuXG5pbXBvcnQgQWJzdHJhY3RUYXNrIGZyb20gXCIuL3V0aWwvYWJzdHJhY3QtdGFza1wiXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL3V0aWwvbG9nZ2VyXCJcbmltcG9ydCBSb3V0ZXIgZnJvbSBcIi4vcm91dGVyXCJcblxuaW1wb3J0IENsb3NhYmxlU2VydmVyIGZyb20gXCIuL2FwcC9jbG9zYWJsZS1zZXJ2ZXJcIlxuaW1wb3J0IGRpc3BhdGNoIGZyb20gXCIuL2FwcC9kaXNwYXRjaFwiXG5cbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbi8qICRTaGFwZTxUPiBtYWtlcyBldmVyeSBwcm9wZXJ0eSBvcHRpb25hbC4gKi9cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uT3B0aW9ucyA9ICRTaGFwZTx7XG4gIHBvcnQ6IG51bWJlcixcbiAgbG9nZ2VyOiBMb2dnZXIsXG4gIHJvdXRlcjogUm91dGVyLFxuICB0ZXJtaW5hdGlvbkdyYWNlOiBudW1iZXIsXG59PlxuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRhc2sge1xuICBwb3J0OiBudW1iZXJcbiAgcm91dGVyOiBSb3V0ZXJcbiAgc3RhY2s6IFN0YWNrXG5cbiAgc2VydmVyOiBDbG9zYWJsZVNlcnZlciA9IG5ldyBDbG9zYWJsZVNlcnZlcigpXG5cbiAgLyogU3RhcnQgYSBuZXcgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihvcHRpb25zKVxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge2FwcC5zdGFydCgpfSlcbiAgICByZXR1cm4gYXBwXG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvcnQgPSAzMDAwLFxuICAgICAgcm91dGVyID0gbmV3IFJvdXRlcixcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgICB0ZXJtaW5hdGlvbkdyYWNlID0gMjUsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIHN1cGVyKClcblxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICAvKiBCYXJlIG1pbmltdW0gc3RhY2sgdG8gZG8gYW55dGhpbmcgdXNlZnVsLiAqL1xuICAgIHRoaXMuc3RhY2sgPSBbXG4gICAgICBtaWRkbGV3YXJlLmxvZyhsb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSgpLFxuICAgICAgbWlkZGxld2FyZS5yZXNjdWUoKSxcbiAgICAgIG1pZGRsZXdhcmUuc2h1dGRvd24odGVybWluYXRpb25HcmFjZSksXG4gICAgICBtaWRkbGV3YXJlLnJvdXRlKHJvdXRlciksXG4gICAgXVxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgc3VwZXIuc3RhcnQoKVxuXG4gICAgdGhpcy5zZXJ2ZXIudGltZW91dCA9IDBcblxuICAgIC8vIEVTNzogdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIDo6dGhpcy5kaXNwYXRjaClcbiAgICB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgZGlzcGF0Y2godGhpcy5zdGFjaykpXG5cbiAgICB0aGlzLnNlcnZlci5saXN0ZW4odGhpcy5wb3J0KVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXJ2ZXIub25jZShcImxpc3RlbmluZ1wiLCAoKSA9PiByZXNvbHZlKCkpXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHN0b3AoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgc3VwZXIuc3RvcCgpXG5cbiAgICB0aGlzLnNlcnZlci5jbG9zZSgpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwiY2xvc2VcIiwgKCkgPT4gcmVzb2x2ZSgpKVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBraWxsKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHN1cGVyLmtpbGwoKVxuXG4gICAgLyogRG9uJ3Qgd2FpdCBmb3Igc2VydmVyIHRvIHF1aXRlIGdyYWNlZnVsbHksIGJ1dCBxdWl0IGFmdGVyIHNob3J0IGRlbGF5LlxuICAgICAgIFRoaXMgYXZvaWRzIHByb2Nlc3NlcyBoYW5naW5nIGZvciBhIGxvbmcgdGltZSBiZWNhdXNlIGFcbiAgICAgICByZXF1ZXN0IGZhaWxlZCB0byBmaW5pc2guIFdlIHNhY3JpZmljZSBhbGwgcnVubmluZyByZXF1ZXN0cyBmb3IgYVxuICAgICAgIG1vcmUgc3BlZWR5IHJlY292ZXJ5IGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIHJlc3RhcnQuICovXG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2UoKVxuICAgIHRoaXMuc2VydmVyLnVucmVmKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSgpLCA1MDApXG4gICAgfSlcbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdXRlcjogdGhpcy5yb3V0ZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIHNlcnZlcjogXCI8bm9kZSBzZXJ2ZXI+XCIsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uXG4iXX0=