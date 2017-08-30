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

    for (const [socket, pending] of this.sockets) {
      if (pending === 0) {
        socket.end();
      }
    }

    return this;
  }
};
exports.default = ClosableServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2Nsb3NhYmxlLXNlcnZlci5qcyJdLCJuYW1lcyI6WyJDbG9zYWJsZVNlcnZlciIsImNvbnN0cnVjdG9yIiwiY2xvc2luZyIsInNvY2tldHMiLCJNYXAiLCJvbiIsInNvY2tldCIsInNldCIsImRlbGV0ZSIsInJlcXVlc3QiLCJyZXNwb25zZSIsImdldCIsInNldEhlYWRlciIsInBlbmRpbmciLCJlbmQiLCJjbG9zZSIsImNhbGxiYWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0lBTWFBLGMsV0FBQUEsYyxHQUFOLE1BQU1BLGNBQU4sc0JBQW9DOztBQUl6Q0MsZ0JBQWM7QUFDWjs7QUFEWSxTQUhkQyxPQUdjLEdBSEssS0FHTDtBQUFBLFNBRmRDLE9BRWMsR0FGaUIsSUFBSUMsR0FBSixFQUVqQjtBQUdaLFNBQUtDLEVBQUwsQ0FBUSxZQUFSLEVBQXVCQyxNQUFELElBQW9CO0FBQ3hDLFdBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQkQsTUFBakIsRUFBeUIsQ0FBekI7O0FBRUFBLGFBQU9ELEVBQVAsQ0FBVSxPQUFWLEVBQW1CLE1BQU07QUFDdkIsYUFBS0YsT0FBTCxDQUFhSyxNQUFiLENBQW9CRixNQUFwQjtBQUNELE9BRkQ7QUFHRCxLQU5EOztBQVFBLFNBQUtELEVBQUwsQ0FBUSxTQUFSLEVBQW1CLENBQUNJLE9BQUQsRUFBMkJDLFFBQTNCLEtBQXdEO0FBQ3pFLFlBQU1KLFNBQVNHLFFBQVFILE1BQXZCO0FBQ0EsV0FBS0gsT0FBTCxDQUFhSSxHQUFiLENBQWlCRCxNQUFqQixFQUF5QixDQUFDLEtBQUtILE9BQUwsQ0FBYVEsR0FBYixDQUFpQkwsTUFBakIsQ0FBRCxHQUE0QixDQUFyRDs7QUFFQSxVQUFJLEtBQUtKLE9BQVQsRUFBa0I7QUFDaEJRLGlCQUFTRSxTQUFULENBQW1CLFlBQW5CLEVBQWlDLE9BQWpDO0FBQ0Q7O0FBRURGLGVBQVNMLEVBQVQsQ0FBWSxRQUFaLEVBQXNCLE1BQU07QUFDMUIsY0FBTVEsVUFBVSxDQUFDLEtBQUtWLE9BQUwsQ0FBYVEsR0FBYixDQUFpQkwsTUFBakIsQ0FBRCxHQUE0QixDQUE1QztBQUNBLGFBQUtILE9BQUwsQ0FBYUksR0FBYixDQUFpQkQsTUFBakIsRUFBeUJPLE9BQXpCOztBQUVBLFlBQUksS0FBS1gsT0FBTCxJQUFnQlcsWUFBWSxDQUFoQyxFQUFtQztBQUNqQ1AsaUJBQU9RLEdBQVA7QUFDRDtBQUNGLE9BUEQ7QUFRRCxLQWhCRDtBQWlCRDs7QUFFREMsUUFBTUMsUUFBTixFQUEyRDtBQUN6RCxVQUFNRCxLQUFOLENBQVlDLFFBQVo7O0FBRUEsU0FBS2QsT0FBTCxHQUFlLElBQWY7O0FBRUEsU0FBSyxNQUFNLENBQUNJLE1BQUQsRUFBU08sT0FBVCxDQUFYLElBQWdDLEtBQUtWLE9BQXJDLEVBQThDO0FBQzVDLFVBQUlVLFlBQVksQ0FBaEIsRUFBbUI7QUFDakJQLGVBQU9RLEdBQVA7QUFDRDtBQUNGOztBQUVELFdBQU8sSUFBUDtBQUNEO0FBOUN3QyxDO2tCQWlENUJkLGMiLCJmaWxlIjoiY2xvc2FibGUtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCB7U2VydmVyfSBmcm9tIFwiaHR0cFwiXG5cbmltcG9ydCB0eXBlIHtJbmNvbWluZ01lc3NhZ2UsIFNlcnZlclJlc3BvbnNlfSBmcm9tIFwiaHR0cFwiXG5cbnR5cGUgU29ja2V0ID0gbmV0JFNvY2tldFxuXG5leHBvcnQgY2xhc3MgQ2xvc2FibGVTZXJ2ZXIgZXh0ZW5kcyBTZXJ2ZXIge1xuICBjbG9zaW5nOiBib29sZWFuID0gZmFsc2VcbiAgc29ja2V0czogTWFwPFNvY2tldCwgbnVtYmVyPiA9IG5ldyBNYXBcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLm9uKFwiY29ubmVjdGlvblwiLCAoc29ja2V0OiBTb2NrZXQpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0cy5zZXQoc29ja2V0LCAwKVxuXG4gICAgICBzb2NrZXQub24oXCJjbG9zZVwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc29ja2V0cy5kZWxldGUoc29ja2V0KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbihcInJlcXVlc3RcIiwgKHJlcXVlc3Q6IEluY29taW5nTWVzc2FnZSwgcmVzcG9uc2U6IFNlcnZlclJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zdCBzb2NrZXQgPSByZXF1ZXN0LnNvY2tldFxuICAgICAgdGhpcy5zb2NrZXRzLnNldChzb2NrZXQsICt0aGlzLnNvY2tldHMuZ2V0KHNvY2tldCkgKyAxKVxuXG4gICAgICBpZiAodGhpcy5jbG9zaW5nKSB7XG4gICAgICAgIHJlc3BvbnNlLnNldEhlYWRlcihcIkNvbm5lY3Rpb25cIiwgXCJjbG9zZVwiKVxuICAgICAgfVxuXG4gICAgICByZXNwb25zZS5vbihcImZpbmlzaFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBlbmRpbmcgPSArdGhpcy5zb2NrZXRzLmdldChzb2NrZXQpIC0gMVxuICAgICAgICB0aGlzLnNvY2tldHMuc2V0KHNvY2tldCwgcGVuZGluZylcblxuICAgICAgICBpZiAodGhpcy5jbG9zaW5nICYmIHBlbmRpbmcgPT09IDApIHtcbiAgICAgICAgICBzb2NrZXQuZW5kKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY2xvc2UoY2FsbGJhY2s/OiAoZXJyb3I6ID9FcnJvcikgPT4gbWl4ZWQpOiBDbG9zYWJsZVNlcnZlciB7XG4gICAgc3VwZXIuY2xvc2UoY2FsbGJhY2spXG5cbiAgICB0aGlzLmNsb3NpbmcgPSB0cnVlXG5cbiAgICBmb3IgKGNvbnN0IFtzb2NrZXQsIHBlbmRpbmddIG9mIHRoaXMuc29ja2V0cykge1xuICAgICAgaWYgKHBlbmRpbmcgPT09IDApIHtcbiAgICAgICAgc29ja2V0LmVuZCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbG9zYWJsZVNlcnZlclxuIl19