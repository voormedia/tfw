"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _http = require("http");

let ClosableServer = class ClosableServer extends _http.Server {

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

    for (const [socket, pending] of this.sockets) {
      if (pending === 0) {
        socket.end();
      }
    }

    return this;
  }
};
exports.default = ClosableServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2Nsb3NhYmxlLXNlcnZlci5qcyJdLCJuYW1lcyI6WyJDbG9zYWJsZVNlcnZlciIsImNvbnN0cnVjdG9yIiwiY2xvc2luZyIsInNvY2tldHMiLCJNYXAiLCJvbiIsInNvY2tldCIsInNldCIsImRlbGV0ZSIsInJlcXVlc3QiLCJyZXNwb25zZSIsImdldCIsInNldEhlYWRlciIsInBlbmRpbmciLCJlbmQiLCJjbG9zZSIsImNhbGxiYWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0lBTXFCQSxjLEdBQU4sTUFBTUEsY0FBTixzQkFBb0M7O0FBSWpEQyxnQkFBYztBQUNaOztBQURZLFNBSGRDLE9BR2MsR0FISyxLQUdMO0FBQUEsU0FGZEMsT0FFYyxHQUZpQixJQUFJQyxHQUFKLEVBRWpCO0FBR1osU0FBS0MsRUFBTCxDQUFRLFlBQVIsRUFBdUJDLE1BQUQsSUFBb0I7QUFDeEMsV0FBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCRCxNQUFqQixFQUF5QixDQUF6Qjs7QUFFQUEsYUFBT0QsRUFBUCxDQUFVLE9BQVYsRUFBbUIsTUFBTTtBQUN2QixhQUFLRixPQUFMLENBQWFLLE1BQWIsQ0FBb0JGLE1BQXBCO0FBQ0QsT0FGRDtBQUdELEtBTkQ7O0FBUUEsU0FBS0QsRUFBTCxDQUFRLFNBQVIsRUFBbUIsQ0FBQ0ksT0FBRCxFQUEyQkMsUUFBM0IsS0FBd0Q7QUFDekUsWUFBTUosU0FBU0csUUFBUUgsTUFBdkI7QUFDQSxXQUFLSCxPQUFMLENBQWFJLEdBQWIsQ0FBaUJELE1BQWpCLEVBQXlCLENBQUMsS0FBS0gsT0FBTCxDQUFhUSxHQUFiLENBQWlCTCxNQUFqQixDQUFELEdBQTRCLENBQXJEOztBQUVBLFVBQUksS0FBS0osT0FBVCxFQUFrQjtBQUNoQlEsaUJBQVNFLFNBQVQsQ0FBbUIsWUFBbkIsRUFBaUMsT0FBakM7QUFDRDs7QUFFREYsZUFBU0wsRUFBVCxDQUFZLFFBQVosRUFBc0IsTUFBTTtBQUMxQixjQUFNUSxVQUFVLENBQUMsS0FBS1YsT0FBTCxDQUFhUSxHQUFiLENBQWlCTCxNQUFqQixDQUFELEdBQTRCLENBQTVDO0FBQ0EsYUFBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCRCxNQUFqQixFQUF5Qk8sT0FBekI7O0FBRUEsWUFBSSxLQUFLWCxPQUFMLElBQWdCVyxZQUFZLENBQWhDLEVBQW1DO0FBQ2pDUCxpQkFBT1EsR0FBUDtBQUNEO0FBQ0YsT0FQRDtBQVFELEtBaEJEO0FBaUJEOztBQUVEQyxRQUFNQyxRQUFOLEVBQTJEO0FBQ3pELFVBQU1ELEtBQU4sQ0FBWUMsUUFBWjs7QUFFQSxTQUFLZCxPQUFMLEdBQWUsSUFBZjs7QUFFQSxTQUFLLE1BQU0sQ0FBQ0ksTUFBRCxFQUFTTyxPQUFULENBQVgsSUFBZ0MsS0FBS1YsT0FBckMsRUFBOEM7QUFDNUMsVUFBSVUsWUFBWSxDQUFoQixFQUFtQjtBQUNqQlAsZUFBT1EsR0FBUDtBQUNEO0FBQ0Y7O0FBRUQsV0FBTyxJQUFQO0FBQ0Q7QUE5Q2dELEM7a0JBQTlCZCxjIiwiZmlsZSI6ImNsb3NhYmxlLXNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQge1NlcnZlcn0gZnJvbSBcImh0dHBcIlxuXG5pbXBvcnQgdHlwZSB7SW5jb21pbmdNZXNzYWdlLCBTZXJ2ZXJSZXNwb25zZX0gZnJvbSBcImh0dHBcIlxuXG50eXBlIFNvY2tldCA9IG5ldCRTb2NrZXRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xvc2FibGVTZXJ2ZXIgZXh0ZW5kcyBTZXJ2ZXIge1xuICBjbG9zaW5nOiBib29sZWFuID0gZmFsc2VcbiAgc29ja2V0czogTWFwPFNvY2tldCwgbnVtYmVyPiA9IG5ldyBNYXBcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLm9uKFwiY29ubmVjdGlvblwiLCAoc29ja2V0OiBTb2NrZXQpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0cy5zZXQoc29ja2V0LCAwKVxuXG4gICAgICBzb2NrZXQub24oXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc29ja2V0cy5kZWxldGUoc29ja2V0KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbihcInJlcXVlc3RcIiwgKHJlcXVlc3Q6IEluY29taW5nTWVzc2FnZSwgcmVzcG9uc2U6IFNlcnZlclJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBzb2NrZXQgPSByZXF1ZXN0LnNvY2tldFxuICAgICAgdGhpcy5zb2NrZXRzLnNldChzb2NrZXQsICt0aGlzLnNvY2tldHMuZ2V0KHNvY2tldCkgKyAxKVxuXG4gICAgICBpZiAodGhpcy5jbG9zaW5nKSB7XG4gICAgICAgIHJlc3BvbnNlLnNldEhlYWRlcihcIkNvbm5lY3Rpb25cIiwgXCJjbG9zZVwiKVxuICAgICAgfVxuXG4gICAgICByZXNwb25zZS5vbihcImZpbmlzaFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBlbmRpbmcgPSArdGhpcy5zb2NrZXRzLmdldChzb2NrZXQpIC0gMVxuICAgICAgICB0aGlzLnNvY2tldHMuc2V0KHNvY2tldCwgcGVuZGluZylcblxuICAgICAgICBpZiAodGhpcy5jbG9zaW5nICYmIHBlbmRpbmcgPT09IDApIHtcbiAgICAgICAgICBzb2NrZXQuZW5kKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY2xvc2UoY2FsbGJhY2s/OiAoZXJyb3I6ID9FcnJvcikgPT4gbWl4ZWQpOiBDbG9zYWJsZVNlcnZlciB7XG4gICAgc3VwZXIuY2xvc2UoY2FsbGJhY2spXG5cbiAgICB0aGlzLmNsb3NpbmcgPSB0cnVlXG5cbiAgICBmb3IgKGNvbnN0IFtzb2NrZXQsIHBlbmRpbmddIG9mIHRoaXMuc29ja2V0cykge1xuICAgICAgaWYgKHBlbmRpbmcgPT09IDApIHtcbiAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIl19