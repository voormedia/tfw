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

var _closableServer = require("./util/closable-server");

var _closableServer2 = _interopRequireDefault(_closableServer);

var _router = require("./router");

var _router2 = _interopRequireDefault(_router);

var _context = require("./context");

var _context2 = _interopRequireDefault(_context);

var _errors = require("./errors");

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
    this.server.on("request", this.dispatch.bind(this));

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

  dispatch(req, res) {
    const stack = this.stack.slice(0);
    const context = new _context2.default(stack, req, res);
    const handler = compose(stack, context);

    Promise.resolve(handler()).catch(err => {
      process.nextTick(() => {
        throw err;
      });
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


function compose(stack, context) {
  const iterator = stack.values();

  return function next() {
    const handler = iterator.next().value;

    /* Check if a handler is present and valid. */
    if (!handler) {
      throw new _errors.NotFound("Endpoint does not exist");
    }

    if (typeof handler !== "function") {
      throw new _errors.InternalServerError("Bad handler");
    }

    // ES7: return context::handler(next)
    return handler.call(context, next);
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInNodXRkb3duIiwicm91dGUiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJzdG9wIiwiZXhpdCIsImVyciIsImNyaXRpY2FsIiwia2lsbCIsInByb21pc2UiLCJ0b1N0cmluZyIsImRpc3BhdGNoIiwiYmluZCIsIm5vdGljZSIsImxpc3RlbiIsIlByb21pc2UiLCJyZXNvbHZlIiwib25jZSIsImNsb3NlIiwid2FybmluZyIsInVucmVmIiwic2V0VGltZW91dCIsInJlcSIsInJlcyIsInNsaWNlIiwiY29udGV4dCIsImhhbmRsZXIiLCJjb21wb3NlIiwiY2F0Y2giLCJpbnNwZWN0IiwiaXRlcmF0b3IiLCJ2YWx1ZXMiLCJuZXh0IiwidmFsdWUiLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztJQUFZQSxVOzs7Ozs7OztBQVlaLE1BQU1DLGNBQWUsR0FBRSxrQkFBUUMsSUFBSyxZQUFXQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosSUFBd0IsRUFBRyxFQUF0RCxDQUF3REMsSUFBeEQsRUFBcEI7O0lBRWFDLFcsV0FBQUEsVyxHQUFOLE1BQU1BLFdBQU4sQ0FBa0I7O0FBU3ZCO0FBQ0EsU0FBT0MsS0FBUCxDQUFhQyxVQUE4QkMsT0FBT0MsSUFBUCxDQUFZLEVBQVos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QSxNQURSO0FBRUxJLGFBQU8sS0FBS0EsS0FGUDtBQUdMTixjQUFRO0FBSEgsS0FBUDtBQUtEO0FBN0hzQixDO2tCQWdJVlIsVzs7O0FBRWYsU0FBUzhDLE9BQVQsQ0FBaUJoQyxLQUFqQixFQUErQjhCLE9BQS9CLEVBQXVEO0FBQ3JELFFBQU1LLFdBQVduQyxNQUFNb0MsTUFBTixFQUFqQjs7QUFFQSxTQUFPLFNBQVNDLElBQVQsR0FBZ0I7QUFDckIsVUFBTU4sVUFBVUksU0FBU0UsSUFBVCxHQUFnQkMsS0FBaEM7O0FBRUE7QUFDQSxRQUFJLENBQUNQLE9BQUwsRUFBYztBQUNaLFlBQU0scUJBQWEseUJBQWIsQ0FBTjtBQUNEOztBQUVELFFBQUksT0FBT0EsT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNqQyxZQUFNLGdDQUF3QixhQUF4QixDQUFOO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFPQSxRQUFRUSxJQUFSLENBQWFULE9BQWIsRUFBc0JPLElBQXRCLENBQVA7QUFDRCxHQWREO0FBZUQiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IFwiLi91dGlsL3BvbHlmaWxsXCJcblxuaW1wb3J0IGhvc3RQa2cgZnJvbSBcIi4vdXRpbC9ob3N0LXBrZ1wiXG5cbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vdXRpbC9sb2dnZXJcIlxuaW1wb3J0IENsb3NhYmxlU2VydmVyIGZyb20gXCIuL3V0aWwvY2xvc2FibGUtc2VydmVyXCJcbmltcG9ydCBSb3V0ZXIgZnJvbSBcIi4vcm91dGVyXCJcbmltcG9ydCBDb250ZXh0IGZyb20gXCIuL2NvbnRleHRcIlxuXG5pbXBvcnQge05vdEZvdW5kLCBJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi9lcnJvcnNcIlxuaW1wb3J0ICogYXMgbWlkZGxld2FyZSBmcm9tIFwiLi9taWRkbGV3YXJlXCJcblxuaW1wb3J0IHR5cGUge05leHQsIFN0YWNrfSBmcm9tIFwiLi9taWRkbGV3YXJlXCJcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSBcIi4vY29udGV4dFwiXG5cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uT3B0aW9ucyA9IHt8XG4gIHBvcnQ/OiBudW1iZXIsXG4gIGxvZ2dlcj86IExvZ2dlcixcbiAgcm91dGVyPzogUm91dGVyLFxuICB0ZXJtaW5hdGlvbkdyYWNlPzogbnVtYmVyLFxufH1cblxuY29uc3QgZGVzY3JpcHRpb24gPSBgJHtob3N0UGtnLm5hbWV9IHNlcnZpY2UgJHtwcm9jZXNzLmVudi5IT1NUTkFNRSB8fCBcIlwifWAudHJpbSgpXG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIHBvcnQ6IG51bWJlclxuICByb3V0ZXI6IFJvdXRlclxuICBsb2dnZXI6IExvZ2dlclxuICBzdGFjazogU3RhY2tcblxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gZGVzY3JpcHRpb25cbiAgc2VydmVyOiBDbG9zYWJsZVNlcnZlciA9IG5ldyBDbG9zYWJsZVNlcnZlcigpXG5cbiAgLyogU3RhcnQgYSBuZXcgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSBPYmplY3Quc2VhbCh7fSkpIHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24ob3B0aW9ucylcbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHthcHAuc3RhcnQoKX0pXG4gICAgcmV0dXJuIGFwcFxuICB9XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3Qge1xuICAgICAgcG9ydCA9IDMwMDAsXG4gICAgICByb3V0ZXIgPSBuZXcgUm91dGVyLFxuICAgICAgbG9nZ2VyID0gbmV3IExvZ2dlcixcbiAgICAgIHRlcm1pbmF0aW9uR3JhY2UgPSAyNSxcbiAgICB9ID0gb3B0aW9uc1xuXG4gICAgLyogQXNzaWduIGRlZmF1bHQgZW52LiAqL1xuICAgIGlmICghcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJkZXZlbG9wbWVudFwiXG4gICAgfVxuXG4gICAgdGhpcy5wb3J0ID0gcG9ydFxuICAgIHRoaXMucm91dGVyID0gcm91dGVyXG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJcblxuICAgIC8qIEJhcmUgbWluaW11bSBzdGFjayB0byBkbyBhbnl0aGluZyB1c2VmdWwuICovXG4gICAgdGhpcy5zdGFjayA9IFtcbiAgICAgIG1pZGRsZXdhcmUubG9nKGxvZ2dlciksXG4gICAgICBtaWRkbGV3YXJlLndyaXRlKCksXG4gICAgICBtaWRkbGV3YXJlLnJlc2N1ZSgpLFxuICAgICAgbWlkZGxld2FyZS5zaHV0ZG93bih0ZXJtaW5hdGlvbkdyYWNlKSxcbiAgICAgIG1pZGRsZXdhcmUucm91dGUocm91dGVyKSxcbiAgICBdXG5cbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG4gIH1cblxuICBzdGFydCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5zZXJ2ZXIudGltZW91dCA9IDBcblxuICAgIHByb2Nlc3Mub24oXCJTSUdJTlRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgxMjggKyAyKVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHVEVSTVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDEyOCArIDE1KVxuICAgIH0pXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgICBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIiwgYXN5bmMgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuY2F1Z2h0ICR7ZXJyLnN0YWNrfWApXG4gICAgICAgIGF3YWl0IHRoaXMua2lsbCgpXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgfSlcblxuICAgICAgcHJvY2Vzcy5vbihcInVuaGFuZGxlZFJlamVjdGlvblwiLCBhc3luYyAoZXJyOiBFcnJvciwgcHJvbWlzZTogUHJvbWlzZTxhbnk+KSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmNyaXRpY2FsKGB1bmhhbmRsZWQgJHtlcnIuc3RhY2t9IGZyb20gJHtwcm9taXNlLnRvU3RyaW5nKCl9YClcbiAgICAgICAgYXdhaXQgdGhpcy5raWxsKClcbiAgICAgICAgcHJvY2Vzcy5leGl0KDIpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIEVTNzogdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIDo6dGhpcy5kaXNwYXRjaClcbiAgICB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgdGhpcy5kaXNwYXRjaC5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdGFydGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwibGlzdGVuaW5nXCIsICgpID0+IHJlc29sdmUodGhpcykpXG4gICAgfSlcbiAgfVxuXG4gIHN0b3AoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RvcHBpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICB0aGlzLnNlcnZlci5jbG9zZSgpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwiY2xvc2VcIiwgKCkgPT4gcmVzb2x2ZSh0aGlzKSlcbiAgICB9KVxuICB9XG5cbiAga2lsbCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5sb2dnZXIud2FybmluZyhgZm9yY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgLyogRG9uJ3Qgd2FpdCBmb3Igc2VydmVyIHRvIHF1aXRlIGdyYWNlZnVsbHksIGJ1dCBxdWl0IGFmdGVyIHNob3J0IGRlbGF5LlxuICAgICAgIFRoaXMgYXZvaWRzIHByb2Nlc3NlcyBoYW5naW5nIGZvciBhIGxvbmcgdGltZSBiZWNhdXNlIGFcbiAgICAgICByZXF1ZXN0IGZhaWxlZCB0byBmaW5pc2guIFdlIHNhY3JpZmljZSBhbGwgcnVubmluZyByZXF1ZXN0cyBmb3IgYVxuICAgICAgIG1vcmUgc3BlZWR5IHJlY292ZXJ5IGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIHJlc3RhcnQuICovXG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2UoKVxuICAgIHRoaXMuc2VydmVyLnVucmVmKClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSh0aGlzKSwgNTAwKVxuICAgIH0pXG4gIH1cblxuICBkaXNwYXRjaChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFjayA9IHRoaXMuc3RhY2suc2xpY2UoMClcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IENvbnRleHQoc3RhY2ssIHJlcSwgcmVzKVxuICAgIGNvbnN0IGhhbmRsZXIgPSBjb21wb3NlKHN0YWNrLCBjb250ZXh0KVxuXG4gICAgUHJvbWlzZS5yZXNvbHZlKGhhbmRsZXIoKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge3Rocm93IGVycn0pXG4gICAgfSlcbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdXRlcjogdGhpcy5yb3V0ZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIHNlcnZlcjogXCI8bm9kZSBzZXJ2ZXI+XCIsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIGNvbXBvc2Uoc3RhY2s6IFN0YWNrLCBjb250ZXh0OiBDb250ZXh0KTogTmV4dCB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gc3RhY2sudmFsdWVzKClcblxuICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gaXRlcmF0b3IubmV4dCgpLnZhbHVlXG5cbiAgICAvKiBDaGVjayBpZiBhIGhhbmRsZXIgaXMgcHJlc2VudCBhbmQgdmFsaWQuICovXG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgTm90Rm91bmQoXCJFbmRwb2ludCBkb2VzIG5vdCBleGlzdFwiKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvcihcIkJhZCBoYW5kbGVyXCIpXG4gICAgfVxuXG4gICAgLy8gRVM3OiByZXR1cm4gY29udGV4dDo6aGFuZGxlcihuZXh0KVxuICAgIHJldHVybiBoYW5kbGVyLmNhbGwoY29udGV4dCwgbmV4dClcbiAgfVxufVxuIl19