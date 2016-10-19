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

var _memoryConsole = require("./util/memory-console");

var _memoryConsole2 = _interopRequireDefault(_memoryConsole);

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
/* eslint-disable no-console */


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
    this.port = 3000;
    this.description = description;
    this.server = _http2.default.createServer();
    this.sockets = new Set();
    this.requests = new Set();

    /* Override properties. */
    Object.assign(this, options);

    /* Assign default env. */
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = "development";
    }

    if (!this.router) {
      this.router = new _router2.default();
    }

    if (!this.logger) {
      const formatter = process.env.NODE_ENV === "development" ? _logger2.default.PRETTY : _logger2.default.JSON;
      const target = process.env.NODE_ENV === "test" ? new _memoryConsole2.default() : console;
      this.logger = new _logger2.default(target, formatter);
    }

    /* Bare minimum stack to do anything useful. */
    this.stack = [middleware.log(this.logger), middleware.write(), middleware.rescue(), middleware.route(this.router)];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiYXBwIiwibmV4dFRpY2siLCJjb25zdHJ1Y3RvciIsInBvcnQiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJzb2NrZXRzIiwiU2V0IiwicmVxdWVzdHMiLCJPYmplY3QiLCJhc3NpZ24iLCJOT0RFX0VOViIsInJvdXRlciIsImxvZ2dlciIsImZvcm1hdHRlciIsIlBSRVRUWSIsIkpTT04iLCJ0YXJnZXQiLCJjb25zb2xlIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInJvdXRlIiwiZnJlZXplIiwidGltZW91dCIsIm9uIiwic3RvcCIsImV4aXQiLCJlcnIiLCJjcml0aWNhbCIsInNvY2tldCIsImlkbGUiLCJkZWxldGUiLCJhZGQiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJjbG9zaW5nIiwicmVtb3ZlSGVhZGVyIiwic2V0SGVhZGVyIiwiZGVidWciLCJyZW1vdGVBZGRyZXNzIiwicmVtb3RlUG9ydCIsImVuZCIsImRpc3BhdGNoIiwiYmluZCIsInN0YXJ0ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9uY2UiLCJub3RpY2UiLCJsaXN0ZW4iLCJzdG9wcGVkIiwiY2FuY2VsbGVkIiwiY2xvc2UiLCJyZXEiLCJyZXMiLCJzbGljZSIsImNvbnRleHQiLCJoYW5kbGVyIiwiY29tcG9zZSIsImNhbGwiLCJjYXRjaCIsImluc3BlY3QiLCJpdGVyYXRvciIsInZhbHVlcyIsIm5leHQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUVBOzs7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztJQUFZQSxVOzs7Ozs7O0FBYlo7OztBQXFDQSxNQUFNQyxj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bGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCBcIi4vdXRpbC9wb2x5ZmlsbFwiXG5cbmltcG9ydCBodHRwIGZyb20gXCJodHRwXCJcblxuaW1wb3J0IGhvc3RQa2cgZnJvbSBcIi4vdXRpbC9ob3N0LXBrZ1wiXG5cbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vdXRpbC9sb2dnZXJcIlxuaW1wb3J0IE1lbW9yeUNvbnNvbGUgZnJvbSBcIi4vdXRpbC9tZW1vcnktY29uc29sZVwiXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuL3JvdXRlclwiXG5pbXBvcnQgQ29udGV4dCBmcm9tIFwiLi9jb250ZXh0XCJcblxuaW1wb3J0IHtOb3RGb3VuZCwgSW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4vZXJyb3JzXCJcbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtOZXh0LCBTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gXCIuL2NvbnRleHRcIlxuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7XG4gIHBvcnQ/OiBudW1iZXIsXG4gIHNlcnZlcj86IGh0dHAuU2VydmVyLFxuICBsb2dnZXI/OiBMb2dnZXIsXG4gIHJvdXRlcj86IFJvdXRlcixcbn1cblxudHlwZSBJZGxpbmdTb2NrZXQgPSBuZXQkU29ja2V0ICYge1xuICBpZGxlPzogYm9vbGVhbixcbn1cblxudHlwZSBDYW5jZWxsaW5nUmVxdWVzdCA9IFJlcXVlc3QgJiB7XG4gIGNhbmNlbGxlZD86IGJvb2xlYW4sXG59XG5cbnR5cGUgQ2xvc2luZ1NlcnZlciA9IGh0dHAuU2VydmVyICYge1xuICBjbG9zaW5nPzogYm9vbGVhbixcbn1cblxuY29uc3QgZGVzY3JpcHRpb24gPSBgJHtob3N0UGtnLm5hbWV9IHNlcnZpY2UgJHtwcm9jZXNzLmVudi5IT1NUTkFNRSB8fCBcIlwifWAudHJpbSgpXG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIHBvcnQ6IG51bWJlciA9IDMwMDBcblxuICByb3V0ZXI6IFJvdXRlclxuICBsb2dnZXI6IExvZ2dlclxuICBzdGFjazogU3RhY2tcblxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gZGVzY3JpcHRpb25cbiAgc2VydmVyOiBDbG9zaW5nU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKVxuICBzb2NrZXRzOiBTZXQ8SWRsaW5nU29ja2V0PiA9IG5ldyBTZXRcbiAgcmVxdWVzdHM6IFNldDxDYW5jZWxsaW5nUmVxdWVzdD4gPSBuZXcgU2V0XG5cbiAgLyogU3RhcnQgYSBuZXcgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihvcHRpb25zKVxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge2FwcC5zdGFydCgpfSlcbiAgICByZXR1cm4gYXBwXG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIC8qIE92ZXJyaWRlIHByb3BlcnRpZXMuICovXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKVxuXG4gICAgLyogQXNzaWduIGRlZmF1bHQgZW52LiAqL1xuICAgIGlmICghcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJkZXZlbG9wbWVudFwiXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnJvdXRlcikge1xuICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgUm91dGVyXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxvZ2dlcikge1xuICAgICAgY29uc3QgZm9ybWF0dGVyID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIiA/IExvZ2dlci5QUkVUVFkgOiBMb2dnZXIuSlNPTlxuICAgICAgY29uc3QgdGFyZ2V0ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiID8gbmV3IE1lbW9yeUNvbnNvbGUgOiBjb25zb2xlXG4gICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIodGFyZ2V0LCBmb3JtYXR0ZXIpXG4gICAgfVxuXG4gICAgLyogQmFyZSBtaW5pbXVtIHN0YWNrIHRvIGRvIGFueXRoaW5nIHVzZWZ1bC4gKi9cbiAgICB0aGlzLnN0YWNrID0gW1xuICAgICAgbWlkZGxld2FyZS5sb2codGhpcy5sb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSgpLFxuICAgICAgbWlkZGxld2FyZS5yZXNjdWUoKSxcbiAgICAgIG1pZGRsZXdhcmUucm91dGUodGhpcy5yb3V0ZXIpLFxuICAgIF1cblxuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIHN0YXJ0KCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLnNlcnZlci50aW1lb3V0ID0gMFxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR1RFUk1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHSU5UXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMClcbiAgICB9KVxuXG4gICAgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGFzeW5jIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICB0aGlzLmxvZ2dlci5jcml0aWNhbChgdW5jYXVnaHQgJHtlcnIuc3RhY2t9YClcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICB9KVxuXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJjb25uZWN0aW9uXCIsIChzb2NrZXQ6IElkbGluZ1NvY2tldCkgPT4ge1xuICAgICAgc29ja2V0LmlkbGUgPSB0cnVlXG5cbiAgICAgIHNvY2tldC5vbihcImNsb3NlXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5zb2NrZXRzLmRlbGV0ZShzb2NrZXQpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnNvY2tldHMuYWRkKHNvY2tldClcbiAgICB9KVxuXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIChyZXF1ZXN0OiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnN0IHNvY2tldDogSWRsaW5nU29ja2V0ID0gcmVxdWVzdC5zb2NrZXRcbiAgICAgIHNvY2tldC5pZGxlID0gZmFsc2VcblxuICAgICAgaWYgKHRoaXMuc2VydmVyLmNsb3NpbmcpIHtcbiAgICAgICAgcmVzcG9uc2UucmVtb3ZlSGVhZGVyKFwiQ29ubmVjdGlvblwiKVxuICAgICAgICByZXNwb25zZS5zZXRIZWFkZXIoXCJDb25uZWN0aW9uXCIsIFwiY2xvc2VcIilcbiAgICAgIH1cblxuICAgICAgcmVzcG9uc2Uub24oXCJmaW5pc2hcIiwgKCkgPT4ge1xuICAgICAgICBzb2NrZXQuaWRsZSA9IHRydWVcblxuICAgICAgICBpZiAodGhpcy5zZXJ2ZXIuY2xvc2luZykge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBjbG9zaW5nIGNvbm5lY3Rpb24gJHtzb2NrZXQucmVtb3RlQWRkcmVzcyB8fCBcInVua25vd25cIn06JHtzb2NrZXQucmVtb3RlUG9ydH1gKVxuICAgICAgICAgIHNvY2tldC5lbmQoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBFUzc6IHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCA6OnRoaXMuZGlzcGF0Y2gpXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIHRoaXMuZGlzcGF0Y2guYmluZCh0aGlzKSlcblxuICAgIGNvbnN0IHN0YXJ0ZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJsaXN0ZW5pbmdcIiwgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYHN0YXJ0aW5nICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgdGhpcy5zZXJ2ZXIubGlzdGVuKHRoaXMucG9ydClcblxuICAgIHJldHVybiBzdGFydGVkXG4gIH1cblxuICBzdG9wKCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLnNlcnZlci5jbG9zaW5nID0gdHJ1ZVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdG9wcGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIGNvbnN0IHN0b3BwZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLm5vdGljZShgZ3JhY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBmb3IgKGNvbnN0IHJlcXVlc3Qgb2YgdGhpcy5yZXF1ZXN0cykge1xuICAgICAgcmVxdWVzdC5jYW5jZWxsZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2UoKVxuXG4gICAgZm9yIChjb25zdCBzb2NrZXQgb2YgdGhpcy5zb2NrZXRzKSB7XG4gICAgICBpZiAoc29ja2V0LmlkbGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYGNsb3NpbmcgaWRsZSBjb25uZWN0aW9uICR7c29ja2V0LnJlbW90ZUFkZHJlc3MgfHwgXCJ1bmtub3duXCJ9OiR7c29ja2V0LnJlbW90ZVBvcnR9YClcbiAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3BwZWRcbiAgfVxuXG4gIGRpc3BhdGNoKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IHZvaWQge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5zdGFjay5zbGljZSgwKVxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLCBzdGFjaywgcmVxLCByZXMpXG4gICAgY29uc3QgaGFuZGxlciA9IGNvbXBvc2Uoc3RhY2ssIGNvbnRleHQpXG5cbiAgICBjb25zdCBjYWxsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy5hZGQoY29udGV4dC5yZXEpXG4gICAgICAgIGF3YWl0IGhhbmRsZXIoKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy5kZWxldGUoY29udGV4dC5yZXEpXG4gICAgICB9XG4gICAgfVxuXG4gICAgUHJvbWlzZS5yZXNvbHZlKGNhbGwoKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge3Rocm93IGVycn0pXG4gICAgfSlcbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdXRlcjogdGhpcy5yb3V0ZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIHNlcnZlcjogXCI8bm9kZSBzZXJ2ZXI+XCIsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIGNvbXBvc2Uoc3RhY2s6IFN0YWNrLCBjb250ZXh0OiBDb250ZXh0KTogTmV4dCB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gc3RhY2sudmFsdWVzKClcblxuICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gaXRlcmF0b3IubmV4dCgpLnZhbHVlXG5cbiAgICAvKiBDaGVjayBpZiBhIGhhbmRsZXIgaXMgcHJlc2VudCBhbmQgdmFsaWQuICovXG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgTm90Rm91bmQoXCJFbmRwb2ludCBkb2VzIG5vdCBleGlzdFwiKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvcihcIkJhZCBoYW5kbGVyXCIpXG4gICAgfVxuXG4gICAgLy8gRVM3OiByZXR1cm4gY29udGV4dDo6aGFuZGxlcihuZXh0KVxuICAgIHJldHVybiBoYW5kbGVyLmNhbGwoY29udGV4dCwgbmV4dClcbiAgfVxufVxuIl19