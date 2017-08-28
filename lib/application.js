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
    const stack = this.stack.slice(0);
    const context = new _context2.default(stack, req, res);
    const handler = compose(stack, context);

    this.requests.add(req);
    res.on("finish", () => {
      this.requests.delete(req);
    });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJzb2NrZXRzIiwiU2V0IiwicmVxdWVzdHMiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInNodXRkb3duIiwicm91dGUiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJzdG9wIiwiZXhpdCIsImVyciIsImNyaXRpY2FsIiwid2FybmluZyIsInNvY2tldCIsImlkbGUiLCJkZWxldGUiLCJhZGQiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJjbG9zaW5nIiwicmVtb3ZlSGVhZGVyIiwic2V0SGVhZGVyIiwiZGVidWciLCJyZW1vdGVBZGRyZXNzIiwicmVtb3RlUG9ydCIsImVuZCIsImRpc3BhdGNoIiwiYmluZCIsInN0YXJ0ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9uY2UiLCJub3RpY2UiLCJsaXN0ZW4iLCJjYW5jZWxsZWQiLCJzdG9wcGVkIiwiY2xvc2UiLCJlcnJvciIsInJlcSIsInJlcyIsInNsaWNlIiwiY29udGV4dCIsImhhbmRsZXIiLCJjb21wb3NlIiwiY2F0Y2giLCJpbnNwZWN0IiwiaXRlcmF0b3IiLCJ2YWx1ZXMiLCJuZXh0IiwidmFsdWUiLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztJQUFZQSxVOztBQUtaOzs7Ozs7Ozs7O0FBcUJBLE1BQU1DLGNBQWUsR0FB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Qjs7QUFFQSxTQUFLaEQsUUFBTCxDQUFjdUIsR0FBZCxDQUFrQnNCLEdBQWxCO0FBQ0FDLFFBQUloQyxFQUFKLENBQU8sUUFBUCxFQUFpQixNQUFNO0FBQ3JCLFdBQUtkLFFBQUwsQ0FBY3NCLE1BQWQsQ0FBcUJ1QixHQUFyQjtBQUNELEtBRkQ7O0FBSUFULFlBQVFDLE9BQVIsQ0FBZ0JZLFNBQWhCLEVBQTJCRSxLQUEzQixDQUFpQ2xDLE9BQU87QUFDdENqQyxjQUFRVSxRQUFSLENBQWlCLE1BQU07QUFBQyxjQUFNdUIsR0FBTjtBQUFVLE9BQWxDO0FBQ0QsS0FGRDtBQUdEOztBQUVEbUMsWUFBVTtBQUNSLFdBQU87QUFDTGxELGNBQVEsS0FBS0EsTUFEUjtBQUVMSSxhQUFPLEtBQUtBLEtBRlA7QUFHTFYsY0FBUTtBQUhILEtBQVA7QUFLRDtBQTdLc0IsQztrQkFnTFZSLFc7OztBQUVmLFNBQVM4RCxPQUFULENBQWlCNUMsS0FBakIsRUFBK0IwQyxPQUEvQixFQUF1RDtBQUNyRCxRQUFNSyxXQUFXL0MsTUFBTWdELE1BQU4sRUFBakI7O0FBRUEsU0FBTyxTQUFTQyxJQUFULEdBQWdCO0FBQ3JCLFVBQU1OLFVBQVVJLFNBQVNFLElBQVQsR0FBZ0JDLEtBQWhDOztBQUVBO0FBQ0EsUUFBSSxDQUFDUCxPQUFMLEVBQWM7QUFDWixZQUFNLHFCQUFhLHlCQUFiLENBQU47QUFDRDs7QUFFRCxRQUFJLE9BQU9BLE9BQVAsS0FBbUIsVUFBdkIsRUFBbUM7QUFDakMsWUFBTSxnQ0FBd0IsYUFBeEIsQ0FBTjtBQUNEOztBQUVEO0FBQ0EsV0FBT0EsUUFBUVEsSUFBUixDQUFhVCxPQUFiLEVBQXNCTyxJQUF0QixDQUFQO0FBQ0QsR0FkRDtBQWVEIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBcIi4vdXRpbC9wb2x5ZmlsbFwiXG5cbmltcG9ydCBodHRwIGZyb20gXCJodHRwXCJcblxuaW1wb3J0IGhvc3RQa2cgZnJvbSBcIi4vdXRpbC9ob3N0LXBrZ1wiXG5cbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vdXRpbC9sb2dnZXJcIlxuaW1wb3J0IFJvdXRlciBmcm9tIFwiLi9yb3V0ZXJcIlxuaW1wb3J0IENvbnRleHQgZnJvbSBcIi4vY29udGV4dFwiXG5cbmltcG9ydCB7Tm90Rm91bmQsIEludGVybmFsU2VydmVyRXJyb3J9IGZyb20gXCIuL2Vycm9yc1wiXG5pbXBvcnQgKiBhcyBtaWRkbGV3YXJlIGZyb20gXCIuL21pZGRsZXdhcmVcIlxuXG5pbXBvcnQgdHlwZSB7TmV4dCwgU3RhY2t9IGZyb20gXCIuL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tIFwiLi9jb250ZXh0XCJcblxuaW1wb3J0IHNsZWVwIGZyb20gXCIuL3V0aWwvc2xlZXBcIlxuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fFxuICBwb3J0PzogbnVtYmVyLFxuICBsb2dnZXI/OiBMb2dnZXIsXG4gIHJvdXRlcj86IFJvdXRlcixcbiAgdGVybWluYXRpb25HcmFjZT86IG51bWJlcixcbnx9XG5cbnR5cGUgSWRsaW5nU29ja2V0ID0gbmV0JFNvY2tldCAmIHtcbiAgaWRsZT86IGJvb2xlYW4sXG59XG5cbnR5cGUgQ2FuY2VsbGluZ1JlcXVlc3QgPSBSZXF1ZXN0ICYge1xuICBjYW5jZWxsZWQ/OiBib29sZWFuLFxufVxuXG50eXBlIENsb3NpbmdTZXJ2ZXIgPSBodHRwLlNlcnZlciAmIHtcbiAgY2xvc2luZz86IGJvb2xlYW4sXG59XG5cbmNvbnN0IGRlc2NyaXB0aW9uID0gYCR7aG9zdFBrZy5uYW1lfSBzZXJ2aWNlICR7cHJvY2Vzcy5lbnYuSE9TVE5BTUUgfHwgXCJcIn1gLnRyaW0oKVxuXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuICBwb3J0OiBudW1iZXJcbiAgcm91dGVyOiBSb3V0ZXJcbiAgbG9nZ2VyOiBMb2dnZXJcbiAgc3RhY2s6IFN0YWNrXG5cbiAgZGVzY3JpcHRpb246IHN0cmluZyA9IGRlc2NyaXB0aW9uXG4gIHNlcnZlcjogQ2xvc2luZ1NlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKClcbiAgc29ja2V0czogU2V0PElkbGluZ1NvY2tldD4gPSBuZXcgU2V0XG4gIHJlcXVlc3RzOiBTZXQ8Q2FuY2VsbGluZ1JlcXVlc3Q+ID0gbmV3IFNldFxuXG4gIC8qIFN0YXJ0IGEgbmV3IGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgaW4gbmV4dCB0aWNrLiAqL1xuICBzdGF0aWMgc3RhcnQob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKG9wdGlvbnMpXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7YXBwLnN0YXJ0KCl9KVxuICAgIHJldHVybiBhcHBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IE9iamVjdC5zZWFsKHt9KSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvcnQgPSAzMDAwLFxuICAgICAgcm91dGVyID0gbmV3IFJvdXRlcixcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgICB0ZXJtaW5hdGlvbkdyYWNlID0gMjUsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cblxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICAvKiBCYXJlIG1pbmltdW0gc3RhY2sgdG8gZG8gYW55dGhpbmcgdXNlZnVsLiAqL1xuICAgIHRoaXMuc3RhY2sgPSBbXG4gICAgICBtaWRkbGV3YXJlLmxvZyhsb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSgpLFxuICAgICAgbWlkZGxld2FyZS5yZXNjdWUoKSxcbiAgICAgIG1pZGRsZXdhcmUuc2h1dGRvd24odGVybWluYXRpb25HcmFjZSksXG4gICAgICBtaWRkbGV3YXJlLnJvdXRlKHJvdXRlciksXG4gICAgXVxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgc3RhcnQoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMuc2VydmVyLnRpbWVvdXQgPSAwXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHVEVSTVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDApXG4gICAgfSlcblxuICAgIHByb2Nlc3Mub24oXCJTSUdJTlRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgIH0pXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgICBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIiwgYXN5bmMgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuY2F1Z2h0ICR7ZXJyLnN0YWNrfWApXG5cbiAgICAgICAgLyogRG9uJ3Qgd2FpdCBmb3Igc2VydmVyIHRvIHF1aXRlIGdyYWNlZnVsbHksIGJ1dCBxdWl0IGFmdGVyIHNob3J0IGRlbGF5LlxuICAgICAgICAgICBUaGlzIGF2b2lkcyBwcm9jZXNzZXMgaGFuZ2luZyBmb3IgYSBsb25nIHRpbWUgYmVjYXVzZSBhXG4gICAgICAgICAgIHJlcXVlc3QgZmFpbGVkIHRvIGZpbmlzaC4gV2Ugc2FjcmlmaWNlIGFsbCBydW5uaW5nIHJlcXVlc3RzIGZvciBhXG4gICAgICAgICAgIG1vcmUgc3BlZWR5IHJlY292ZXJ5IGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIHJlc3RhcnQuICovXG4gICAgICAgIHRoaXMuc3RvcCgpXG5cbiAgICAgICAgYXdhaXQgc2xlZXAoNTAwKVxuICAgICAgICB0aGlzLmxvZ2dlci53YXJuaW5nKGBmb3JjZWZ1bGx5IHN0b3BwZWQgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2VydmVyLm9uKFwiY29ubmVjdGlvblwiLCAoc29ja2V0OiBJZGxpbmdTb2NrZXQpID0+IHtcbiAgICAgIHNvY2tldC5pZGxlID0gdHJ1ZVxuXG4gICAgICBzb2NrZXQub24oXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc29ja2V0cy5kZWxldGUoc29ja2V0KVxuICAgICAgfSlcblxuICAgICAgdGhpcy5zb2NrZXRzLmFkZChzb2NrZXQpXG4gICAgfSlcblxuICAgIHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCAocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBzb2NrZXQ6IElkbGluZ1NvY2tldCA9IHJlcXVlc3Quc29ja2V0XG4gICAgICBzb2NrZXQuaWRsZSA9IGZhbHNlXG5cbiAgICAgIGlmICh0aGlzLnNlcnZlci5jbG9zaW5nKSB7XG4gICAgICAgIHJlc3BvbnNlLnJlbW92ZUhlYWRlcihcIkNvbm5lY3Rpb25cIilcbiAgICAgICAgcmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ29ubmVjdGlvblwiLCBcImNsb3NlXCIpXG4gICAgICB9XG5cbiAgICAgIHJlc3BvbnNlLm9uKFwiZmluaXNoXCIsICgpID0+IHtcbiAgICAgICAgc29ja2V0LmlkbGUgPSB0cnVlXG5cbiAgICAgICAgaWYgKHRoaXMuc2VydmVyLmNsb3NpbmcpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgY2xvc2luZyBjb25uZWN0aW9uICR7c29ja2V0LnJlbW90ZUFkZHJlc3MgfHwgXCJ1bmtub3duXCJ9OiR7c29ja2V0LnJlbW90ZVBvcnR9YClcbiAgICAgICAgICBzb2NrZXQuZW5kKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gRVM3OiB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgOjp0aGlzLmRpc3BhdGNoKVxuICAgIHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCB0aGlzLmRpc3BhdGNoLmJpbmQodGhpcykpXG5cbiAgICBjb25zdCBzdGFydGVkID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwibGlzdGVuaW5nXCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdGFydGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQpXG5cbiAgICByZXR1cm4gc3RhcnRlZFxuICB9XG5cbiAgc3RvcCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2luZyA9IHRydWVcblxuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RvcHBpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICBmb3IgKGNvbnN0IHJlcXVlc3Qgb2YgdGhpcy5yZXF1ZXN0cykge1xuICAgICAgcmVxdWVzdC5jYW5jZWxsZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgY29uc3Qgc3RvcHBlZCA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXJ2ZXIuY2xvc2UoZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9nZ2VyLm5vdGljZShgZ3JhY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBmb3IgKGNvbnN0IHNvY2tldCBvZiB0aGlzLnNvY2tldHMpIHtcbiAgICAgIGlmIChzb2NrZXQuaWRsZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgY2xvc2luZyBpZGxlIGNvbm5lY3Rpb24gJHtzb2NrZXQucmVtb3RlQWRkcmVzcyB8fCBcInVua25vd25cIn06JHtzb2NrZXQucmVtb3RlUG9ydH1gKVxuICAgICAgICBzb2NrZXQuZW5kKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RvcHBlZFxuICB9XG5cbiAgZGlzcGF0Y2gocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhY2sgPSB0aGlzLnN0YWNrLnNsaWNlKDApXG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBDb250ZXh0KHN0YWNrLCByZXEsIHJlcylcbiAgICBjb25zdCBoYW5kbGVyID0gY29tcG9zZShzdGFjaywgY29udGV4dClcblxuICAgIHRoaXMucmVxdWVzdHMuYWRkKHJlcSlcbiAgICByZXMub24oXCJmaW5pc2hcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5yZXF1ZXN0cy5kZWxldGUocmVxKVxuICAgIH0pXG5cbiAgICBQcm9taXNlLnJlc29sdmUoaGFuZGxlcigpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7dGhyb3cgZXJyfSlcbiAgICB9KVxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm91dGVyOiB0aGlzLnJvdXRlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgc2VydmVyOiBcIjxub2RlIHNlcnZlcj5cIixcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb25cblxuZnVuY3Rpb24gY29tcG9zZShzdGFjazogU3RhY2ssIGNvbnRleHQ6IENvbnRleHQpOiBOZXh0IHtcbiAgY29uc3QgaXRlcmF0b3IgPSBzdGFjay52YWx1ZXMoKVxuXG4gIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgIGNvbnN0IGhhbmRsZXIgPSBpdGVyYXRvci5uZXh0KCkudmFsdWVcblxuICAgIC8qIENoZWNrIGlmIGEgaGFuZGxlciBpcyBwcmVzZW50IGFuZCB2YWxpZC4gKi9cbiAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgIHRocm93IG5ldyBOb3RGb3VuZChcIkVuZHBvaW50IGRvZXMgbm90IGV4aXN0XCIpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBJbnRlcm5hbFNlcnZlckVycm9yKFwiQmFkIGhhbmRsZXJcIilcbiAgICB9XG5cbiAgICAvLyBFUzc6IHJldHVybiBjb250ZXh0OjpoYW5kbGVyKG5leHQpXG4gICAgcmV0dXJuIGhhbmRsZXIuY2FsbChjb250ZXh0LCBuZXh0KVxuICB9XG59XG4iXX0=