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
    this.stack = [middleware.log(logger), middleware.write({ terminationGrace }), middleware.route(router)];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJzb2NrZXRzIiwiU2V0IiwicmVxdWVzdHMiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJvdXRlIiwiZnJlZXplIiwidGltZW91dCIsIm9uIiwic3RvcCIsImV4aXQiLCJlcnIiLCJjcml0aWNhbCIsInNvY2tldCIsImlkbGUiLCJkZWxldGUiLCJhZGQiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJjbG9zaW5nIiwicmVtb3ZlSGVhZGVyIiwic2V0SGVhZGVyIiwiZGVidWciLCJyZW1vdGVBZGRyZXNzIiwicmVtb3RlUG9ydCIsImVuZCIsImRpc3BhdGNoIiwiYmluZCIsInN0YXJ0ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9uY2UiLCJub3RpY2UiLCJsaXN0ZW4iLCJzdG9wcGVkIiwiY2FuY2VsbGVkIiwiY2xvc2UiLCJyZXEiLCJyZXMiLCJzbGljZSIsImNvbnRleHQiLCJoYW5kbGVyIiwiY29tcG9zZSIsImNhbGwiLCJjYXRjaCIsImluc3BlY3QiLCJpdGVyYXRvciIsInZhbHVlcyIsIm5leHQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7SUFBWUEsVTs7Ozs7Ozs7QUF3QlosTUFBTUMsY0FBZSxHQUFFLGtCQUFRQyxJQUFLLFlBQVdDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixJQUF3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RUFBd0JDLEtBQXhCLENBQThCakMsT0FBTztBQUNuQy9CLGNBQVFVLFFBQVIsQ0FBaUIsTUFBTTtBQUFDLGNBQU1xQixHQUFOO0FBQVUsT0FBbEM7QUFDRCxLQUZEO0FBR0Q7O0FBRURrQyxZQUFVO0FBQ1IsV0FBTztBQUNML0MsY0FBUSxLQUFLQSxNQURSO0FBRUxJLGFBQU8sS0FBS0EsS0FGUDtBQUdMVixjQUFRO0FBSEgsS0FBUDtBQUtEO0FBbEtzQixDO2tCQXFLVlIsVzs7O0FBRWYsU0FBUzBELE9BQVQsQ0FBaUJ4QyxLQUFqQixFQUErQnNDLE9BQS9CLEVBQXVEO0FBQ3JELFFBQU1NLFdBQVc1QyxNQUFNNkMsTUFBTixFQUFqQjs7QUFFQSxTQUFPLFNBQVNDLElBQVQsR0FBZ0I7QUFDckIsVUFBTVAsVUFBVUssU0FBU0UsSUFBVCxHQUFnQkMsS0FBaEM7O0FBRUE7QUFDQSxRQUFJLENBQUNSLE9BQUwsRUFBYztBQUNaLFlBQU0scUJBQWEseUJBQWIsQ0FBTjtBQUNEOztBQUVELFFBQUksT0FBT0EsT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNqQyxZQUFNLGdDQUF3QixhQUF4QixDQUFOO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFPQSxRQUFRRSxJQUFSLENBQWFILE9BQWIsRUFBc0JRLElBQXRCLENBQVA7QUFDRCxHQWREO0FBZUQiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IFwiLi91dGlsL3BvbHlmaWxsXCJcblxuaW1wb3J0IGh0dHAgZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgaG9zdFBrZyBmcm9tIFwiLi91dGlsL2hvc3QtcGtnXCJcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi91dGlsL2xvZ2dlclwiXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuL3JvdXRlclwiXG5pbXBvcnQgQ29udGV4dCBmcm9tIFwiLi9jb250ZXh0XCJcblxuaW1wb3J0IHtOb3RGb3VuZCwgSW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4vZXJyb3JzXCJcbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtOZXh0LCBTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gXCIuL2NvbnRleHRcIlxuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fFxuICBwb3J0PzogbnVtYmVyLFxuICBsb2dnZXI/OiBMb2dnZXIsXG4gIHJvdXRlcj86IFJvdXRlcixcbiAgdGVybWluYXRpb25HcmFjZT86IG51bWJlcixcbnx9XG5cbnR5cGUgSWRsaW5nU29ja2V0ID0gbmV0JFNvY2tldCAmIHtcbiAgaWRsZT86IGJvb2xlYW4sXG59XG5cbnR5cGUgQ2FuY2VsbGluZ1JlcXVlc3QgPSBSZXF1ZXN0ICYge1xuICBjYW5jZWxsZWQ/OiBib29sZWFuLFxufVxuXG50eXBlIENsb3NpbmdTZXJ2ZXIgPSBodHRwLlNlcnZlciAmIHtcbiAgY2xvc2luZz86IGJvb2xlYW4sXG59XG5cbmNvbnN0IGRlc2NyaXB0aW9uID0gYCR7aG9zdFBrZy5uYW1lfSBzZXJ2aWNlICR7cHJvY2Vzcy5lbnYuSE9TVE5BTUUgfHwgXCJcIn1gLnRyaW0oKVxuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuICBwb3J0OiBudW1iZXJcbiAgcm91dGVyOiBSb3V0ZXJcbiAgbG9nZ2VyOiBMb2dnZXJcbiAgc3RhY2s6IFN0YWNrXG5cbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IGRlc2NyaXB0aW9uXG4gIHNlcnZlcjogQ2xvc2luZ1NlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKClcbiAgc29ja2V0czogU2V0PElkbGluZ1NvY2tldD4gPSBuZXcgU2V0XG4gIHJlcXVlc3RzOiBTZXQ8Q2FuY2VsbGluZ1JlcXVlc3Q+ID0gbmV3IFNldFxuXG4gIC8qIFN0YXJ0IGEgbmV3IGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgaW4gbmV4dCB0aWNrLiAqL1xuICBzdGF0aWMgc3RhcnQob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKG9wdGlvbnMpXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7YXBwLnN0YXJ0KCl9KVxuICAgIHJldHVybiBhcHBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IE9iamVjdC5zZWFsKHt9KSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvcnQgPSAzMDAwLFxuICAgICAgcm91dGVyID0gbmV3IFJvdXRlcixcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgICB0ZXJtaW5hdGlvbkdyYWNlID0gMjUsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cblxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICAvKiBCYXJlIG1pbmltdW0gc3RhY2sgdG8gZG8gYW55dGhpbmcgdXNlZnVsLiAqL1xuICAgIHRoaXMuc3RhY2sgPSBbXG4gICAgICBtaWRkbGV3YXJlLmxvZyhsb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSh7dGVybWluYXRpb25HcmFjZX0pLFxuICAgICAgbWlkZGxld2FyZS5yb3V0ZShyb3V0ZXIpLFxuICAgIF1cblxuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIHN0YXJ0KCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLnNlcnZlci50aW1lb3V0ID0gMFxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR1RFUk1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHSU5UXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMClcbiAgICB9KVxuXG4gICAgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGFzeW5jIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICB0aGlzLmxvZ2dlci5jcml0aWNhbChgdW5jYXVnaHQgJHtlcnIuc3RhY2t9YClcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICB9KVxuXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJjb25uZWN0aW9uXCIsIChzb2NrZXQ6IElkbGluZ1NvY2tldCkgPT4ge1xuICAgICAgc29ja2V0LmlkbGUgPSB0cnVlXG5cbiAgICAgIHNvY2tldC5vbihcImNsb3NlXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5zb2NrZXRzLmRlbGV0ZShzb2NrZXQpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnNvY2tldHMuYWRkKHNvY2tldClcbiAgICB9KVxuXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIChyZXF1ZXN0OiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnN0IHNvY2tldDogSWRsaW5nU29ja2V0ID0gcmVxdWVzdC5zb2NrZXRcbiAgICAgIHNvY2tldC5pZGxlID0gZmFsc2VcblxuICAgICAgaWYgKHRoaXMuc2VydmVyLmNsb3NpbmcpIHtcbiAgICAgICAgcmVzcG9uc2UucmVtb3ZlSGVhZGVyKFwiQ29ubmVjdGlvblwiKVxuICAgICAgICByZXNwb25zZS5zZXRIZWFkZXIoXCJDb25uZWN0aW9uXCIsIFwiY2xvc2VcIilcbiAgICAgIH1cblxuICAgICAgcmVzcG9uc2Uub24oXCJmaW5pc2hcIiwgKCkgPT4ge1xuICAgICAgICBzb2NrZXQuaWRsZSA9IHRydWVcblxuICAgICAgICBpZiAodGhpcy5zZXJ2ZXIuY2xvc2luZykge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBjbG9zaW5nIGNvbm5lY3Rpb24gJHtzb2NrZXQucmVtb3RlQWRkcmVzcyB8fCBcInVua25vd25cIn06JHtzb2NrZXQucmVtb3RlUG9ydH1gKVxuICAgICAgICAgIHNvY2tldC5lbmQoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBFUzc6IHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCA6OnRoaXMuZGlzcGF0Y2gpXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIHRoaXMuZGlzcGF0Y2guYmluZCh0aGlzKSlcblxuICAgIGNvbnN0IHN0YXJ0ZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJsaXN0ZW5pbmdcIiwgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYHN0YXJ0aW5nICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgdGhpcy5zZXJ2ZXIubGlzdGVuKHRoaXMucG9ydClcblxuICAgIHJldHVybiBzdGFydGVkXG4gIH1cblxuICBzdG9wKCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLnNlcnZlci5jbG9zaW5nID0gdHJ1ZVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdG9wcGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIGNvbnN0IHN0b3BwZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLm5vdGljZShgZ3JhY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBmb3IgKGNvbnN0IHJlcXVlc3Qgb2YgdGhpcy5yZXF1ZXN0cykge1xuICAgICAgcmVxdWVzdC5jYW5jZWxsZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2UoKVxuXG4gICAgZm9yIChjb25zdCBzb2NrZXQgb2YgdGhpcy5zb2NrZXRzKSB7XG4gICAgICBpZiAoc29ja2V0LmlkbGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYGNsb3NpbmcgaWRsZSBjb25uZWN0aW9uICR7c29ja2V0LnJlbW90ZUFkZHJlc3MgfHwgXCJ1bmtub3duXCJ9OiR7c29ja2V0LnJlbW90ZVBvcnR9YClcbiAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3BwZWRcbiAgfVxuXG4gIGRpc3BhdGNoKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IHZvaWQge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5zdGFjay5zbGljZSgwKVxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLCBzdGFjaywgcmVxLCByZXMpXG4gICAgY29uc3QgaGFuZGxlciA9IGNvbXBvc2Uoc3RhY2ssIGNvbnRleHQpXG5cbiAgICBjb25zdCBjYWxsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy5hZGQoY29udGV4dC5yZXEpXG4gICAgICAgIGF3YWl0IGhhbmRsZXIoKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy5kZWxldGUoY29udGV4dC5yZXEpXG4gICAgICB9XG4gICAgfVxuXG4gICAgUHJvbWlzZS5yZXNvbHZlKGNhbGwoKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge3Rocm93IGVycn0pXG4gICAgfSlcbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdXRlcjogdGhpcy5yb3V0ZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIHNlcnZlcjogXCI8bm9kZSBzZXJ2ZXI+XCIsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIGNvbXBvc2Uoc3RhY2s6IFN0YWNrLCBjb250ZXh0OiBDb250ZXh0KTogTmV4dCB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gc3RhY2sudmFsdWVzKClcblxuICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gaXRlcmF0b3IubmV4dCgpLnZhbHVlXG5cbiAgICAvKiBDaGVjayBpZiBhIGhhbmRsZXIgaXMgcHJlc2VudCBhbmQgdmFsaWQuICovXG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgTm90Rm91bmQoXCJFbmRwb2ludCBkb2VzIG5vdCBleGlzdFwiKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvcihcIkJhZCBoYW5kbGVyXCIpXG4gICAgfVxuXG4gICAgLy8gRVM3OiByZXR1cm4gY29udGV4dDo6aGFuZGxlcihuZXh0KVxuICAgIHJldHVybiBoYW5kbGVyLmNhbGwoY29udGV4dCwgbmV4dClcbiAgfVxufVxuIl19