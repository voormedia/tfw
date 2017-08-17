"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = undefined;

require("./util/polyfill");

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _hostPkg = require("./util/host-pkg");

var _hostPkg2 = _interopRequireDefault(_hostPkg);

var _logger = require("./util/logger");

var _logger2 = _interopRequireDefault(_logger);

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
    this.server = _http2.default.createServer();
    this.sockets = new Set();
    this.requests = new Set();

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
    this.stack = [middleware.log(logger), middleware.write(), middleware.shutdown(terminationGrace), middleware.route(router)];

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

    process.on("uncaughtException", (() => {
      var _ref3 = _asyncToGenerator(function* (err) {
        _this.logger.critical(`uncaught ${err.stack}`);
        yield _this.stop();
        process.exit(1);
      });

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    })());

    this.server.on("connection", socket => {
      socket.idle = true;

      socket.on("close", () => {
        this.sockets.delete(socket);
      });

      this.sockets.add(socket);
    });

    this.server.on("request", (request, response) => {
      const socket = request.socket;
      socket.idle = false;

      if (this.server.closing) {
        response.removeHeader("Connection");
        response.setHeader("Connection", "close");
      }

      response.on("finish", () => {
        socket.idle = true;

        if (this.server.closing) {
          this.logger.debug(`closing connection ${socket.remoteAddress || "unknown"}:${socket.remotePort}`);
          socket.end();
        }
      });
    });

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
    this.server.closing = true;

    this.logger.notice(`stopping ${this.description}`);

    const stopped = new Promise(resolve => {
      this.server.once("close", () => {
        this.logger.notice(`gracefully stopped ${this.description}`);
        resolve(this);
      });
    });

    for (const request of this.requests) {
      request.cancelled = true;
    }

    this.server.close();

    for (const socket of this.sockets) {
      if (socket.idle) {
        this.logger.debug(`closing idle connection ${socket.remoteAddress || "unknown"}:${socket.remotePort}`);
        socket.end();
      }
    }

    return stopped;
  }

  dispatch(req, res) {
    var _this2 = this;

    const stack = this.stack.slice(0);
    const context = new _context2.default(this, stack, req, res);
    const handler = compose(stack, context);

    const call = (() => {
      var _ref4 = _asyncToGenerator(function* () {
        try {
          _this2.requests.add(context.req);
          yield handler();
        } finally {
          _this2.requests.delete(context.req);
        }
      });

      return function call() {
        return _ref4.apply(this, arguments);
      };
    })();

    Promise.resolve(call()).catch(err => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJzb2NrZXRzIiwiU2V0IiwicmVxdWVzdHMiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInNodXRkb3duIiwicm91dGUiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJzdG9wIiwiZXhpdCIsImVyciIsImNyaXRpY2FsIiwic29ja2V0IiwiaWRsZSIsImRlbGV0ZSIsImFkZCIsInJlcXVlc3QiLCJyZXNwb25zZSIsImNsb3NpbmciLCJyZW1vdmVIZWFkZXIiLCJzZXRIZWFkZXIiLCJkZWJ1ZyIsInJlbW90ZUFkZHJlc3MiLCJyZW1vdGVQb3J0IiwiZW5kIiwiZGlzcGF0Y2giLCJiaW5kIiwic3RhcnRlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwib25jZSIsIm5vdGljZSIsImxpc3RlbiIsInN0b3BwZWQiLCJjYW5jZWxsZWQiLCJjbG9zZSIsInJlcSIsInJlcyIsInNsaWNlIiwiY29udGV4dCIsImhhbmRsZXIiLCJjb21wb3NlIiwiY2FsbCIsImNhdGNoIiwiaW5zcGVjdCIsIml0ZXJhdG9yIiwidmFsdWVzIiwibmV4dCIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztJQUFZQSxVOzs7Ozs7OztBQXdCWixNQUFNQyxjQUFlLEdBQUUsa0JBQVFDLElBQUssWUFBV0MsUUFBUUMsR0FBUixDQUFZ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QVIsWUFBUUMsT0FBUixDQUFnQmEsTUFBaEIsRUFBd0JDLEtBQXhCLENBQThCakMsT0FBTztBQUNuQ2hDLGNBQVFVLFFBQVIsQ0FBaUIsTUFBTTtBQUFDLGNBQU1zQixHQUFOO0FBQVUsT0FBbEM7QUFDRCxLQUZEO0FBR0Q7O0FBRURrQyxZQUFVO0FBQ1IsV0FBTztBQUNMaEQsY0FBUSxLQUFLQSxNQURSO0FBRUxJLGFBQU8sS0FBS0EsS0FGUDtBQUdMVixjQUFRO0FBSEgsS0FBUDtBQUtEO0FBbktzQixDO2tCQXNLVlIsVzs7O0FBRWYsU0FBUzJELE9BQVQsQ0FBaUJ6QyxLQUFqQixFQUErQnVDLE9BQS9CLEVBQXVEO0FBQ3JELFFBQU1NLFdBQVc3QyxNQUFNOEMsTUFBTixFQUFqQjs7QUFFQSxTQUFPLFNBQVNDLElBQVQsR0FBZ0I7QUFDckIsVUFBTVAsVUFBVUssU0FBU0UsSUFBVCxHQUFnQkMsS0FBaEM7O0FBRUE7QUFDQSxRQUFJLENBQUNSLE9BQUwsRUFBYztBQUNaLFlBQU0scUJBQWEseUJBQWIsQ0FBTjtBQUNEOztBQUVELFFBQUksT0FBT0EsT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNqQyxZQUFNLGdDQUF3QixhQUF4QixDQUFOO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFPQSxRQUFRRSxJQUFSLENBQWFILE9BQWIsRUFBc0JRLElBQXRCLENBQVA7QUFDRCxHQWREO0FBZUQiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IFwiLi91dGlsL3BvbHlmaWxsXCJcblxuaW1wb3J0IGh0dHAgZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgaG9zdFBrZyBmcm9tIFwiLi91dGlsL2hvc3QtcGtnXCJcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi91dGlsL2xvZ2dlclwiXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuL3JvdXRlclwiXG5pbXBvcnQgQ29udGV4dCBmcm9tIFwiLi9jb250ZXh0XCJcblxuaW1wb3J0IHtOb3RGb3VuZCwgSW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4vZXJyb3JzXCJcbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtOZXh0LCBTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gXCIuL2NvbnRleHRcIlxuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fFxuICBwb3J0PzogbnVtYmVyLFxuICBsb2dnZXI/OiBMb2dnZXIsXG4gIHJvdXRlcj86IFJvdXRlcixcbiAgdGVybWluYXRpb25HcmFjZT86IG51bWJlcixcbnx9XG5cbnR5cGUgSWRsaW5nU29ja2V0ID0gbmV0JFNvY2tldCAmIHtcbiAgaWRsZT86IGJvb2xlYW4sXG59XG5cbnR5cGUgQ2FuY2VsbGluZ1JlcXVlc3QgPSBSZXF1ZXN0ICYge1xuICBjYW5jZWxsZWQ/OiBib29sZWFuLFxufVxuXG50eXBlIENsb3NpbmdTZXJ2ZXIgPSBodHRwLlNlcnZlciAmIHtcbiAgY2xvc2luZz86IGJvb2xlYW4sXG59XG5cbmNvbnN0IGRlc2NyaXB0aW9uID0gYCR7aG9zdFBrZy5uYW1lfSBzZXJ2aWNlICR7cHJvY2Vzcy5lbnYuSE9TVE5BTUUgfHwgXCJcIn1gLnRyaW0oKVxuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuICBwb3J0OiBudW1iZXJcbiAgcm91dGVyOiBSb3V0ZXJcbiAgbG9nZ2VyOiBMb2dnZXJcbiAgc3RhY2s6IFN0YWNrXG5cbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IGRlc2NyaXB0aW9uXG4gIHNlcnZlcjogQ2xvc2luZ1NlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKClcbiAgc29ja2V0czogU2V0PElkbGluZ1NvY2tldD4gPSBuZXcgU2V0XG4gIHJlcXVlc3RzOiBTZXQ8Q2FuY2VsbGluZ1JlcXVlc3Q+ID0gbmV3IFNldFxuXG4gIC8qIFN0YXJ0IGEgbmV3IGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgaW4gbmV4dCB0aWNrLiAqL1xuICBzdGF0aWMgc3RhcnQob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKG9wdGlvbnMpXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7YXBwLnN0YXJ0KCl9KVxuICAgIHJldHVybiBhcHBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IE9iamVjdC5zZWFsKHt9KSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvcnQgPSAzMDAwLFxuICAgICAgcm91dGVyID0gbmV3IFJvdXRlcixcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgICB0ZXJtaW5hdGlvbkdyYWNlID0gMjUsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cblxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICAvKiBCYXJlIG1pbmltdW0gc3RhY2sgdG8gZG8gYW55dGhpbmcgdXNlZnVsLiAqL1xuICAgIHRoaXMuc3RhY2sgPSBbXG4gICAgICBtaWRkbGV3YXJlLmxvZyhsb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSgpLFxuICAgICAgbWlkZGxld2FyZS5zaHV0ZG93bih0ZXJtaW5hdGlvbkdyYWNlKSxcbiAgICAgIG1pZGRsZXdhcmUucm91dGUocm91dGVyKSxcbiAgICBdXG5cbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG4gIH1cblxuICBzdGFydCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5zZXJ2ZXIudGltZW91dCA9IDBcblxuICAgIHByb2Nlc3Mub24oXCJTSUdURVJNXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMClcbiAgICB9KVxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR0lOVFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDApXG4gICAgfSlcblxuICAgIHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiLCBhc3luYyAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuY2F1Z2h0ICR7ZXJyLnN0YWNrfWApXG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgfSlcblxuICAgIHRoaXMuc2VydmVyLm9uKFwiY29ubmVjdGlvblwiLCAoc29ja2V0OiBJZGxpbmdTb2NrZXQpID0+IHtcbiAgICAgIHNvY2tldC5pZGxlID0gdHJ1ZVxuXG4gICAgICBzb2NrZXQub24oXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc29ja2V0cy5kZWxldGUoc29ja2V0KVxuICAgICAgfSlcblxuICAgICAgdGhpcy5zb2NrZXRzLmFkZChzb2NrZXQpXG4gICAgfSlcblxuICAgIHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCAocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBzb2NrZXQ6IElkbGluZ1NvY2tldCA9IHJlcXVlc3Quc29ja2V0XG4gICAgICBzb2NrZXQuaWRsZSA9IGZhbHNlXG5cbiAgICAgIGlmICh0aGlzLnNlcnZlci5jbG9zaW5nKSB7XG4gICAgICAgIHJlc3BvbnNlLnJlbW92ZUhlYWRlcihcIkNvbm5lY3Rpb25cIilcbiAgICAgICAgcmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ29ubmVjdGlvblwiLCBcImNsb3NlXCIpXG4gICAgICB9XG5cbiAgICAgIHJlc3BvbnNlLm9uKFwiZmluaXNoXCIsICgpID0+IHtcbiAgICAgICAgc29ja2V0LmlkbGUgPSB0cnVlXG5cbiAgICAgICAgaWYgKHRoaXMuc2VydmVyLmNsb3NpbmcpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgY2xvc2luZyBjb25uZWN0aW9uICR7c29ja2V0LnJlbW90ZUFkZHJlc3MgfHwgXCJ1bmtub3duXCJ9OiR7c29ja2V0LnJlbW90ZVBvcnR9YClcbiAgICAgICAgICBzb2NrZXQuZW5kKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gRVM3OiB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgOjp0aGlzLmRpc3BhdGNoKVxuICAgIHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCB0aGlzLmRpc3BhdGNoLmJpbmQodGhpcykpXG5cbiAgICBjb25zdCBzdGFydGVkID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwibGlzdGVuaW5nXCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdGFydGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQpXG5cbiAgICByZXR1cm4gc3RhcnRlZFxuICB9XG5cbiAgc3RvcCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2luZyA9IHRydWVcblxuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RvcHBpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICBjb25zdCBzdG9wcGVkID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYGdyYWNlZnVsbHkgc3RvcHBlZCAke3RoaXMuZGVzY3JpcHRpb259YClcbiAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZm9yIChjb25zdCByZXF1ZXN0IG9mIHRoaXMucmVxdWVzdHMpIHtcbiAgICAgIHJlcXVlc3QuY2FuY2VsbGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuc2VydmVyLmNsb3NlKClcblxuICAgIGZvciAoY29uc3Qgc29ja2V0IG9mIHRoaXMuc29ja2V0cykge1xuICAgICAgaWYgKHNvY2tldC5pZGxlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBjbG9zaW5nIGlkbGUgY29ubmVjdGlvbiAke3NvY2tldC5yZW1vdGVBZGRyZXNzIHx8IFwidW5rbm93blwifToke3NvY2tldC5yZW1vdGVQb3J0fWApXG4gICAgICAgIHNvY2tldC5lbmQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdG9wcGVkXG4gIH1cblxuICBkaXNwYXRjaChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFjayA9IHRoaXMuc3RhY2suc2xpY2UoMClcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IENvbnRleHQodGhpcywgc3RhY2ssIHJlcSwgcmVzKVxuICAgIGNvbnN0IGhhbmRsZXIgPSBjb21wb3NlKHN0YWNrLCBjb250ZXh0KVxuXG4gICAgY29uc3QgY2FsbCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMuYWRkKGNvbnRleHQucmVxKVxuICAgICAgICBhd2FpdCBoYW5kbGVyKClcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMuZGVsZXRlKGNvbnRleHQucmVxKVxuICAgICAgfVxuICAgIH1cblxuICAgIFByb21pc2UucmVzb2x2ZShjYWxsKCkpLmNhdGNoKGVyciA9PiB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHt0aHJvdyBlcnJ9KVxuICAgIH0pXG4gIH1cblxuICBpbnNwZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICByb3V0ZXI6IHRoaXMucm91dGVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICBzZXJ2ZXI6IFwiPG5vZGUgc2VydmVyPlwiLFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBsaWNhdGlvblxuXG5mdW5jdGlvbiBjb21wb3NlKHN0YWNrOiBTdGFjaywgY29udGV4dDogQ29udGV4dCk6IE5leHQge1xuICBjb25zdCBpdGVyYXRvciA9IHN0YWNrLnZhbHVlcygpXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgY29uc3QgaGFuZGxlciA9IGl0ZXJhdG9yLm5leHQoKS52YWx1ZVxuXG4gICAgLyogQ2hlY2sgaWYgYSBoYW5kbGVyIGlzIHByZXNlbnQgYW5kIHZhbGlkLiAqL1xuICAgIGlmICghaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IE5vdEZvdW5kKFwiRW5kcG9pbnQgZG9lcyBub3QgZXhpc3RcIilcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IEludGVybmFsU2VydmVyRXJyb3IoXCJCYWQgaGFuZGxlclwiKVxuICAgIH1cblxuICAgIC8vIEVTNzogcmV0dXJuIGNvbnRleHQ6OmhhbmRsZXIobmV4dClcbiAgICByZXR1cm4gaGFuZGxlci5jYWxsKGNvbnRleHQsIG5leHQpXG4gIH1cbn1cbiJdfQ==