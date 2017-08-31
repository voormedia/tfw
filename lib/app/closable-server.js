"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClosableServer = undefined;

var _http = require("http");

let ClosableServer = exports.ClosableServer = class ClosableServer extends _http.Server {

  constructor() {
    super();

    this.closing = false;
    this.sockets = new Map();
    this.on("connection", socket => {
      this.sockets.set(socket, 0);

      socket.on("close", () => {
        this.sockets.delete(socket);
      });
    });

    this.on("request", (request, response) => {
      const socket = request.socket;
      this.sockets.set(socket, +this.sockets.get(socket) + 1);

      if (this.closing) {
        response.setHeader("Connection", "close");
      }

      response.on("finish", () => {
        const pending = +this.sockets.get(socket) - 1;
        this.sockets.set(socket, pending);

        if (this.closing && pending === 0) {
          socket.end();
        }
      });
    });
  }

  close(callback) {
    super.close(callback);

    this.closing = true;

    process.nextTick(() => {
      for (const [socket, pending] of this.sockets) {
        if (pending === 0) {
          socket.end();
        }
      }
    });

    return this;
  }
};
exports.default = ClosableServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAvY2xvc2FibGUtc2VydmVyLmpzIl0sIm5hbWVzIjpbIkNsb3NhYmxlU2VydmVyIiwiY29uc3RydWN0b3IiLCJjbG9zaW5nIiwic29ja2V0cyIsIk1hcCIsIm9uIiwic29ja2V0Iiwic2V0IiwiZGVsZXRlIiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZ2V0Iiwic2V0SGVhZGVyIiwicGVuZGluZyIsImVuZCIsImNsb3NlIiwiY2FsbGJhY2siLCJwcm9jZXNzIiwibmV4dFRpY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7SUFNYUEsYyxXQUFBQSxjLEdBQU4sTUFBTUEsY0FBTixzQkFBb0M7O0FBSXpDQyxnQkFBYztBQUNaOztBQURZLFNBSGRDLE9BR2MsR0FISyxLQUdMO0FBQUEsU0FGZEMsT0FFYyxHQUZpQixJQUFJQyxHQUFKLEVBRWpCO0FBR1osU0FBS0MsRUFBTCxDQUFRLFlBQVIsRUFBdUJDLE1BQUQsSUFBb0I7QUFDeEMsV0FBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCRCxNQUFqQixFQUF5QixDQUF6Qjs7QUFFQUEsYUFBT0QsRUFBUCxDQUFVLE9BQVYsRUFBbUIsTUFBTTtBQUN2QixhQUFLRixPQUFMLENBQWFLLE1BQWIsQ0FBb0JGLE1BQXBCO0FBQ0QsT0FGRDtBQUdELEtBTkQ7O0FBUUEsU0FBS0QsRUFBTCxDQUFRLFNBQVIsRUFBbUIsQ0FBQ0ksT0FBRCxFQUEyQkMsUUFBM0IsS0FBd0Q7QUFDekUsWUFBTUosU0FBU0csUUFBUUgsTUFBdkI7QUFDQSxXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUJELE1BQWpCLEVBQXlCLENBQUMsS0FBS0gsT0FBTCxDQUFhUSxHQUFiLENBQWlCTCxNQUFqQixDQUFELEdBQTRCLENBQXJEOztBQUVBLFVBQUksS0FBS0osT0FBVCxFQUFrQjtBQUNoQlEsaUJBQVNFLFNBQVQsQ0FBbUIsWUFBbkIsRUFBaUMsT0FBakM7QUFDRDs7QUFFREYsZUFBU0wsRUFBVCxDQUFZLFFBQVosRUFBc0IsTUFBTTtBQUMxQixjQUFNUSxVQUFVLENBQUMsS0FBS1YsT0FBTCxDQUFhUSxHQUFiLENBQWlCTCxNQUFqQixDQUFELEdBQTRCLENBQTVDO0FBQ0EsYUFBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCRCxNQUFqQixFQUF5Qk8sT0FBekI7O0FBRUEsWUFBSSxLQUFLWCxPQUFMLElBQWdCVyxZQUFZLENBQWhDLEVBQW1DO0FBQ2pDUCxpQkFBT1EsR0FBUDtBQUNEO0FBQ0YsT0FQRDtBQVFELEtBaEJEO0FBaUJEOztBQUVEQyxRQUFNQyxRQUFOLEVBQTJEO0FBQ3pELFVBQU1ELEtBQU4sQ0FBWUMsUUFBWjs7QUFFQSxTQUFLZCxPQUFMLEdBQWUsSUFBZjs7QUFFQWUsWUFBUUMsUUFBUixDQUFpQixNQUFNO0FBQ3JCLFdBQUssTUFBTSxDQUFDWixNQUFELEVBQVNPLE9BQVQsQ0FBWCxJQUFnQyxLQUFLVixPQUFyQyxFQUE4QztBQUM1QyxZQUFJVSxZQUFZLENBQWhCLEVBQW1CO0FBQ2pCUCxpQkFBT1EsR0FBUDtBQUNEO0FBQ0Y7QUFDRixLQU5EOztBQVFBLFdBQU8sSUFBUDtBQUNEO0FBaER3QyxDO2tCQW1ENUJkLGMiLCJmaWxlIjoiY2xvc2FibGUtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCB7U2VydmVyfSBmcm9tIFwiaHR0cFwiXG5cbmltcG9ydCB0eXBlIHtJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlfSBmcm9tIFwiaHR0cFwiXG5cbnR5cGUgU29ja2V0ID0gbmV0JFNvY2tldFxuXG5leHBvcnQgY2xhc3MgQ2xvc2FibGVTZXJ2ZXIgZXh0ZW5kcyBTZXJ2ZXIge1xuICBjbG9zaW5nOiBib29sZWFuID0gZmFsc2VcbiAgc29ja2V0czogTWFwPFNvY2tldCwgbnVtYmVyPiA9IG5ldyBNYXBcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLm9uKFwiY29ubmVjdGlvblwiLCAoc29ja2V0OiBTb2NrZXQpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0cy5zZXQoc29ja2V0LCAwKVxuXG4gICAgICBzb2NrZXQub24oXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc29ja2V0cy5kZWxldGUoc29ja2V0KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbihcInJlcXVlc3RcIiwgKHJlcXVlc3Q6IEluY29taW5nTWVzc2FnZSwgcmVzcG9uc2U6IFNlcnZlclJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBzb2NrZXQgPSByZXF1ZXN0LnNvY2tldFxuICAgICAgdGhpcy5zb2NrZXRzLnNldChzb2NrZXQsICt0aGlzLnNvY2tldHMuZ2V0KHNvY2tldCkgKyAxKVxuXG4gICAgICBpZiAodGhpcy5jbG9zaW5nKSB7XG4gICAgICAgIHJlc3BvbnNlLnNldEhlYWRlcihcIkNvbm5lY3Rpb25cIiwgXCJjbG9zZVwiKVxuICAgICAgfVxuXG4gICAgICByZXNwb25zZS5vbihcImZpbmlzaFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBlbmRpbmcgPSArdGhpcy5zb2NrZXRzLmdldChzb2NrZXQpIC0gMVxuICAgICAgICB0aGlzLnNvY2tldHMuc2V0KHNvY2tldCwgcGVuZGluZylcblxuICAgICAgICBpZiAodGhpcy5jbG9zaW5nICYmIHBlbmRpbmcgPT09IDApIHtcbiAgICAgICAgICBzb2NrZXQuZW5kKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY2xvc2UoY2FsbGJhY2s/OiAoZXJyb3I6ID9FcnJvcikgPT4gbWl4ZWQpOiBDbG9zYWJsZVNlcnZlciB7XG4gICAgc3VwZXIuY2xvc2UoY2FsbGJhY2spXG5cbiAgICB0aGlzLmNsb3NpbmcgPSB0cnVlXG5cbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgW3NvY2tldCwgcGVuZGluZ10gb2YgdGhpcy5zb2NrZXRzKSB7XG4gICAgICAgIGlmIChwZW5kaW5nID09PSAwKSB7XG4gICAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbG9zYWJsZVNlcnZlclxuIl19