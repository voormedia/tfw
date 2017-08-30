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

var _sleep = require("./util/sleep");

var _sleep2 = _interopRequireDefault(_sleep);

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

    process.on("SIGTERM", _asyncToGenerator(function* () {
      yield _this.stop();
      process.exit(0);
    }));

    process.on("SIGINT", _asyncToGenerator(function* () {
      yield _this.stop();
      process.exit(0);
    }));

    if (process.env.NODE_ENV !== "test") {
      process.on("uncaughtException", (() => {
        var _ref3 = _asyncToGenerator(function* (err) {
          _this.logger.critical(`uncaught ${err.stack}`);

          /* Don't wait for server to quite gracefully, but quit after short delay.
             This avoids processes hanging for a long time because a
             request failed to finish. We sacrifice all running requests for a
             more speedy recovery because the server will restart. */
          _this.stop();

          yield (0, _sleep2.default)(500);
          _this.logger.warning(`forcefully stopped ${_this.description}`);

          process.exit(1);
        });

        return function (_x) {
          return _ref3.apply(this, arguments);
        };
      })());
    }

    // ES7: this.server.on("request", ::this.dispatch)
    this.server.on("request", this.dispatch.bind(this));

    const started = new Promise(resolve => {
      this.server.once("listening", () => {
        resolve(this);
      });
    });

    this.logger.notice(`starting ${this.description}`);

    this.server.listen(this.port);

    return started;
  }

  stop() {
    const stopped = new Promise(resolve => {
      this.server.once("close", () => {
        resolve(this);
      });
    });

    this.logger.notice(`stopping ${this.description}`);

    this.server.close();

    return stopped;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInNodXRkb3duIiwicm91dGUiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJzdG9wIiwiZXhpdCIsImVyciIsImNyaXRpY2FsIiwid2FybmluZyIsImRpc3BhdGNoIiwiYmluZCIsInN0YXJ0ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9uY2UiLCJub3RpY2UiLCJsaXN0ZW4iLCJzdG9wcGVkIiwiY2xvc2UiLCJyZXEiLCJyZXMiLCJzbGljZSIsImNvbnRleHQiLCJoYW5kbGVyIiwiY29tcG9zZSIsImNhdGNoIiwiaW5zcGVjdCIsIml0ZXJhdG9yIiwidmFsdWVzIiwibmV4dCIsInZhbHVlIiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7SUFBWUEsVTs7QUFLWjs7Ozs7Ozs7OztBQVNBLE1BQU1DLGNBQWUsR0FBRSxrQkFBUUMsSUFBSyxZQUFXQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosSUFBd0IsRUFBRyxFQUF0RCxDQUF3REMsSUFBeEQsRUFBcEI7O0lBRWFDLFcsV0FBQUEsVyxHQUFOLE1BQU1BLFdBQU4sQ0FBa0I7O0FBU3ZCO0FBQ0EsU0FBT0MsS0FBUCxDQUFhQyxVQUE4QkMsT0FBT0MsSUFBUCxDQUFZLEVBQVosQ0FBM0MsRUFBNEQ7QUFDMUQsVUFB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QXhCLENBQU47QUFDRDs7QUFFRDtBQUNBLFdBQU9BLFFBQVFRLElBQVIsQ0FBYVQsT0FBYixFQUFzQk8sSUFBdEIsQ0FBUDtBQUNELEdBZEQ7QUFlRCIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgXCIuL3V0aWwvcG9seWZpbGxcIlxuXG5pbXBvcnQgaG9zdFBrZyBmcm9tIFwiLi91dGlsL2hvc3QtcGtnXCJcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi91dGlsL2xvZ2dlclwiXG5pbXBvcnQgQ2xvc2FibGVTZXJ2ZXIgZnJvbSBcIi4vdXRpbC9jbG9zYWJsZS1zZXJ2ZXJcIlxuaW1wb3J0IFJvdXRlciBmcm9tIFwiLi9yb3V0ZXJcIlxuaW1wb3J0IENvbnRleHQgZnJvbSBcIi4vY29udGV4dFwiXG5cbmltcG9ydCB7Tm90Rm91bmQsIEludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuL2Vycm9yc1wiXG5pbXBvcnQgKiBhcyBtaWRkbGV3YXJlIGZyb20gXCIuL21pZGRsZXdhcmVcIlxuXG5pbXBvcnQgdHlwZSB7TmV4dCwgU3RhY2t9IGZyb20gXCIuL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tIFwiLi9jb250ZXh0XCJcblxuaW1wb3J0IHNsZWVwIGZyb20gXCIuL3V0aWwvc2xlZXBcIlxuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fFxuICBwb3J0PzogbnVtYmVyLFxuICBsb2dnZXI/OiBMb2dnZXIsXG4gIHJvdXRlcj86IFJvdXRlcixcbiAgdGVybWluYXRpb25HcmFjZT86IG51bWJlcixcbnx9XG5cbmNvbnN0IGRlc2NyaXB0aW9uID0gYCR7aG9zdFBrZy5uYW1lfSBzZXJ2aWNlICR7cHJvY2Vzcy5lbnYuSE9TVE5BTUUgfHwgXCJcIn1gLnRyaW0oKVxuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuICBwb3J0OiBudW1iZXJcbiAgcm91dGVyOiBSb3V0ZXJcbiAgbG9nZ2VyOiBMb2dnZXJcbiAgc3RhY2s6IFN0YWNrXG5cbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IGRlc2NyaXB0aW9uXG4gIHNlcnZlcjogQ2xvc2FibGVTZXJ2ZXIgPSBuZXcgQ2xvc2FibGVTZXJ2ZXIoKVxuXG4gIC8qIFN0YXJ0IGEgbmV3IGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgaW4gbmV4dCB0aWNrLiAqL1xuICBzdGF0aWMgc3RhcnQob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKG9wdGlvbnMpXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7YXBwLnN0YXJ0KCl9KVxuICAgIHJldHVybiBhcHBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IE9iamVjdC5zZWFsKHt9KSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvcnQgPSAzMDAwLFxuICAgICAgcm91dGVyID0gbmV3IFJvdXRlcixcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgICB0ZXJtaW5hdGlvbkdyYWNlID0gMjUsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cblxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICAvKiBCYXJlIG1pbmltdW0gc3RhY2sgdG8gZG8gYW55dGhpbmcgdXNlZnVsLiAqL1xuICAgIHRoaXMuc3RhY2sgPSBbXG4gICAgICBtaWRkbGV3YXJlLmxvZyhsb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSgpLFxuICAgICAgbWlkZGxld2FyZS5yZXNjdWUoKSxcbiAgICAgIG1pZGRsZXdhcmUuc2h1dGRvd24odGVybWluYXRpb25HcmFjZSksXG4gICAgICBtaWRkbGV3YXJlLnJvdXRlKHJvdXRlciksXG4gICAgXVxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgc3RhcnQoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMuc2VydmVyLnRpbWVvdXQgPSAwXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHVEVSTVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDApXG4gICAgfSlcblxuICAgIHByb2Nlc3Mub24oXCJTSUdJTlRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgIH0pXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgICBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIiwgYXN5bmMgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuY2F1Z2h0ICR7ZXJyLnN0YWNrfWApXG5cbiAgICAgICAgLyogRG9uJ3Qgd2FpdCBmb3Igc2VydmVyIHRvIHF1aXRlIGdyYWNlZnVsbHksIGJ1dCBxdWl0IGFmdGVyIHNob3J0IGRlbGF5LlxuICAgICAgICAgICBUaGlzIGF2b2lkcyBwcm9jZXNzZXMgaGFuZ2luZyBmb3IgYSBsb25nIHRpbWUgYmVjYXVzZSBhXG4gICAgICAgICAgIHJlcXVlc3QgZmFpbGVkIHRvIGZpbmlzaC4gV2Ugc2FjcmlmaWNlIGFsbCBydW5uaW5nIHJlcXVlc3RzIGZvciBhXG4gICAgICAgICAgIG1vcmUgc3BlZWR5IHJlY292ZXJ5IGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIHJlc3RhcnQuICovXG4gICAgICAgIHRoaXMuc3RvcCgpXG5cbiAgICAgICAgYXdhaXQgc2xlZXAoNTAwKVxuICAgICAgICB0aGlzLmxvZ2dlci53YXJuaW5nKGBmb3JjZWZ1bGx5IHN0b3BwZWQgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIEVTNzogdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIDo6dGhpcy5kaXNwYXRjaClcbiAgICB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgdGhpcy5kaXNwYXRjaC5iaW5kKHRoaXMpKVxuXG4gICAgY29uc3Qgc3RhcnRlZCA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXJ2ZXIub25jZShcImxpc3RlbmluZ1wiLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUodGhpcylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RhcnRpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICB0aGlzLnNlcnZlci5saXN0ZW4odGhpcy5wb3J0KVxuXG4gICAgcmV0dXJuIHN0YXJ0ZWRcbiAgfVxuXG4gIHN0b3AoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIGNvbnN0IHN0b3BwZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUodGhpcylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RvcHBpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICB0aGlzLnNlcnZlci5jbG9zZSgpXG5cbiAgICByZXR1cm4gc3RvcHBlZFxuICB9XG5cbiAgZGlzcGF0Y2gocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhY2sgPSB0aGlzLnN0YWNrLnNsaWNlKDApXG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBDb250ZXh0KHN0YWNrLCByZXEsIHJlcylcbiAgICBjb25zdCBoYW5kbGVyID0gY29tcG9zZShzdGFjaywgY29udGV4dClcblxuICAgIFByb21pc2UucmVzb2x2ZShoYW5kbGVyKCkpLmNhdGNoKGVyciA9PiB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHt0aHJvdyBlcnJ9KVxuICAgIH0pXG4gIH1cblxuICBpbnNwZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICByb3V0ZXI6IHRoaXMucm91dGVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICBzZXJ2ZXI6IFwiPG5vZGUgc2VydmVyPlwiLFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBsaWNhdGlvblxuXG5mdW5jdGlvbiBjb21wb3NlKHN0YWNrOiBTdGFjaywgY29udGV4dDogQ29udGV4dCk6IE5leHQge1xuICBjb25zdCBpdGVyYXRvciA9IHN0YWNrLnZhbHVlcygpXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgY29uc3QgaGFuZGxlciA9IGl0ZXJhdG9yLm5leHQoKS52YWx1ZVxuXG4gICAgLyogQ2hlY2sgaWYgYSBoYW5kbGVyIGlzIHByZXNlbnQgYW5kIHZhbGlkLiAqL1xuICAgIGlmICghaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IE5vdEZvdW5kKFwiRW5kcG9pbnQgZG9lcyBub3QgZXhpc3RcIilcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IEludGVybmFsU2VydmVyRXJyb3IoXCJCYWQgaGFuZGxlclwiKVxuICAgIH1cblxuICAgIC8vIEVTNzogcmV0dXJuIGNvbnRleHQ6OmhhbmRsZXIobmV4dClcbiAgICByZXR1cm4gaGFuZGxlci5jYWxsKGNvbnRleHQsIG5leHQpXG4gIH1cbn1cbiJdfQ==