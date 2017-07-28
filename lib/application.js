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
  static start(options = Object.seal({})) {
    const app = new Application(options);
    process.nextTick(() => {
      app.start();
    });
    return app;
  }

  constructor(options = Object.seal({})) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi5qcyJdLCJuYW1lcyI6WyJtaWRkbGV3YXJlIiwiZGVzY3JpcHRpb24iLCJuYW1lIiwicHJvY2VzcyIsImVudiIsIkhPU1ROQU1FIiwidHJpbSIsIkFwcGxpY2F0aW9uIiwic3RhcnQiLCJvcHRpb25zIiwiT2JqZWN0Iiwic2VhbCIsImFwcCIsIm5leHRUaWNrIiwiY29uc3RydWN0b3IiLCJwb3J0Iiwic2VydmVyIiwiY3JlYXRlU2VydmVyIiwic29ja2V0cyIsIlNldCIsInJlcXVlc3RzIiwiYXNzaWduIiwiTk9ERV9FTlYiLCJyb3V0ZXIiLCJsb2dnZXIiLCJmb3JtYXR0ZXIiLCJQUkVUVFkiLCJKU09OIiwidGFyZ2V0IiwiY29uc29sZSIsInN0YWNrIiwibG9nIiwid3JpdGUiLCJyZXNjdWUiLCJyb3V0ZSIsImZyZWV6ZSIsInRpbWVvdXQiLCJvbiIsInN0b3AiLCJleGl0IiwiZXJyIiwiY3JpdGljYWwiLCJzb2NrZXQiLCJpZGxlIiwiZGVsZXRlIiwiYWRkIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiY2xvc2luZyIsInJlbW92ZUhlYWRlciIsInNldEhlYWRlciIsImRlYnVnIiwicmVtb3RlQWRkcmVzcyIsInJlbW90ZVBvcnQiLCJlbmQiLCJkaXNwYXRjaCIsImJpbmQiLCJzdGFydGVkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJvbmNlIiwibm90aWNlIiwibGlzdGVuIiwic3RvcHBlZCIsImNhbmNlbGxlZCIsImNsb3NlIiwicmVxIiwicmVzIiwic2xpY2UiLCJjb250ZXh0IiwiaGFuZGxlciIsImNvbXBvc2UiLCJjYWxsIiwiY2F0Y2giLCJpbnNwZWN0IiwiaXRlcmF0b3IiLCJ2YWx1ZXMiLCJuZXh0IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFFQTs7OztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFDQTs7SUFBWUEsVTs7Ozs7OztBQWJaOzs7QUFxQ0EsTUFBTUMsY0FBZSxHQUFFLGtCQUFRQyxJQUFLLFlBQVdDLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixJQUF3QixFQUFHLEVBQXRELENBQXdEQyxJQUF4RCxFQUFwQjs7SUFFYUMsVyxXQUFBQSxXLEdBQU4sTUFBTUEsV0FBTixDQUFrQjs7QUFZdkI7QUFDQSxTQUFPQyxLQUFQLENBQWFDLFVBQThCQyxPQUFPQyxJQUFQLENBQVksRUFBWixDQUEzQyxFQUE0RDtBQUMxRCxVQUFNQyxNQUFNLElBQUlMLFdBQUosQ0FBZ0JFLE9BQWhCLENBQVo7QUFDQU4sWUFBUVUsUUFBUixDQUFpQixNQUFNO0FBQUNELFVBQUlKLEtBQUo7QUFBWSxLQUFwQztBQUNBLFdBQU9JLEdBQVA7QUFDRDs7QUFFREUsY0FBWUwsVUFBOEJDLE9BQU9DLElBQVAsQ0FBWSxFQUFaLENBQTFDLEVBQTJEO0FBQUEsU0FsQjNESSxJQWtCMkQsR0FsQjVDLElBa0I0QztBQUFBLFNBWjNEZCxXQVkyRCxHQVpyQ0EsV0FZcUM7QUFBQSxTQVgzRGUsTUFXMkQsR0FYbkMsZUFBS0MsWUFBTCxFQVdtQztBQUFBLFNBVjNEQyxPQVUyRCxHQVY5QixJQUFJQyxHQUFKLEVBVThCO0FBQUEsU0FUM0RDLFFBUzJELEdBVHhCLElBQUlELEdBQUosRUFTd0I7O0FBQ3pEO0FBQ0FULFdBQU9XLE1BQVAsQ0FBYyxJQUFkLEVBQW9CWixPQUFwQjs7QUFFQTtBQUNBLFFBQUksQ0FBQ04sUUFBUUMsR0FBUixDQUFZa0IsUUFBakIsRUFBMkI7QUFDekJuQixjQUFRQyxHQUFSLENBQVlrQixRQUFaLEdBQXVCLGFBQXZCO0FBQ0Q7O0FBRUQsUUFBSSxDQUFDLEtBQUtDLE1BQVYsRUFBa0I7QUFDaEIsV0FBS0EsTUFBTCxHQUFjLHNCQUFkO0FBQ0Q7O0FBRUQsUUFBSSxDQUFDLEtBQUtDLE1BQVYsRUFBa0I7QUFDaEIsWUFBTUMsWUFBWXRCLFFBQVFDLEdBQVIsQ0FBWWtCLFFBQVosS0FBeUIsYUFBekIsR0FBeUMsaUJBQU9JLE1BQWhELEdBQXlELGlCQUFPQyxJQUFsRjtBQUNBLFlBQU1DLFNBQVN6QixRQUFRQyxHQUFSLENBQVlrQixRQUFaLEtBQXlCLE1BQXpCLEdBQWtDLDZCQUFsQyxHQUFzRE8sT0FBckU7QUFDQSxXQUFLTCxNQUFMLEdBQWMscUJBQVdJLE1BQVgsRUFBbUJILFNBQW5CLENBQWQ7QUFDRDs7QUFFRDtBQUNBLFNBQUtLLEtBQUwsR0FBYSxDQUNYOUIsV0FBVytCLEdBQVgsQ0FBZSxLQUFLUCxNQUFwQixDQURXLEVBRVh4QixXQUFXZ0MsS0FBWCxFQUZXLEVBR1hoQyxXQUFXaUMsTUFBWCxFQUhXLEVBSVhqQyxXQUFXa0MsS0FBWCxDQUFpQixLQUFLWCxNQUF0QixDQUpXLENBQWI7O0FBT0FiLFdBQU95QixNQUFQLENBQWMsSUFBZDtBQUNEOztBQUVEM0IsVUFBOEI7QUFBQTs7QUFDNUIsU0FBS1EsTUFBTCxDQUFZb0IsT0FBWixHQUFzQixDQUF0Qjs7QUFFQWpDLFlBQVFrQyxFQUFSLENBQVcsU0FBWCxvQkFBc0IsYUFBWTtBQUNoQyxZQUFNLE1BQUtDLElBQUwsRUFBTjtBQUNBbkMsY0FBUW9DLElBQVIsQ0FBYSxDQUFiO0FBQ0QsS0FIRDs7QUFLQXBDLFlBQVFrQyxFQUFSLENBQVcsUUFBWCxvQkFBcUIsYUFBWTtBQUMvQixZQUFNLE1BQUtDLElBQUwsRUFBTjtBQUNBbkMsY0FBUW9DLElBQVIsQ0FBYSxDQUFiO0FBQ0QsS0FIRDs7QUFLQXBDLFlBQVFrQyxFQUFSLENBQVcsbUJBQVg7QUFBQSxvQ0FBZ0MsV0FBT0csR0FBUCxFQUFzQjtBQUNwRCxjQUFLaEIsTUFBTCxDQUFZaUIsUUFBWixDQUFzQixZQUFXRCxJQUFJVixLQUFNLEVBQTNDO0FBQ0EsY0FBTSxNQUFLUSxJQUFMLEVBQU47QUFDQW5DLGdCQUFRb0MsSUFBUixDQUFhLENBQWI7QUFDRCxPQUpEOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU1BLFNBQUt2QixNQUFMLENBQVlxQixFQUFaLENBQWUsWUFBZixFQUE4QkssTUFBRCxJQUEwQjtBQUNyREEsYUFBT0MsSUFBUCxHQUFjLElBQWQ7O0FBRUFELGFBQU9MLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLE1BQU07QUFDdkIsYUFBS25CLE9BQUwsQ0FBYTBCLE1BQWIsQ0FBb0JGLE1BQXBCO0FBQ0QsT0FGRDs7QUFJQSxXQUFLeEIsT0FBTCxDQUFhMkIsR0FBYixDQUFpQkgsTUFBakI7QUFDRCxLQVJEOztBQVVBLFNBQUsxQixNQUFMLENBQVlxQixFQUFaLENBQWUsU0FBZixFQUEwQixDQUFDUyxPQUFELEVBQW1CQyxRQUFuQixLQUEwQztBQUNsRSxZQUFNTCxTQUF1QkksUUFBUUosTUFBckM7QUFDQUEsYUFBT0MsSUFBUCxHQUFjLEtBQWQ7O0FBRUEsVUFBSSxLQUFLM0IsTUFBTCxDQUFZZ0MsT0FBaEIsRUFBeUI7QUFDdkJELGlCQUFTRSxZQUFULENBQXNCLFlBQXRCO0FBQ0FGLGlCQUFTRyxTQUFULENBQW1CLFlBQW5CLEVBQWlDLE9BQWpDO0FBQ0Q7O0FBRURILGVBQVNWLEVBQVQsQ0FBWSxRQUFaLEVBQXNCLE1BQU07QUFDMUJLLGVBQU9DLElBQVAsR0FBYyxJQUFkOztBQUVBLFlBQUksS0FBSzNCLE1BQUwsQ0FBWWdDLE9BQWhCLEVBQXlCO0FBQ3ZCLGVBQUt4QixNQUFMLENBQVkyQixLQUFaLENBQW1CLHNCQUFxQlQsT0FBT1UsYUFBUCxJQUF3QixTQUFVLElBQUdWLE9BQU9XLFVBQVcsRUFBL0Y7QUFDQVgsaUJBQU9ZLEdBQVA7QUFDRDtBQUNGLE9BUEQ7QUFRRCxLQWpCRDs7QUFtQkE7QUFDQSxTQUFLdEMsTUFBTCxDQUFZcUIsRUFBWixDQUFlLFNBQWYsRUFBMEIsS0FBS2tCLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQixJQUFuQixDQUExQjs7QUFFQSxVQUFNQyxVQUFVLElBQUlDLE9BQUosQ0FBWUMsV0FBVztBQUNyQyxXQUFLM0MsTUFBTCxDQUFZNEMsSUFBWixDQUFpQixXQUFqQixFQUE4QixNQUFNO0FBQ2xDRCxnQkFBUSxJQUFSO0FBQ0QsT0FGRDtBQUdELEtBSmUsQ0FBaEI7O0FBTUEsU0FBS25DLE1BQUwsQ0FBWXFDLE1BQVosQ0FBb0IsWUFBVyxLQUFLNUQsV0FBWSxFQUFoRDs7QUFFQSxTQUFLZSxNQUFMLENBQVk4QyxNQUFaLENBQW1CLEtBQUsvQyxJQUF4Qjs7QUFFQSxXQUFPMEMsT0FBUDtBQUNEOztBQUVEbkIsU0FBNkI7QUFDM0IsU0FBS3RCLE1BQUwsQ0FBWWdDLE9BQVosR0FBc0IsSUFBdEI7O0FBRUEsU0FBS3hCLE1BQUwsQ0FBWXFDLE1BQVosQ0FBb0IsWUFBVyxLQUFLNUQsV0FBWSxFQUFoRDs7QUFFQSxVQUFNOEQsVUFBVSxJQUFJTCxPQUFKLENBQVlDLFdBQVc7QUFDckMsV0FBSzNDLE1BQUwsQ0FBWTRDLElBQVosQ0FBaUIsT0FBakIsRUFBMEIsTUFBTTtBQUM5QixhQUFLcEMsTUFBTCxDQUFZcUMsTUFBWixDQUFvQixzQkFBcUIsS0FBSzVELFdBQVksRUFBMUQ7QUFDQTBELGdCQUFRLElBQVI7QUFDRCxPQUhEO0FBSUQsS0FMZSxDQUFoQjs7QUFPQSxTQUFLLE1BQU1iLE9BQVgsSUFBc0IsS0FBSzFCLFFBQTNCLEVBQXFDO0FBQ25DMEIsY0FBUWtCLFNBQVIsR0FBb0IsSUFBcEI7QUFDRDs7QUFFRCxTQUFLaEQsTUFBTCxDQUFZaUQsS0FBWjs7QUFFQSxTQUFLLE1BQU12QixNQUFYLElBQXFCLEtBQUt4QixPQUExQixFQUFtQztBQUNqQyxVQUFJd0IsT0FBT0MsSUFBWCxFQUFpQjtBQUNmLGFBQUtuQixNQUFMLENBQVkyQixLQUFaLENBQW1CLDJCQUEwQlQsT0FBT1UsYUFBUCxJQUF3QixTQUFVLElBQUdWLE9BQU9XLFVBQVcsRUFBcEc7QUFDQVgsZUFBT1ksR0FBUDtBQUNEO0FBQ0Y7O0FBRUQsV0FBT1MsT0FBUDtBQUNEOztBQUVEUixXQUFTVyxHQUFULEVBQXVCQyxHQUF2QixFQUE0QztBQUFBOztBQUMxQyxVQUFNckMsUUFBUSxLQUFLQSxLQUFMLENBQVdzQyxLQUFYLENBQWlCLENBQWpCLENBQWQ7QUFDQSxVQUFNQyxVQUFVLHNCQUFZLElBQVosRUFBa0J2QyxLQUFsQixFQUF5Qm9DLEdBQXpCLEVBQThCQyxHQUE5QixDQUFoQjtBQUNBLFVBQU1HLFVBQVVDLFFBQVF6QyxLQUFSLEVBQWV1QyxPQUFmLENBQWhCOztBQUVBLFVBQU1HO0FBQUEsb0NBQU8sYUFBWTtBQUN2QixZQUFJO0FBQ0YsaUJBQUtwRCxRQUFMLENBQWN5QixHQUFkLENBQWtCd0IsUUFBUUgsR0FBMUI7QUFDQSxnQkFBTUksU0FBTjtBQUNELFNBSEQsU0FHVTtBQUNSLGlCQUFLbEQsUUFBTCxDQUFjd0IsTUFBZCxDQUFxQnlCLFFBQVFILEdBQTdCO0FBQ0Q7QUFDRixPQVBLOztBQUFBO0FBQUE7QUFBQTtBQUFBLFFBQU47O0FBU0FSLFlBQVFDLE9BQVIsQ0FBZ0JhLE1BQWhCLEVBQXdCQyxLQUF4QixDQUE4QmpDLE9BQU87QUFDbkNyQyxjQUFRVSxRQUFSLENBQWlCLE1BQU07QUFBQyxjQUFNMkIsR0FBTjtBQUFVLE9BQWxDO0FBQ0QsS0FGRDtBQUdEOztBQUVEa0MsWUFBVTtBQUNSLFdBQU87QUFDTG5ELGNBQVEsS0FBS0EsTUFEUjtBQUVMTyxhQUFPLEtBQUtBLEtBRlA7QUFHTGQsY0FBUTtBQUhILEtBQVA7QUFLRDtBQXRLc0IsQztrQkF5S1ZULFc7OztBQUVmLFNBQVNnRSxPQUFULENBQWlCekMsS0FBakIsRUFBK0J1QyxPQUEvQixFQUF1RDtBQUNyRCxRQUFNTSxXQUFXN0MsTUFBTThDLE1BQU4sRUFBakI7O0FBRUEsU0FBTyxTQUFTQyxJQUFULEdBQWdCO0FBQ3JCLFVBQU1QLFVBQVVLLFNBQVNFLElBQVQsR0FBZ0JDLEtBQWhDOztBQUVBO0FBQ0EsUUFBSSxDQUFDUixPQUFMLEVBQWM7QUFDWixZQUFNLHFCQUFhLHlCQUFiLENBQU47QUFDRDs7QUFFRCxRQUFJLE9BQU9BLE9BQVAsS0FBbUIsVUFBdkIsRUFBbUM7QUFDakMsWUFBTSxnQ0FBd0IsYUFBeEIsQ0FBTjtBQUNEOztBQUVEO0FBQ0EsV0FBT0EsUUFBUUUsSUFBUixDQUFhSCxPQUFiLEVBQXNCUSxJQUF0QixDQUFQO0FBQ0QsR0FkRDtBQWVEIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCBcIi4vdXRpbC9wb2x5ZmlsbFwiXG5cbmltcG9ydCBodHRwIGZyb20gXCJodHRwXCJcblxuaW1wb3J0IGhvc3RQa2cgZnJvbSBcIi4vdXRpbC9ob3N0LXBrZ1wiXG5cbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vdXRpbC9sb2dnZXJcIlxuaW1wb3J0IE1lbW9yeUNvbnNvbGUgZnJvbSBcIi4vdXRpbC9tZW1vcnktY29uc29sZVwiXG5pbXBvcnQgUm91dGVyIGZyb20gXCIuL3JvdXRlclwiXG5pbXBvcnQgQ29udGV4dCBmcm9tIFwiLi9jb250ZXh0XCJcblxuaW1wb3J0IHtOb3RGb3VuZCwgSW50ZXJuYWxTZXJ2ZXJFcnJvcn0gZnJvbSBcIi4vZXJyb3JzXCJcbmltcG9ydCAqIGFzIG1pZGRsZXdhcmUgZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5cbmltcG9ydCB0eXBlIHtOZXh0LCBTdGFja30gZnJvbSBcIi4vbWlkZGxld2FyZVwiXG5pbXBvcnQgdHlwZSB7UmVxdWVzdCwgUmVzcG9uc2V9IGZyb20gXCIuL2NvbnRleHRcIlxuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbk9wdGlvbnMgPSB7fFxuICBwb3J0PzogbnVtYmVyLFxuICBzZXJ2ZXI/OiBodHRwLlNlcnZlcixcbiAgbG9nZ2VyPzogTG9nZ2VyLFxuICByb3V0ZXI/OiBSb3V0ZXIsXG58fVxuXG50eXBlIElkbGluZ1NvY2tldCA9IG5ldCRTb2NrZXQgJiB7XG4gIGlkbGU/OiBib29sZWFuLFxufVxuXG50eXBlIENhbmNlbGxpbmdSZXF1ZXN0ID0gUmVxdWVzdCAmIHtcbiAgY2FuY2VsbGVkPzogYm9vbGVhbixcbn1cblxudHlwZSBDbG9zaW5nU2VydmVyID0gaHR0cC5TZXJ2ZXIgJiB7XG4gIGNsb3Npbmc/OiBib29sZWFuLFxufVxuXG5jb25zdCBkZXNjcmlwdGlvbiA9IGAke2hvc3RQa2cubmFtZX0gc2VydmljZSAke3Byb2Nlc3MuZW52LkhPU1ROQU1FIHx8IFwiXCJ9YC50cmltKClcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIHtcbiAgcG9ydDogbnVtYmVyID0gMzAwMFxuXG4gIHJvdXRlcjogUm91dGVyXG4gIGxvZ2dlcjogTG9nZ2VyXG4gIHN0YWNrOiBTdGFja1xuXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBkZXNjcmlwdGlvblxuICBzZXJ2ZXI6IENsb3NpbmdTZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcigpXG4gIHNvY2tldHM6IFNldDxJZGxpbmdTb2NrZXQ+ID0gbmV3IFNldFxuICByZXF1ZXN0czogU2V0PENhbmNlbGxpbmdSZXF1ZXN0PiA9IG5ldyBTZXRcblxuICAvKiBTdGFydCBhIG5ldyBhcHBsaWNhdGlvbiB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGluIG5leHQgdGljay4gKi9cbiAgc3RhdGljIHN0YXJ0KG9wdGlvbnM6IEFwcGxpY2F0aW9uT3B0aW9ucyA9IE9iamVjdC5zZWFsKHt9KSkge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihvcHRpb25zKVxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge2FwcC5zdGFydCgpfSlcbiAgICByZXR1cm4gYXBwXG4gIH1cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbk9wdGlvbnMgPSBPYmplY3Quc2VhbCh7fSkpIHtcbiAgICAvKiBPdmVycmlkZSBwcm9wZXJ0aWVzLiAqL1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucylcblxuICAgIC8qIEFzc2lnbiBkZWZhdWx0IGVudi4gKi9cbiAgICBpZiAoIXByb2Nlc3MuZW52Lk5PREVfRU5WKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9IFwiZGV2ZWxvcG1lbnRcIlxuICAgIH1cblxuICAgIGlmICghdGhpcy5yb3V0ZXIpIHtcbiAgICAgIHRoaXMucm91dGVyID0gbmV3IFJvdXRlclxuICAgIH1cblxuICAgIGlmICghdGhpcy5sb2dnZXIpIHtcbiAgICAgIGNvbnN0IGZvcm1hdHRlciA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIgPyBMb2dnZXIuUFJFVFRZIDogTG9nZ2VyLkpTT05cbiAgICAgIGNvbnN0IHRhcmdldCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInRlc3RcIiA/IG5ldyBNZW1vcnlDb25zb2xlIDogY29uc29sZVxuICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKHRhcmdldCwgZm9ybWF0dGVyKVxuICAgIH1cblxuICAgIC8qIEJhcmUgbWluaW11bSBzdGFjayB0byBkbyBhbnl0aGluZyB1c2VmdWwuICovXG4gICAgdGhpcy5zdGFjayA9IFtcbiAgICAgIG1pZGRsZXdhcmUubG9nKHRoaXMubG9nZ2VyKSxcbiAgICAgIG1pZGRsZXdhcmUud3JpdGUoKSxcbiAgICAgIG1pZGRsZXdhcmUucmVzY3VlKCksXG4gICAgICBtaWRkbGV3YXJlLnJvdXRlKHRoaXMucm91dGVyKSxcbiAgICBdXG5cbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG4gIH1cblxuICBzdGFydCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5zZXJ2ZXIudGltZW91dCA9IDBcblxuICAgIHByb2Nlc3Mub24oXCJTSUdURVJNXCIsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuc3RvcCgpXG4gICAgICBwcm9jZXNzLmV4aXQoMClcbiAgICB9KVxuXG4gICAgcHJvY2Vzcy5vbihcIlNJR0lOVFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDApXG4gICAgfSlcblxuICAgIHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiLCBhc3luYyAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgdGhpcy5sb2dnZXIuY3JpdGljYWwoYHVuY2F1Z2h0ICR7ZXJyLnN0YWNrfWApXG4gICAgICBhd2FpdCB0aGlzLnN0b3AoKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgfSlcblxuICAgIHRoaXMuc2VydmVyLm9uKFwiY29ubmVjdGlvblwiLCAoc29ja2V0OiBJZGxpbmdTb2NrZXQpID0+IHtcbiAgICAgIHNvY2tldC5pZGxlID0gdHJ1ZVxuXG4gICAgICBzb2NrZXQub24oXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc29ja2V0cy5kZWxldGUoc29ja2V0KVxuICAgICAgfSlcblxuICAgICAgdGhpcy5zb2NrZXRzLmFkZChzb2NrZXQpXG4gICAgfSlcblxuICAgIHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCAocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBzb2NrZXQ6IElkbGluZ1NvY2tldCA9IHJlcXVlc3Quc29ja2V0XG4gICAgICBzb2NrZXQuaWRsZSA9IGZhbHNlXG5cbiAgICAgIGlmICh0aGlzLnNlcnZlci5jbG9zaW5nKSB7XG4gICAgICAgIHJlc3BvbnNlLnJlbW92ZUhlYWRlcihcIkNvbm5lY3Rpb25cIilcbiAgICAgICAgcmVzcG9uc2Uuc2V0SGVhZGVyKFwiQ29ubmVjdGlvblwiLCBcImNsb3NlXCIpXG4gICAgICB9XG5cbiAgICAgIHJlc3BvbnNlLm9uKFwiZmluaXNoXCIsICgpID0+IHtcbiAgICAgICAgc29ja2V0LmlkbGUgPSB0cnVlXG5cbiAgICAgICAgaWYgKHRoaXMuc2VydmVyLmNsb3NpbmcpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgY2xvc2luZyBjb25uZWN0aW9uICR7c29ja2V0LnJlbW90ZUFkZHJlc3MgfHwgXCJ1bmtub3duXCJ9OiR7c29ja2V0LnJlbW90ZVBvcnR9YClcbiAgICAgICAgICBzb2NrZXQuZW5kKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gRVM3OiB0aGlzLnNlcnZlci5vbihcInJlcXVlc3RcIiwgOjp0aGlzLmRpc3BhdGNoKVxuICAgIHRoaXMuc2VydmVyLm9uKFwicmVxdWVzdFwiLCB0aGlzLmRpc3BhdGNoLmJpbmQodGhpcykpXG5cbiAgICBjb25zdCBzdGFydGVkID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwibGlzdGVuaW5nXCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5sb2dnZXIubm90aWNlKGBzdGFydGluZyAke3RoaXMuZGVzY3JpcHRpb259YClcblxuICAgIHRoaXMuc2VydmVyLmxpc3Rlbih0aGlzLnBvcnQpXG5cbiAgICByZXR1cm4gc3RhcnRlZFxuICB9XG5cbiAgc3RvcCgpOiBQcm9taXNlPEFwcGxpY2F0aW9uPiB7XG4gICAgdGhpcy5zZXJ2ZXIuY2xvc2luZyA9IHRydWVcblxuICAgIHRoaXMubG9nZ2VyLm5vdGljZShgc3RvcHBpbmcgJHt0aGlzLmRlc2NyaXB0aW9ufWApXG5cbiAgICBjb25zdCBzdG9wcGVkID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnNlcnZlci5vbmNlKFwiY2xvc2VcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5ub3RpY2UoYGdyYWNlZnVsbHkgc3RvcHBlZCAke3RoaXMuZGVzY3JpcHRpb259YClcbiAgICAgICAgcmVzb2x2ZSh0aGlzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZm9yIChjb25zdCByZXF1ZXN0IG9mIHRoaXMucmVxdWVzdHMpIHtcbiAgICAgIHJlcXVlc3QuY2FuY2VsbGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuc2VydmVyLmNsb3NlKClcblxuICAgIGZvciAoY29uc3Qgc29ja2V0IG9mIHRoaXMuc29ja2V0cykge1xuICAgICAgaWYgKHNvY2tldC5pZGxlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBjbG9zaW5nIGlkbGUgY29ubmVjdGlvbiAke3NvY2tldC5yZW1vdGVBZGRyZXNzIHx8IFwidW5rbm93blwifToke3NvY2tldC5yZW1vdGVQb3J0fWApXG4gICAgICAgIHNvY2tldC5lbmQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdG9wcGVkXG4gIH1cblxuICBkaXNwYXRjaChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFjayA9IHRoaXMuc3RhY2suc2xpY2UoMClcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IENvbnRleHQodGhpcywgc3RhY2ssIHJlcSwgcmVzKVxuICAgIGNvbnN0IGhhbmRsZXIgPSBjb21wb3NlKHN0YWNrLCBjb250ZXh0KVxuXG4gICAgY29uc3QgY2FsbCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMuYWRkKGNvbnRleHQucmVxKVxuICAgICAgICBhd2FpdCBoYW5kbGVyKClcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMucmVxdWVzdHMuZGVsZXRlKGNvbnRleHQucmVxKVxuICAgICAgfVxuICAgIH1cblxuICAgIFByb21pc2UucmVzb2x2ZShjYWxsKCkpLmNhdGNoKGVyciA9PiB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHt0aHJvdyBlcnJ9KVxuICAgIH0pXG4gIH1cblxuICBpbnNwZWN0KCkge1xuICAgIHJldHVybiB7XG4gICAgICByb3V0ZXI6IHRoaXMucm91dGVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICBzZXJ2ZXI6IFwiPG5vZGUgc2VydmVyPlwiLFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBsaWNhdGlvblxuXG5mdW5jdGlvbiBjb21wb3NlKHN0YWNrOiBTdGFjaywgY29udGV4dDogQ29udGV4dCk6IE5leHQge1xuICBjb25zdCBpdGVyYXRvciA9IHN0YWNrLnZhbHVlcygpXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgY29uc3QgaGFuZGxlciA9IGl0ZXJhdG9yLm5leHQoKS52YWx1ZVxuXG4gICAgLyogQ2hlY2sgaWYgYSBoYW5kbGVyIGlzIHByZXNlbnQgYW5kIHZhbGlkLiAqL1xuICAgIGlmICghaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IE5vdEZvdW5kKFwiRW5kcG9pbnQgZG9lcyBub3QgZXhpc3RcIilcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhyb3cgbmV3IEludGVybmFsU2VydmVyRXJyb3IoXCJCYWQgaGFuZGxlclwiKVxuICAgIH1cblxuICAgIC8vIEVTNzogcmV0dXJuIGNvbnRleHQ6OmhhbmRsZXIobmV4dClcbiAgICByZXR1cm4gaGFuZGxlci5jYWxsKGNvbnRleHQsIG5leHQpXG4gIH1cbn1cbiJdfQ==