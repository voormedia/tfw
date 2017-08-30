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
    this.sockets = new Map();

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

    this.server.closing = false;
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
      this.sockets.set(socket, 0);

      socket.on("close", () => {
        this.sockets.delete(socket);
      });
    });

    this.server.on("request", (request, response) => {
      const socket = request.socket;
      this.sockets.set(socket, +this.sockets.get(socket) + 1);

      if (this.server.closing) {
        response.setHeader("Connection", "close");
      }

      response.on("finish", () => {
        const pending = +this.sockets.get(socket) - 1;
        this.sockets.set(socket, pending);

        if (this.server.closing && pending === 0) {
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
    this.logger.notice(`stopping ${this.description}`);

    this.server.closing = true;

    const stopped = new Promise(resolve => {
      this.server.close(err => {
        if (err) {
          this.logger.error(err);
        }

        this.logger.notice(`gracefully stopped ${this.description}`);
        resolve(this);
      });
    });

    for (const [socket, pending] of this.sockets) {
      if (pending === 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJzb2NrZXRzIiwiTWFwIiwicG9ydCIsInJvdXRlciIsImxvZ2dlciIsInRlcm1pbmF0aW9uR3JhY2UiLCJOT0RFX0VOViIsInN0YWNrIiwibG9nIiwid3JpdGUiLCJyZXNjdWUiLCJzaHV0ZG93biIsInJvdXRlIiwiZnJlZXplIiwiY2xvc2luZyIsInRpbWVvdXQiLCJvbiIsInN0b3AiLCJleGl0IiwiZXJyIiwiY3JpdGljYWwiLCJ3YXJuaW5nIiwic29ja2V0Iiwic2V0IiwiZGVsZXRlIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZ2V0Iiwic2V0SGVhZGVyIiwicGVuZGluZyIsImRlYnVnIiwicmVtb3RlQWRkcmVzcyIsInJlbW90ZVBvcnQiLCJlbmQiLCJkaXNwYXRjaCIsImJpbmQiLCJzdGFydGVkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJvbmNlIiwibm90aWNlIiwibGlzdGVuIiwic3RvcHBlZCIsImNsb3NlIiwiZXJyb3IiLCJyZXEiLCJyZXMiLCJzbGljZSIsImNvbnRleHQiLCJoYW5kbGVyIiwiY29tcG9zZSIsImNhdGNoIiwiaW5zcGVjdCIsIml0ZXJhdG9yIiwidmFsdWVzIiwibmV4dCIsInZhbHVlIiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7SUFBWUEsVTs7QUFLWjs7Ozs7Ozs7OztBQWVBLE1BQU1DLGNBQWUsR0FBRSxrQkFBUUMsSUFBSyxZQUFXQyxRQUFRQyxHQUFS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QkMsR0FBeEIsQ0FBaEI7QUFDQSxVQUFNRyxVQUFVQyxRQUFRM0MsS0FBUixFQUFleUMsT0FBZixDQUFoQjs7QUFFQVgsWUFBUUMsT0FBUixDQUFnQlcsU0FBaEIsRUFBMkJFLEtBQTNCLENBQWlDaEMsT0FBTztBQUN0Q2pDLGNBQVFVLFFBQVIsQ0FBaUIsTUFBTTtBQUFDLGNBQU11QixHQUFOO0FBQVUsT0FBbEM7QUFDRCxLQUZEO0FBR0Q7O0FBRURpQyxZQUFVO0FBQ1IsV0FBTztBQUNMakQsY0FBUSxLQUFLQSxNQURSO0FBRUxJLGFBQU8sS0FBS0EsS0FGUDtBQUdMVCxjQUFRO0FBSEgsS0FBUDtBQUtEO0FBbEtzQixDO2tCQXFLVlIsVzs7O0FBRWYsU0FBUzRELE9BQVQsQ0FBaUIzQyxLQUFqQixFQUErQnlDLE9BQS9CLEVBQXVEO0FBQ3JELFFBQU1LLFdBQVc5QyxNQUFNK0MsTUFBTixFQUFqQjs7QUFFQSxTQUFPLFNBQVNDLElBQVQsR0FBZ0I7QUFDckIsVUFBTU4sVUFBVUksU0FBU0UsSUFBVCxHQUFnQkMsS0FBaEM7O0FBRUE7QUFDQSxRQUFJLENBQUNQLE9BQUwsRUFBYztBQUNaLFlBQU0scUJBQWEseUJBQWIsQ0FBTjtBQUNEOztBQUVELFFBQUksT0FBT0EsT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNqQyxZQUFNLGdDQUF3QixhQUF4QixDQUFOO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFPQSxRQUFRUSxJQUFSLENBQWFULE9BQWIsRUFBc0JPLElBQXRCLENBQVA7QUFDRCxHQWREO0FBZUQiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IFwiLi91dGlsL3BvbHlmaWxsXCJcblxuaW1wb3J0IGh0dHAgZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgaG9zdFBrZyBmcm9tIFwiLi91dGlsL2hvc3QtcGtnXCJcblxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi91dGlsL2xvZ2dlclwiXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuL3JvdXRlclwiXG5pbXBvcnQgQ29udGV4dCBmcm9tIFwiLi9jb250ZXh0XCJcblxuaW1wb3J0IHtOb3RGb3VuZCwgSW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4vZXJyb3JzXCJcbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtOZXh0LCBTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gXCIuL2NvbnRleHRcIlxuXG5pbXBvcnQgc2xlZXAgZnJvbSBcIi4vdXRpbC9zbGVlcFwiXG5cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uT3B0aW9ucyA9IHt8XG4gIHBvcnQ/OiBudW1iZXIsXG4gIGxvZ2dlcj86IExvZ2dlcixcbiAgcm91dGVyPzogUm91dGVyLFxuICB0ZXJtaW5hdGlvbkdyYWNlPzogbnVtYmVyLFxufH1cblxudHlwZSBDbG9zaW5nU2VydmVyID0gaHR0cC5TZXJ2ZXIgJiB7XG4gIGNsb3Npbmc/OiBib29sZWFuLFxufVxuXG50eXBlIFNvY2tldCA9IG5ldCRTb2NrZXRcblxuY29uc3QgZGVzY3JpcHRpb24gPSBgJHtob3N0UGtnLm5hbWV9IHNlcnZpY2UgJHtwcm9jZXNzLmVudi5IT1NUTkFNRSB8fCBcIlwifWAudHJpbSgpXG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gIHBvcnQ6IG51bWJlclxuICByb3V0ZXI6IFJvdXRlclxuICBsb2dnZXI6IExvZ2dlclxuICBzdGFjazogU3RhY2tcblxuICBkZXNjcmlwdGlvbjogc3RyaW5nID0gZGVzY3JpcHRpb25cbiAgc2VydmVyOiBDbG9zaW5nU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKVxuICBzb2NrZXRzOiBNYXA8U29ja2V0LCBudW1iZXI+ID0gbmV3IE1hcFxuXG4gIC8qIFN0YXJ0IGEgbmV3IGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgaW4gbmV4dCB0aWNrLiAqL1xuICBzdGF0aWMgc3RhcnQob3B0aW9uczogQXBwbGljYXRpb25PcHRpb25zID0gT2JqZWN0LnNlYWwoe30pKSB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKG9wdGlvbnMpXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7YXBwLnN0YXJ0KCl9KVxuICAgIHJldHVybiBhcHBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IE9iamVjdC5zZWFsKHt9KSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBvcnQgPSAzMDAwLFxuICAgICAgcm91dGVyID0gbmV3IFJvdXRlcixcbiAgICAgIGxvZ2dlciA9IG5ldyBMb2dnZXIsXG4gICAgICB0ZXJtaW5hdGlvbkdyYWNlID0gMjUsXG4gICAgfSA9IG9wdGlvbnNcblxuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cblxuICAgIHRoaXMucG9ydCA9IHBvcnRcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyXG5cbiAgICAvKiBCYXJlIG1pbmltdW0gc3RhY2sgdG8gZG8gYW55dGhpbmcgdXNlZnVsLiAqL1xuICAgIHRoaXMuc3RhY2sgPSBbXG4gICAgICBtaWRkbGV3YXJlLmxvZyhsb2dnZXIpLFxuICAgICAgbWlkZGxld2FyZS53cml0ZSgpLFxuICAgICAgbWlkZGxld2FyZS5yZXNjdWUoKSxcbiAgICAgIG1pZGRsZXdhcmUuc2h1dGRvd24odGVybWluYXRpb25HcmFjZSksXG4gICAgICBtaWRkbGV3YXJlLnJvdXRlKHJvdXRlciksXG4gICAgXVxuXG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgc3RhcnQoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMuc2VydmVyLmNsb3NpbmcgPSBmYWxzZVxuICAgIHRoaXMuc2VydmVyLnRpbWVvdXQgPSAwXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHVEVSTVwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDApXG4gICAgfSlcblxuICAgIHByb2Nlc3Mub24oXCJTSUdJTlRcIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgIH0pXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwidGVzdFwiKSB7XG4gICAgICBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIiwgYXN5bmMgKGVycjogRXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuY2F1Z2h0ICR7ZXJyLnN0YWNrfWApXG5cbiAgICAgICAgLyogRG9uJ3Qgd2FpdCBmb3Igc2VydmVyIHRvIHF1aXRlIGdyYWNlZnVsbHksIGJ1dCBxdWl0IGFmdGVyIHNob3J0IGRlbGF5LlxuICAgICAgICAgICBUaGlzIGF2b2lkcyBwcm9jZXNzZXMgaGFuZ2luZyBmb3IgYSBsb25nIHRpbWUgYmVjYXVzZSBhXG4gICAgICAgICAgIHJlcXVlc3QgZmFpbGVkIHRvIGZpbmlzaC4gV2Ugc2FjcmlmaWNlIGFsbCBydW5uaW5nIHJlcXVlc3RzIGZvciBhXG4gICAgICAgICAgIG1vcmUgc3BlZWR5IHJlY292ZXJ5IGJlY2F1c2UgdGhlIHNlcnZlciB3aWxsIHJlc3RhcnQuICovXG4gICAgICAgIHRoaXMuc3RvcCgpXG5cbiAgICAgICAgYXdhaXQgc2xlZXAoNTAwKVxuICAgICAgICB0aGlzLmxvZ2dlci53YXJuaW5nKGBmb3JjZWZ1bGx5IHN0b3BwZWQgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2VydmVyLm9uKFwiY29ubmVjdGlvblwiLCAoc29ja2V0OiBuZXQkU29ja2V0KSA9PiB7XG4gICAgICB0aGlzLnNvY2tldHMuc2V0KHNvY2tldCwgMClcblxuICAgICAgc29ja2V0Lm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLnNvY2tldHMuZGVsZXRlKHNvY2tldClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCAocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBzb2NrZXQgPSByZXF1ZXN0LnNvY2tldFxuICAgICAgdGhpcy5zb2NrZXRzLnNldChzb2NrZXQsICt0aGlzLnNvY2tldHMuZ2V0KHNvY2tldCkgKyAxKVxuXG4gICAgICBpZiAodGhpcy5zZXJ2ZXIuY2xvc2luZykge1xuICAgICAgICByZXNwb25zZS5zZXRIZWFkZXIoXCJDb25uZWN0aW9uXCIsIFwiY2xvc2VcIilcbiAgICAgIH1cblxuICAgICAgcmVzcG9uc2Uub24oXCJmaW5pc2hcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBwZW5kaW5nID0gK3RoaXMuc29ja2V0cy5nZXQoc29ja2V0KSAtIDFcbiAgICAgICAgdGhpcy5zb2NrZXRzLnNldChzb2NrZXQsIHBlbmRpbmcpXG5cbiAgICAgICAgaWYgKHRoaXMuc2VydmVyLmNsb3NpbmcgJiYgcGVuZGluZyA9PT0gMCkge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBjbG9zaW5nIGNvbm5lY3Rpb24gJHtzb2NrZXQucmVtb3RlQWRkcmVzcyB8fCBcInVua25vd25cIn06JHtzb2NrZXQucmVtb3RlUG9ydH1gKVxuICAgICAgICAgIHNvY2tldC5lbmQoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBFUzc6IHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCA6OnRoaXMuZGlzcGF0Y2gpXG4gICAgdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIHRoaXMuZGlzcGF0Y2guYmluZCh0aGlzKSlcblxuICAgIGNvbnN0IHN0YXJ0ZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLm9uY2UoXCJsaXN0ZW5pbmdcIiwgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYHN0YXJ0aW5nICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgdGhpcy5zZXJ2ZXIubGlzdGVuKHRoaXMucG9ydClcblxuICAgIHJldHVybiBzdGFydGVkXG4gIH1cblxuICBzdG9wKCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYHN0b3BwaW5nICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2luZyA9IHRydWVcblxuICAgIGNvbnN0IHN0b3BwZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLmNsb3NlKGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYGdyYWNlZnVsbHkgc3RvcHBlZCAke3RoaXMuZGVzY3JpcHRpb259YClcbiAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZm9yIChjb25zdCBbc29ja2V0LCBwZW5kaW5nXSBvZiB0aGlzLnNvY2tldHMpIHtcbiAgICAgIGlmIChwZW5kaW5nID09PSAwKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBjbG9zaW5nIGlkbGUgY29ubmVjdGlvbiAke3NvY2tldC5yZW1vdGVBZGRyZXNzIHx8IFwidW5rbm93blwifToke3NvY2tldC5yZW1vdGVQb3J0fWApXG4gICAgICAgIHNvY2tldC5lbmQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdG9wcGVkXG4gIH1cblxuICBkaXNwYXRjaChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFjayA9IHRoaXMuc3RhY2suc2xpY2UoMClcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IENvbnRleHQoc3RhY2ssIHJlcSwgcmVzKVxuICAgIGNvbnN0IGhhbmRsZXIgPSBjb21wb3NlKHN0YWNrLCBjb250ZXh0KVxuXG4gICAgUHJvbWlzZS5yZXNvbHZlKGhhbmRsZXIoKSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge3Rocm93IGVycn0pXG4gICAgfSlcbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdXRlcjogdGhpcy5yb3V0ZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIHNlcnZlcjogXCI8bm9kZSBzZXJ2ZXI+XCIsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIGNvbXBvc2Uoc3RhY2s6IFN0YWNrLCBjb250ZXh0OiBDb250ZXh0KTogTmV4dCB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gc3RhY2sudmFsdWVzKClcblxuICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBjb25zdCBoYW5kbGVyID0gaXRlcmF0b3IubmV4dCgpLnZhbHVlXG5cbiAgICAvKiBDaGVjayBpZiBhIGhhbmRsZXIgaXMgcHJlc2VudCBhbmQgdmFsaWQuICovXG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgTm90Rm91bmQoXCJFbmRwb2ludCBkb2VzIG5vdCBleGlzdFwiKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBuZXcgSW50ZXJuYWxTZXJ2ZXJFcnJvcihcIkJhZCBoYW5kbGVyXCIpXG4gICAgfVxuXG4gICAgLy8gRVM3OiByZXR1cm4gY29udGV4dDo6aGFuZGxlcihuZXh0KVxuICAgIHJldHVybiBoYW5kbGVyLmNhbGwoY29udGV4dCwgbmV4dClcbiAgfVxufVxuIl19