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
    var _this2 = this;

    const stack = this.stack.slice(0);
    const context = new _context2.default(stack, req, res);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJzZXJ2ZXIiLCJjcmVhdGVTZXJ2ZXIiLCJzb2NrZXRzIiwiU2V0IiwicmVxdWVzdHMiLCJwb3J0Iiwicm91dGVyIiwibG9nZ2VyIiwidGVybWluYXRpb25HcmFjZSIsIk5PREVfRU5WIiwic3RhY2siLCJsb2ciLCJ3cml0ZSIsInJlc2N1ZSIsInNodXRkb3duIiwicm91dGUiLCJmcmVlemUiLCJ0aW1lb3V0Iiwib24iLCJzdG9wIiwiZXhpdCIsImVyciIsImNyaXRpY2FsIiwid2FybmluZyIsInNvY2tldCIsImlkbGUiLCJkZWxldGUiLCJhZGQiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJjbG9zaW5nIiwicmVtb3ZlSGVhZGVyIiwic2V0SGVhZGVyIiwiZGVidWciLCJyZW1vdGVBZGRyZXNzIiwicmVtb3RlUG9ydCIsImVuZCIsImRpc3BhdGNoIiwiYmluZCIsInN0YXJ0ZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9uY2UiLCJub3RpY2UiLCJsaXN0ZW4iLCJjYW5jZWxsZWQiLCJzdG9wcGVkIiwiY2xvc2UiLCJlcnJvciIsInJlcSIsInJlcyIsInNsaWNlIiwiY29udGV4dCIsImhhbmRsZXIiLCJjb21wb3NlIiwiY2FsbCIsImNhdGNoIiwiaW5zcGVjdCIsIml0ZXJhdG9yIiwidmFsdWVzIiwibmV4dCIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBRUE7Ozs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUNBOztJQUFZQSxVOztBQUtaOzs7Ozs7Ozs7O0FBcUJBLE1BQU1DLGNBQWUsR0FB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ZixDQUFoQjs7QUFFQSxVQUFNRztBQUFBLG9DQUFPLGFBQVk7QUFDdkIsWUFBSTtBQUNGLGlCQUFLbkQsUUFBTCxDQUFjdUIsR0FBZCxDQUFrQnNCLEdBQWxCO0FBQ0EsZ0JBQU1JLFNBQU47QUFDRCxTQUhELFNBR1U7QUFDUixpQkFBS2pELFFBQUwsQ0FBY3NCLE1BQWQsQ0FBcUJ1QixHQUFyQjtBQUNEO0FBQ0YsT0FQSzs7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUFOOztBQVNBVCxZQUFRQyxPQUFSLENBQWdCYyxNQUFoQixFQUF3QkMsS0FBeEIsQ0FBOEJuQyxPQUFPO0FBQ25DakMsY0FBUVUsUUFBUixDQUFpQixNQUFNO0FBQUMsY0FBTXVCLEdBQU47QUFBVSxPQUFsQztBQUNELEtBRkQ7QUFHRDs7QUFFRG9DLFlBQVU7QUFDUixXQUFPO0FBQ0xuRCxjQUFRLEtBQUtBLE1BRFI7QUFFTEksYUFBTyxLQUFLQSxLQUZQO0FBR0xWLGNBQVE7QUFISCxLQUFQO0FBS0Q7QUFqTHNCLEM7a0JBb0xWUixXOzs7QUFFZixTQUFTOEQsT0FBVCxDQUFpQjVDLEtBQWpCLEVBQStCMEMsT0FBL0IsRUFBdUQ7QUFDckQsUUFBTU0sV0FBV2hELE1BQU1pRCxNQUFOLEVBQWpCOztBQUVBLFNBQU8sU0FBU0MsSUFBVCxHQUFnQjtBQUNyQixVQUFNUCxVQUFVSyxTQUFTRSxJQUFULEdBQWdCQyxLQUFoQzs7QUFFQTtBQUNBLFFBQUksQ0FBQ1IsT0FBTCxFQUFjO0FBQ1osWUFBTSxxQkFBYSx5QkFBYixDQUFOO0FBQ0Q7O0FBRUQsUUFBSSxPQUFPQSxPQUFQLEtBQW1CLFVBQXZCLEVBQW1DO0FBQ2pDLFlBQU0sZ0NBQXdCLGFBQXhCLENBQU47QUFDRDs7QUFFRDtBQUNBLFdBQU9BLFFBQVFFLElBQVIsQ0FBYUgsT0FBYixFQUFzQlEsSUFBdEIsQ0FBUDtBQUNELEdBZEQ7QUFlRCIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgXCIuL3V0aWwvcG9seWZpbGxcIlxuXG5pbXBvcnQgaHR0cCBmcm9tIFwiaHR0cFwiXG5cbmltcG9ydCBob3N0UGtnIGZyb20gXCIuL3V0aWwvaG9zdC1wa2dcIlxuXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL3V0aWwvbG9nZ2VyXCJcbmltcG9ydCBSb3V0ZXIgZnJvbSBcIi4vcm91dGVyXCJcbmltcG9ydCBDb250ZXh0IGZyb20gXCIuL2NvbnRleHRcIlxuXG5pbXBvcnQge05vdEZvdW5kLCBJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi9lcnJvcnNcIlxuaW1wb3J0ICogYXMgbWlkZGxld2FyZSBmcm9tIFwiLi9taWRkbGV3YXJlXCJcblxuaW1wb3J0IHR5cGUge05leHQsIFN0YWNrfSBmcm9tIFwiLi9taWRkbGV3YXJlXCJcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSBcIi4vY29udGV4dFwiXG5cbmltcG9ydCBzbGVlcCBmcm9tIFwiLi91dGlsL3NsZWVwXCJcblxuZXhwb3J0IHR5cGUgQXBwbGljYXRpb25PcHRpb25zID0ge3xcbiAgcG9ydD86IG51bWJlcixcbiAgbG9nZ2VyPzogTG9nZ2VyLFxuICByb3V0ZXI/OiBSb3V0ZXIsXG4gIHRlcm1pbmF0aW9uR3JhY2U/OiBudW1iZXIsXG58fVxuXG50eXBlIElkbGluZ1NvY2tldCA9IG5ldCRTb2NrZXQgJiB7XG4gIGlkbGU/OiBib29sZWFuLFxufVxuXG50eXBlIENhbmNlbGxpbmdSZXF1ZXN0ID0gUmVxdWVzdCAmIHtcbiAgY2FuY2VsbGVkPzogYm9vbGVhbixcbn1cblxudHlwZSBDbG9zaW5nU2VydmVyID0gaHR0cC5TZXJ2ZXIgJiB7XG4gIGNsb3Npbmc/OiBib29sZWFuLFxufVxuXG5jb25zdCBkZXNjcmlwdGlvbiA9IGAke2hvc3RQa2cubmFtZX0gc2VydmljZSAke3Byb2Nlc3MuZW52LkhPU1ROQU1FIHx8IFwiXCJ9YC50cmltKClcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIHtcbiAgcG9ydDogbnVtYmVyXG4gIHJvdXRlcjogUm91dGVyXG4gIGxvZ2dlcjogTG9nZ2VyXG4gIHN0YWNrOiBTdGFja1xuXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBkZXNjcmlwdGlvblxuICBzZXJ2ZXI6IENsb3NpbmdTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcigpXG4gIHNvY2tldHM6IFNldDxJZGxpbmdTb2NrZXQ+ID0gbmV3IFNldFxuICByZXF1ZXN0czogU2V0PENhbmNlbGxpbmdSZXF1ZXN0PiA9IG5ldyBTZXRcblxuICAvKiBTdGFydCBhIG5ldyBhcHBsaWNhdGlvbiB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGluIG5leHQgdGljay4gKi9cbiAgc3RhdGljIHN0YXJ0KG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IE9iamVjdC5zZWFsKHt9KSkge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihvcHRpb25zKVxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge2FwcC5zdGFydCgpfSlcbiAgICByZXR1cm4gYXBwXG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSBPYmplY3Quc2VhbCh7fSkpIHtcbiAgICBjb25zdCB7XG4gICAgICBwb3J0ID0gMzAwMCxcbiAgICAgIHJvdXRlciA9IG5ldyBSb3V0ZXIsXG4gICAgICBsb2dnZXIgPSBuZXcgTG9nZ2VyLFxuICAgICAgdGVybWluYXRpb25HcmFjZSA9IDI1LFxuICAgIH0gPSBvcHRpb25zXG5cbiAgICAvKiBBc3NpZ24gZGVmYXVsdCBlbnYuICovXG4gICAgaWYgKCFwcm9jZXNzLmVudi5OT0RFX0VOVikge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPSBcImRldmVsb3BtZW50XCJcbiAgICB9XG5cbiAgICB0aGlzLnBvcnQgPSBwb3J0XG4gICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXJcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlclxuXG4gICAgLyogQmFyZSBtaW5pbXVtIHN0YWNrIHRvIGRvIGFueXRoaW5nIHVzZWZ1bC4gKi9cbiAgICB0aGlzLnN0YWNrID0gW1xuICAgICAgbWlkZGxld2FyZS5sb2cobG9nZ2VyKSxcbiAgICAgIG1pZGRsZXdhcmUud3JpdGUoKSxcbiAgICAgIG1pZGRsZXdhcmUucmVzY3VlKCksXG4gICAgICBtaWRkbGV3YXJlLnNodXRkb3duKHRlcm1pbmF0aW9uR3JhY2UpLFxuICAgICAgbWlkZGxld2FyZS5yb3V0ZShyb3V0ZXIpLFxuICAgIF1cblxuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIHN0YXJ0KCk6IFByb21pc2U8QXBwbGljYXRpb24+IHtcbiAgICB0aGlzLnNlcnZlci50aW1lb3V0ID0gMFxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR1RFUk1cIiwgYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5zdG9wKClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgIH0pXG5cbiAgICBwcm9jZXNzLm9uKFwiU0lHSU5UXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMClcbiAgICB9KVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInRlc3RcIikge1xuICAgICAgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGFzeW5jIChlcnI6IEVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmNyaXRpY2FsKGB1bmNhdWdodCAke2Vyci5zdGFja31gKVxuXG4gICAgICAgIC8qIERvbid0IHdhaXQgZm9yIHNlcnZlciB0byBxdWl0ZSBncmFjZWZ1bGx5LCBidXQgcXVpdCBhZnRlciBzaG9ydCBkZWxheS5cbiAgICAgICAgICAgVGhpcyBhdm9pZHMgcHJvY2Vzc2VzIGhhbmdpbmcgZm9yIGEgbG9uZyB0aW1lIGJlY2F1c2UgYVxuICAgICAgICAgICByZXF1ZXN0IGZhaWxlZCB0byBmaW5pc2guIFdlIHNhY3JpZmljZSBhbGwgcnVubmluZyByZXF1ZXN0cyBmb3IgYVxuICAgICAgICAgICBtb3JlIHNwZWVkeSByZWNvdmVyeSBiZWNhdXNlIHRoZSBzZXJ2ZXIgd2lsbCByZXN0YXJ0LiAqL1xuICAgICAgICB0aGlzLnN0b3AoKVxuXG4gICAgICAgIGF3YWl0IHNsZWVwKDUwMClcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybmluZyhgZm9yY2VmdWxseSBzdG9wcGVkICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnNlcnZlci5vbihcImNvbm5lY3Rpb25cIiwgKHNvY2tldDogSWRsaW5nU29ja2V0KSA9PiB7XG4gICAgICBzb2NrZXQuaWRsZSA9IHRydWVcblxuICAgICAgc29ja2V0Lm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLnNvY2tldHMuZGVsZXRlKHNvY2tldClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc29ja2V0cy5hZGQoc29ja2V0KVxuICAgIH0pXG5cbiAgICB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgKHJlcXVlc3Q6IFJlcXVlc3QsIHJlc3BvbnNlOiBSZXNwb25zZSkgPT4ge1xuICAgICAgY29uc3Qgc29ja2V0OiBJZGxpbmdTb2NrZXQgPSByZXF1ZXN0LnNvY2tldFxuICAgICAgc29ja2V0LmlkbGUgPSBmYWxzZVxuXG4gICAgICBpZiAodGhpcy5zZXJ2ZXIuY2xvc2luZykge1xuICAgICAgICByZXNwb25zZS5yZW1vdmVIZWFkZXIoXCJDb25uZWN0aW9uXCIpXG4gICAgICAgIHJlc3BvbnNlLnNldEhlYWRlcihcIkNvbm5lY3Rpb25cIiwgXCJjbG9zZVwiKVxuICAgICAgfVxuXG4gICAgICByZXNwb25zZS5vbihcImZpbmlzaFwiLCAoKSA9PiB7XG4gICAgICAgIHNvY2tldC5pZGxlID0gdHJ1ZVxuXG4gICAgICAgIGlmICh0aGlzLnNlcnZlci5jbG9zaW5nKSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYGNsb3NpbmcgY29ubmVjdGlvbiAke3NvY2tldC5yZW1vdGVBZGRyZXNzIHx8IFwidW5rbm93blwifToke3NvY2tldC5yZW1vdGVQb3J0fWApXG4gICAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIEVTNzogdGhpcy5zZXJ2ZXIub24oXCJyZXF1ZXN0XCIsIDo6dGhpcy5kaXNwYXRjaClcbiAgICB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgdGhpcy5kaXNwYXRjaC5iaW5kKHRoaXMpKVxuXG4gICAgY29uc3Qgc3RhcnRlZCA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5zZXJ2ZXIub25jZShcImxpc3RlbmluZ1wiLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUodGhpcylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RhcnRpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICB0aGlzLnNlcnZlci5saXN0ZW4odGhpcy5wb3J0KVxuXG4gICAgcmV0dXJuIHN0YXJ0ZWRcbiAgfVxuXG4gIHN0b3AoKTogUHJvbWlzZTxBcHBsaWNhdGlvbj4ge1xuICAgIHRoaXMuc2VydmVyLmNsb3NpbmcgPSB0cnVlXG5cbiAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYHN0b3BwaW5nICR7dGhpcy5kZXNjcmlwdGlvbn1gKVxuXG4gICAgZm9yIChjb25zdCByZXF1ZXN0IG9mIHRoaXMucmVxdWVzdHMpIHtcbiAgICAgIHJlcXVlc3QuY2FuY2VsbGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIGNvbnN0IHN0b3BwZWQgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuc2VydmVyLmNsb3NlKGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYGdyYWNlZnVsbHkgc3RvcHBlZCAke3RoaXMuZGVzY3JpcHRpb259YClcbiAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZm9yIChjb25zdCBzb2NrZXQgb2YgdGhpcy5zb2NrZXRzKSB7XG4gICAgICBpZiAoc29ja2V0LmlkbGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoYGNsb3NpbmcgaWRsZSBjb25uZWN0aW9uICR7c29ja2V0LnJlbW90ZUFkZHJlc3MgfHwgXCJ1bmtub3duXCJ9OiR7c29ja2V0LnJlbW90ZVBvcnR9YClcbiAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0b3BwZWRcbiAgfVxuXG4gIGRpc3BhdGNoKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IHZvaWQge1xuICAgIGNvbnN0IHN0YWNrID0gdGhpcy5zdGFjay5zbGljZSgwKVxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQ29udGV4dChzdGFjaywgcmVxLCByZXMpXG4gICAgY29uc3QgaGFuZGxlciA9IGNvbXBvc2Uoc3RhY2ssIGNvbnRleHQpXG5cbiAgICBjb25zdCBjYWxsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5yZXF1ZXN0cy5hZGQocmVxKVxuICAgICAgICBhd2FpdCBoYW5kbGVyKClcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMuZGVsZXRlKHJlcSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBQcm9taXNlLnJlc29sdmUoY2FsbCgpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7dGhyb3cgZXJyfSlcbiAgICB9KVxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm91dGVyOiB0aGlzLnJvdXRlcixcbiAgICAgIHN0YWNrOiB0aGlzLnN0YWNrLFxuICAgICAgc2VydmVyOiBcIjxub2RlIHNlcnZlcj5cIixcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb25cblxuZnVuY3Rpb24gY29tcG9zZShzdGFjazogU3RhY2ssIGNvbnRleHQ6IENvbnRleHQpOiBOZXh0IHtcbiAgY29uc3QgaXRlcmF0b3IgPSBzdGFjay52YWx1ZXMoKVxuXG4gIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgIGNvbnN0IGhhbmRsZXIgPSBpdGVyYXRvci5uZXh0KCkudmFsdWVcblxuICAgIC8qIENoZWNrIGlmIGEgaGFuZGxlciBpcyBwcmVzZW50IGFuZCB2YWxpZC4gKi9cbiAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgIHRocm93IG5ldyBOb3RGb3VuZChcIkVuZHBvaW50IGRvZXMgbm90IGV4aXN0XCIpXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRocm93IG5ldyBJbnRlcm5hbFNlcnZlckVycm9yKFwiQmFkIGhhbmRsZXJcIilcbiAgICB9XG5cbiAgICAvLyBFUzc6IHJldHVybiBjb250ZXh0OjpoYW5kbGVyKG5leHQpXG4gICAgcmV0dXJuIGhhbmRsZXIuY2FsbChjb250ZXh0LCBuZXh0KVxuICB9XG59XG4iXX0=