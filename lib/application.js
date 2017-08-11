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
/* eslint-disable no-console */


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
    this.stack = [middleware.log(logger), middleware.write(), middleware.rescue({ terminationGrace }), middleware.route(router)];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJzb2NrZXRzIiwiU2V0IiwicmVxdWVzdHMiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInJvdXRlIiwiZnJlZXplIiwidGltZW91dCIsIm9uIiwic3RvcCIsImV4aXQiLCJlcnIiLCJjcml0aWNhbCIsInNvY2tldCIsImlkbGUiLCJkZWxldGUiLCJhZGQiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJjbG9zaW5nIiwicmVtb3ZlSGVhZGVyIiwic2V0SGVhZGVyIiwiZGVidWciLCJyZW1vdGVBZGRyZXNzIiwicmVtb3RlUG9ydCIsImVuZCIsImRpc3BhdGNoIiwiYmluZCIsInN0YXJ0ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9uY2UiLCJub3RpY2UiLCJsaXN0ZW4iLCJzdG9wcGVkIiwiY2FuY2VsbGVkIiwiY2xvc2UiLCJyZXEiLCJyZXMiLCJzbGljZSIsImNvbnRleHQiLCJoYW5kbGVyIiwiY29tcG9zZSIsImNhbGwiLCJjYXRjaCIsImluc3BlY3QiLCJpdGVyYXRvciIsInZhbHVlcyIsIm5leHQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUVBOzs7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7SUFBWUEsVTs7Ozs7OztBQVpaOzs7QUFvQ0EsTUFBTUMsY0FBZSxHQUFFLGtCQUFRQyxJQUFLLFlBQVdDLFFBQVFDLEdBQVIs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QUFBQSxRQUFOOztBQVNBUixZQUFRQyxPQUFSLENBQWdCYSxNQUFoQixFQUF3QkMsS0FBeEIsQ0FBOEJqQyxPQUFPO0FBQ25DaEMsY0FBUVUsUUFBUixDQUFpQixNQUFNO0FBQUMsY0FBTXNCLEdBQU47QUFBVSxPQUFsQztBQUNELEtBRkQ7QUFHRDs7QUFFRGtDLFlBQVU7QUFDUixXQUFPO0FBQ0xoRCxjQUFRLEtBQUtBLE1BRFI7QUFFTEksYUFBTyxLQUFLQSxLQUZQO0FBR0xWLGNBQVE7QUFISCxLQUFQO0FBS0Q7QUFuS3NCLEM7a0JBc0tWUixXOzs7QUFFZixTQUFTMkQsT0FBVCxDQUFpQnpDLEtBQWpCLEVBQStCdUMsT0FBL0IsRUFBdUQ7QUFDckQsUUFBTU0sV0FBVzdDLE1BQU04QyxNQUFOLEVBQWpCOztBQUVBLFNBQU8sU0FBU0MsSUFBVCxHQUFnQjtBQUNyQixVQUFNUCxVQUFVSyxTQUFTRSxJQUFULEdBQWdCQyxLQUFoQzs7QUFFQTtBQUNBLFFBQUksQ0FBQ1IsT0FBTCxFQUFjO0FBQ1osWUFBTSxxQkFBYSx5QkFBYixDQUFOO0FBQ0Q7O0FBRUQsUUFBSSxPQUFPQSxPQUFQLEtBQW1CLFVBQXZCLEVBQW1DO0FBQ2pDLFlBQU0sZ0NBQXdCLGFBQXhCLENBQU47QUFDRDs7QUFFRDtBQUNBLFdBQU9BLFFBQVFFLElBQVIsQ0FBYUgsT0FBYixFQUFzQlEsSUFBdEIsQ0FBUDtBQUNELEdBZEQ7QUFlRCIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgXCIuL3V0aWwvcG9seWZpbGxcIlxuXG5pbXBvcnQgaHR0cCBmcm9tIFwiaHR0cFwiXG5cbmltcG9ydCBob3N0UGtnIGZyb20gXCIuL3V0aWwvaG9zdC1wa2dcIlxuXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL3V0aWwvbG9nZ2VyXCJcbmltcG9ydCBSb3V0ZXIgZnJvbSBcIi4vcm91dGVyXCJcbmltcG9ydCBDb250ZXh0IGZyb20gXCIuL2NvbnRleHRcIlxuXG5pbXBvcnQge05vdEZvdW5kLCBJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi9lcnJvcnNcIlxuaW1wb3J0ICogYXMgbWlkZGxld2FyZSBmcm9tIFwiLi9taWRkbGV3YXJlXCJcblxuaW1wb3J0IHR5cGUge05leHQsIFN0YWNrfSBmcm9tIFwiLi9taWRkbGV3YXJlXCJcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSBcIi4vY29udGV4dFwiXG5cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uT3B0aW9ucyA9IHt8XG4gIHBvcnQ/OiBudW1iZXIsXG4gIGxvZ2dlcj86IExvZ2dlcixcbiAgcm91dGVyPzogUm91dGVyLFxuICB0ZXJtaW5hdGlvbkdyYWNlPzogbnVtYmVyLFxufH1cblxudHlwZSBJZGxpbmdTb2NrZXQgPSBuZXQkU29ja2V0ICYge1xuICBpZGxlPzogYm9vbGVhbixcbn1cblxudHlwZSBDYW5jZWxsaW5nUmVxdWVzdCA9IFJlcXVlc3QgJiB7XG4gIGNhbmNlbGxlZD86IGJvb2xlYW4sXG59XG5cbnR5cGUgQ2xvc2luZ1NlcnZlciA9IGh0dHAuU2VydmVyICYge1xuICBjbG9zaW5nPzogYm9vbGVhbixcbn1cblxuY29uc3QgZGVzY3JpcHRpb24gPSBgJHtob3N0UGtnLm5hbWV9IHNlcnZpY2UgJHtwcm9jZXNzLmVudi5IT1NUTkFNRSB8fCBcIlwifWAudHJpbSgpXG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIHBvcnQ6IG51bWJlclxuICByb3V0ZXI6IFJvdXRlclxuICBsb2dnZXI6IExvZ2dlclxuICBzdGFjazogU3RhY2tcblxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gZGVzY3JpcHRpb25cbiAgc2VydmVyOiBDbG9zaW5nU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKVxuICBzb2NrZXRzOiBTZXQ8SWRsaW5nU29ja2V0PiA9IG5ldyBTZXRcbiAgcmVxdWVzdHM6IFNldDxDYW5jZWxsaW5nUmVxdWVzdD4gPSBuZXcgU2V0XG5cbiAgLyogU3RhcnQgYSBuZXcgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSBPYmplY3Quc2VhbCh7fSkpIHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24ob3B0aW9ucylcbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHthcHAuc3RhcnQoKX0pXG4gICAgcmV0dXJuIGFwcFxuICB9XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3Qge1xuICAgICAgcG9ydCA9IDMwMDAsXG4gICAgICByb3V0ZXIgPSBuZXcgUm91dGVyLFxuICAgICAgbG9nZ2VyID0gbmV3IExvZ2dlcixcbiAgICAgIHRlcm1pbmF0aW9uR3JhY2UgPSAyNSxcbiAgICB9ID0gb3B0aW9uc1xuXG4gICAgLyogQXNzaWduIGRlZmF1bHQgZW52LiAqL1xuICAgIGlmICghcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJkZXZlbG9wbWVudFwiXG4gICAgfVxuXG4gICAgdGhpcy5wb3J0ID0gcG9ydFxuICAgIHRoaXMucm91dGVyID0gcm91dGVyXG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJcblxuICAgIC8qIEJhcmUgbWluaW11bSBzdGFjayB0byBkbyBhbnl0aGluZyB1c2VmdWwuICovXG4gICAgdGhpcy5zdGFjayA9IFtcbiAgICAgIG1pZGRsZXdhcmUubG9nKGxvZ2dlciksXG4gICAgICBtaWRkbGV3YXJlLndyaXRlKCksXG4gICAgICBtaWRkbGV3YXJlLnJlc2N1ZSh7dGVybWluYXRpb25HcmFjZX0pLFxuICAgICAgbWlkZGxld2FyZS5yb3V0ZShyb3V0ZXIpLFxuICAgIF1cblxuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIHN0YXJ0KCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLnNlcnZlci50aW1lb3V0ID0gMFxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR1RFUk1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHSU5UXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMClcbiAgICB9KVxuXG4gICAgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGFzeW5jIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICB0aGlzLmxvZ2dlci5jcml0aWNhbChgdW5jYXVnaHQgJHtlcnIuc3RhY2t9YClcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICB9KVxuXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJjb25uZWN0aW9uXCIsIChzb2NrZXQ6IElkbGluZ1NvY2tldCkgPT4ge1xuICAgICAgc29ja2V0LmlkbGUgPSB0cnVlXG5cbiAgICAgIHNvY2tldC5vbihcImNsb3NlXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5zb2NrZXRzLmRlbGV0ZShzb2NrZXQpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnNvY2tldHMuYWRkKHNvY2tldClcbiAgICB9KVxuXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIChyZXF1ZXN0OiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnN0IHNvY2tldDogSWRsaW5nU29ja2V0ID0gcmVxdWVzdC5zb2NrZXRcbiAgICAgIHNvY2tldC5pZGxlID0gZmFsc2VcblxuICAgICAgaWYgKHRoaXMuc2VydmVyLmNsb3NpbmcpIHtcbiAgICAgICAgcmVzcG9uc2UucmVtb3ZlSGVhZGVyKFwiQ29ubmVjdGlvblwiKVxuICAgICAgICByZXNwb25zZS5zZXRIZWFkZXIoXCJDb25uZWN0aW9uXCIsIFwiY2xvc2VcIilcbiAgICAgIH1cblxuICAgICAgcmVzcG9uc2Uub24oXCJmaW5pc2hcIiwgKCkgPT4ge1xuICAgICAgICBzb2NrZXQuaWRsZSA9IHRydWVcblxuICAgICAgICBpZiAodGhpcy5zZXJ2ZXIuY2xvc2luZykge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBjbG9zaW5nIGNvbm5lY3Rpb24gJHtzb2NrZXQucmVtb3RlQWRkcmVzcyB8fCBcInVua25vd25cIn06JHtzb2NrZXQucmVtb3RlUG9ydH1gKVxuICAgICAgICAgIHNvY2tldC5lbmQoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBFUzc6IHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCA6OnRoaXMuZGlzcGF0Y2gpXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIHRoaXMuZGlzcGF0Y2guYmluZCh0aGlzKSlcblxuICAgIGNvbnN0IHN0YXJ0ZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJsaXN0ZW5pbmdcIiwgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYHN0YXJ0aW5nICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgdGhpcy5zZXJ2ZXIubGlzdGVuKHRoaXMucG9ydClcblxuICAgIHJldHVybiBzdGFydGVkXG4gIH1cblxuICBzdG9wKCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLnNlcnZlci5jbG9zaW5nID0gdHJ1ZVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdG9wcGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIGNvbnN0IHN0b3BwZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLm5vdGljZShgZ3JhY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBmb3IgKGNvbnN0IHJlcXVlc3Qgb2YgdGhpcy5yZXF1ZXN0cykge1xuICAgICAgcmVxdWVzdC5jYW5jZWxsZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2UoKVxuXG4gICAgZm9yIChjb25zdCBzb2NrZXQgb2YgdGhpcy5zb2NrZXRzKSB7XG4gICAgICBpZiAoc29ja2V0LmlkbGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYGNsb3NpbmcgaWRsZSBjb25uZWN0aW9uICR7c29ja2V0LnJlbW90ZUFkZHJlc3MgfHwgXCJ1bmtub3duXCJ9OiR7c29ja2V0LnJlbW90ZVBvcnR9YClcbiAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3BwZWRcbiAgfVxuXG4gIGRpc3BhdGNoKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IHZvaWQge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5zdGFjay5zbGljZSgwKVxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLCBzdGFjaywgcmVxLCByZXMpXG4gICAgY29uc3QgaGFuZGxlciA9IGNvbXBvc2Uoc3RhY2ssIGNvbnRleHQpXG5cbiAgICBjb25zdCBjYWxsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy5hZGQoY29udGV4dC5yZXEpXG4gICAgICAgIGF3YWl0IGhhbmRsZXIoKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy5kZWxldGUoY29udGV4dC5yZXEpXG4gICAgICB9XG4gICAgfVxuXG4gICAgUHJvbWlzZS5yZXNvbHZlKGNhbGwoKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge3Rocm93IGVycn0pXG4gICAgfSlcbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdXRlcjogdGhpcy5yb3V0ZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIHNlcnZlcjogXCI8bm9kZSBzZXJ2ZXI+XCIsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIGNvbXBvc2Uoc3RhY2s6IFN0YWNrLCBjb250ZXh0OiBDb250ZXh0KTogTmV4dCB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gc3RhY2sudmFsdWVzKClcblxuICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gaXRlcmF0b3IubmV4dCgpLnZhbHVlXG5cbiAgICAvKiBDaGVjayBpZiBhIGhhbmRsZXIgaXMgcHJlc2VudCBhbmQgdmFsaWQuICovXG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgTm90Rm91bmQoXCJFbmRwb2ludCBkb2VzIG5vdCBleGlzdFwiKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvcihcIkJhZCBoYW5kbGVyXCIpXG4gICAgfVxuXG4gICAgLy8gRVM3OiByZXR1cm4gY29udGV4dDo6aGFuZGxlcihuZXh0KVxuICAgIHJldHVybiBoYW5kbGVyLmNhbGwoY29udGV4dCwgbmV4dClcbiAgfVxufVxuIl19