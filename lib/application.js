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

    for (const request of this.requests) {
      request.cancelled = true;
    }

    const stopped = new Promise(resolve => {
      this.server.close(err => {
        if (err) {
          this.logger.error(err);
        }

        this.logger.notice(`gracefully stopped ${this.description}`);
        resolve(this);
      });
    });

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
          _this2.requests.add(req);
          yield handler();
        } finally {
          _this2.requests.delete(req);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJzb2NrZXRzIiwiU2V0IiwicmVxdWVzdHMiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInNodXRkb3duIiwicm91dGUiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJzdG9wIiwiZXhpdCIsImVyciIsImNyaXRpY2FsIiwid2FybmluZyIsInNvY2tldCIsImlkbGUiLCJkZWxldGUiLCJhZGQiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJjbG9zaW5nIiwicmVtb3ZlSGVhZGVyIiwic2V0SGVhZGVyIiwiZGVidWciLCJyZW1vdGVBZGRyZXNzIiwicmVtb3RlUG9ydCIsImVuZCIsImRpc3BhdGNoIiwiYmluZCIsInN0YXJ0ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9uY2UiLCJub3RpY2UiLCJsaXN0ZW4iLCJjYW5jZWxsZWQiLCJzdG9wcGVkIiwiY2xvc2UiLCJlcnJvciIsInJlcSIsInJlcyIsInNsaWNlIiwiY29udGV4dCIsImhhbmRsZXIiLCJjb21wb3NlIiwiY2FsbCIsImNhdGNoIiwiaW5zcGVjdCIsIml0ZXJhdG9yIiwidmFsdWVzIiwibmV4dCIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztJQUFZQSxVOztBQUtaOzs7Ozs7Ozs7O0FBcUJBLE1BQU1DLGNBQWUsR0FBRSxrQkFBUUMs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QUFsQjtBQUNBLGdCQUFNSSxTQUFOO0FBQ0QsU0FIRCxTQUdVO0FBQ1IsaUJBQUtoRCxRQUFMLENBQWNxQixNQUFkLENBQXFCdUIsR0FBckI7QUFDRDtBQUNGLE9BUEs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFBTjs7QUFTQVQsWUFBUUMsT0FBUixDQUFnQmMsTUFBaEIsRUFBd0JDLEtBQXhCLENBQThCbkMsT0FBTztBQUNuQ2hDLGNBQVFVLFFBQVIsQ0FBaUIsTUFBTTtBQUFDLGNBQU1zQixHQUFOO0FBQVUsT0FBbEM7QUFDRCxLQUZEO0FBR0Q7O0FBRURvQyxZQUFVO0FBQ1IsV0FBTztBQUNMbEQsY0FBUSxLQUFLQSxNQURSO0FBRUxJLGFBQU8sS0FBS0EsS0FGUDtBQUdMVixjQUFRO0FBSEgsS0FBUDtBQUtEO0FBOUtzQixDO2tCQWlMVlIsVzs7O0FBRWYsU0FBUzZELE9BQVQsQ0FBaUIzQyxLQUFqQixFQUErQnlDLE9BQS9CLEVBQXVEO0FBQ3JELFFBQU1NLFdBQVcvQyxNQUFNZ0QsTUFBTixFQUFqQjs7QUFFQSxTQUFPLFNBQVNDLElBQVQsR0FBZ0I7QUFDckIsVUFBTVAsVUFBVUssU0FBU0UsSUFBVCxHQUFnQkMsS0FBaEM7O0FBRUE7QUFDQSxRQUFJLENBQUNSLE9BQUwsRUFBYztBQUNaLFlBQU0scUJBQWEseUJBQWIsQ0FBTjtBQUNEOztBQUVELFFBQUksT0FBT0EsT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNqQyxZQUFNLGdDQUF3QixhQUF4QixDQUFOO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFPQSxRQUFRRSxJQUFSLENBQWFILE9BQWIsRUFBc0JRLElBQXRCLENBQVA7QUFDRCxHQWREO0FBZUQiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IFwiLi91dGlsL3BvbHlmaWxsXCJcblxuaW1wb3J0IGh0dHAgZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgaG9zdFBrZyBmcm9tIFwiLi91dGlsL2hvc3QtcGtnXCJcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi91dGlsL2xvZ2dlclwiXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuL3JvdXRlclwiXG5pbXBvcnQgQ29udGV4dCBmcm9tIFwiLi9jb250ZXh0XCJcblxuaW1wb3J0IHtOb3RGb3VuZCwgSW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4vZXJyb3JzXCJcbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtOZXh0LCBTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gXCIuL2NvbnRleHRcIlxuXG5pbXBvcnQgc2xlZXAgZnJvbSBcIi4vdXRpbC9zbGVlcFwiXG5cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uT3B0aW9ucyA9IHt8XG4gIHBvcnQ/OiBudW1iZXIsXG4gIGxvZ2dlcj86IExvZ2dlcixcbiAgcm91dGVyPzogUm91dGVyLFxuICB0ZXJtaW5hdGlvbkdyYWNlPzogbnVtYmVyLFxufH1cblxudHlwZSBJZGxpbmdTb2NrZXQgPSBuZXQkU29ja2V0ICYge1xuICBpZGxlPzogYm9vbGVhbixcbn1cblxudHlwZSBDYW5jZWxsaW5nUmVxdWVzdCA9IFJlcXVlc3QgJiB7XG4gIGNhbmNlbGxlZD86IGJvb2xlYW4sXG59XG5cbnR5cGUgQ2xvc2luZ1NlcnZlciA9IGh0dHAuU2VydmVyICYge1xuICBjbG9zaW5nPzogYm9vbGVhbixcbn1cblxuY29uc3QgZGVzY3JpcHRpb24gPSBgJHtob3N0UGtnLm5hbWV9IHNlcnZpY2UgJHtwcm9jZXNzLmVudi5IT1NUTkFNRSB8fCBcIlwifWAudHJpbSgpXG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIHBvcnQ6IG51bWJlclxuICByb3V0ZXI6IFJvdXRlclxuICBsb2dnZXI6IExvZ2dlclxuICBzdGFjazogU3RhY2tcblxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gZGVzY3JpcHRpb25cbiAgc2VydmVyOiBDbG9zaW5nU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKVxuICBzb2NrZXRzOiBTZXQ8SWRsaW5nU29ja2V0PiA9IG5ldyBTZXRcbiAgcmVxdWVzdHM6IFNldDxDYW5jZWxsaW5nUmVxdWVzdD4gPSBuZXcgU2V0XG5cbiAgLyogU3RhcnQgYSBuZXcgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucyBpbiBuZXh0IHRpY2suICovXG4gIHN0YXRpYyBzdGFydChvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSBPYmplY3Quc2VhbCh7fSkpIHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24ob3B0aW9ucylcbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHthcHAuc3RhcnQoKX0pXG4gICAgcmV0dXJuIGFwcFxuICB9XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3Qge1xuICAgICAgcG9ydCA9IDMwMDAsXG4gICAgICByb3V0ZXIgPSBuZXcgUm91dGVyLFxuICAgICAgbG9nZ2VyID0gbmV3IExvZ2dlcixcbiAgICAgIHRlcm1pbmF0aW9uR3JhY2UgPSAyNSxcbiAgICB9ID0gb3B0aW9uc1xuXG4gICAgLyogQXNzaWduIGRlZmF1bHQgZW52LiAqL1xuICAgIGlmICghcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID0gXCJkZXZlbG9wbWVudFwiXG4gICAgfVxuXG4gICAgdGhpcy5wb3J0ID0gcG9ydFxuICAgIHRoaXMucm91dGVyID0gcm91dGVyXG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXJcblxuICAgIC8qIEJhcmUgbWluaW11bSBzdGFjayB0byBkbyBhbnl0aGluZyB1c2VmdWwuICovXG4gICAgdGhpcy5zdGFjayA9IFtcbiAgICAgIG1pZGRsZXdhcmUubG9nKGxvZ2dlciksXG4gICAgICBtaWRkbGV3YXJlLndyaXRlKCksXG4gICAgICBtaWRkbGV3YXJlLnNodXRkb3duKHRlcm1pbmF0aW9uR3JhY2UpLFxuICAgICAgbWlkZGxld2FyZS5yb3V0ZShyb3V0ZXIpLFxuICAgIF1cblxuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIHN0YXJ0KCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLnNlcnZlci50aW1lb3V0ID0gMFxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR1RFUk1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHSU5UXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMClcbiAgICB9KVxuXG4gICAgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGFzeW5jIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICB0aGlzLmxvZ2dlci5jcml0aWNhbChgdW5jYXVnaHQgJHtlcnIuc3RhY2t9YClcblxuICAgICAgLyogRG9uJ3Qgd2FpdCBmb3Igc2VydmVyIHRvIHF1aXRlIGdyYWNlZnVsbHksIGJ1dCBxdWl0IGFmdGVyIHNob3J0IGRlbGF5LlxuICAgICAgICAgVGhpcyBhdm9pZHMgcHJvY2Vzc2VzIGhhbmdpbmcgZm9yIGEgbG9uZyB0aW1lIGJlY2F1c2UgYVxuICAgICAgICAgcmVxdWVzdCBmYWlsZWQgdG8gZmluaXNoLiBXZSBzYWNyaWZpY2UgYWxsIHJ1bm5pbmcgcmVxdWVzdHMgZm9yIGFcbiAgICAgICAgIG1vcmUgc3BlZWR5IHJlY292ZXJ5IGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIHJlc3RhcnQuICovXG4gICAgICB0aGlzLnN0b3AoKVxuXG4gICAgICBhd2FpdCBzbGVlcCg1MDApXG4gICAgICB0aGlzLmxvZ2dlci53YXJuaW5nKGBmb3JjZWZ1bGx5IHN0b3BwZWQgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgIH0pXG5cbiAgICB0aGlzLnNlcnZlci5vbihcImNvbm5lY3Rpb25cIiwgKHNvY2tldDogSWRsaW5nU29ja2V0KSA9PiB7XG4gICAgICBzb2NrZXQuaWRsZSA9IHRydWVcblxuICAgICAgc29ja2V0Lm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLnNvY2tldHMuZGVsZXRlKHNvY2tldClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc29ja2V0cy5hZGQoc29ja2V0KVxuICAgIH0pXG5cbiAgICB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgKHJlcXVlc3Q6IFJlcXVlc3QsIHJlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xuICAgICAgY29uc3Qgc29ja2V0OiBJZGxpbmdTb2NrZXQgPSByZXF1ZXN0LnNvY2tldFxuICAgICAgc29ja2V0LmlkbGUgPSBmYWxzZVxuXG4gICAgICBpZiAodGhpcy5zZXJ2ZXIuY2xvc2luZykge1xuICAgICAgICByZXNwb25zZS5yZW1vdmVIZWFkZXIoXCJDb25uZWN0aW9uXCIpXG4gICAgICAgIHJlc3BvbnNlLnNldEhlYWRlcihcIkNvbm5lY3Rpb25cIiwgXCJjbG9zZVwiKVxuICAgICAgfVxuXG4gICAgICByZXNwb25zZS5vbihcImZpbmlzaFwiLCAoKSA9PiB7XG4gICAgICAgIHNvY2tldC5pZGxlID0gdHJ1ZVxuXG4gICAgICAgIGlmICh0aGlzLnNlcnZlci5jbG9zaW5nKSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYGNsb3NpbmcgY29ubmVjdGlvbiAke3NvY2tldC5yZW1vdGVBZGRyZXNzIHx8IFwidW5rbm93blwifToke3NvY2tldC5yZW1vdGVQb3J0fWApXG4gICAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIEVTNzogdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIDo6dGhpcy5kaXNwYXRjaClcbiAgICB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgdGhpcy5kaXNwYXRjaC5iaW5kKHRoaXMpKVxuXG4gICAgY29uc3Qgc3RhcnRlZCA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXJ2ZXIub25jZShcImxpc3RlbmluZ1wiLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUodGhpcylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RhcnRpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICB0aGlzLnNlcnZlci5saXN0ZW4odGhpcy5wb3J0KVxuXG4gICAgcmV0dXJuIHN0YXJ0ZWRcbiAgfVxuXG4gIHN0b3AoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMuc2VydmVyLmNsb3NpbmcgPSB0cnVlXG5cbiAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYHN0b3BwaW5nICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgZm9yIChjb25zdCByZXF1ZXN0IG9mIHRoaXMucmVxdWVzdHMpIHtcbiAgICAgIHJlcXVlc3QuY2FuY2VsbGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIGNvbnN0IHN0b3BwZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLmNsb3NlKGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYGdyYWNlZnVsbHkgc3RvcHBlZCAke3RoaXMuZGVzY3JpcHRpb259YClcbiAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZm9yIChjb25zdCBzb2NrZXQgb2YgdGhpcy5zb2NrZXRzKSB7XG4gICAgICBpZiAoc29ja2V0LmlkbGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYGNsb3NpbmcgaWRsZSBjb25uZWN0aW9uICR7c29ja2V0LnJlbW90ZUFkZHJlc3MgfHwgXCJ1bmtub3duXCJ9OiR7c29ja2V0LnJlbW90ZVBvcnR9YClcbiAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3BwZWRcbiAgfVxuXG4gIGRpc3BhdGNoKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IHZvaWQge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5zdGFjay5zbGljZSgwKVxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQ29udGV4dCh0aGlzLCBzdGFjaywgcmVxLCByZXMpXG4gICAgY29uc3QgaGFuZGxlciA9IGNvbXBvc2Uoc3RhY2ssIGNvbnRleHQpXG5cbiAgICBjb25zdCBjYWxsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy5hZGQocmVxKVxuICAgICAgICBhd2FpdCBoYW5kbGVyKClcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMuZGVsZXRlKHJlcSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBQcm9taXNlLnJlc29sdmUoY2FsbCgpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7dGhyb3cgZXJyfSlcbiAgICB9KVxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm91dGVyOiB0aGlzLnJvdXRlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgc2VydmVyOiBcIjxub2RlIHNlcnZlcj5cIixcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb25cblxuZnVuY3Rpb24gY29tcG9zZShzdGFjazogU3RhY2ssIGNvbnRleHQ6IENvbnRleHQpOiBOZXh0IHtcbiAgY29uc3QgaXRlcmF0b3IgPSBzdGFjay52YWx1ZXMoKVxuXG4gIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgIGNvbnN0IGhhbmRsZXIgPSBpdGVyYXRvci5uZXh0KCkudmFsdWVcblxuICAgIC8qIENoZWNrIGlmIGEgaGFuZGxlciBpcyBwcmVzZW50IGFuZCB2YWxpZC4gKi9cbiAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgIHRocm93IG5ldyBOb3RGb3VuZChcIkVuZHBvaW50IGRvZXMgbm90IGV4aXN0XCIpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBJbnRlcm5hbFNlcnZlckVycm9yKFwiQmFkIGhhbmRsZXJcIilcbiAgICB9XG5cbiAgICAvLyBFUzc6IHJldHVybiBjb250ZXh0OjpoYW5kbGVyKG5leHQpXG4gICAgcmV0dXJuIGhhbmRsZXIuY2FsbChjb250ZXh0LCBuZXh0KVxuICB9XG59XG4iXX0=