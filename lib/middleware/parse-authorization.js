"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseAuthorization;

var _errors = require("../errors");

function parseAuthorization() {
  return function parseAuthorization(next) {
    this;

    const auth = this.get("authorization");

    if (auth) {
      const [type, credentials] = auth.split(/\s+/);

      if (type.toLowerCase() === "basic" && credentials) {
        const decoded = Buffer.from(credentials, "base64").toString("utf8");

        /* https://tools.ietf.org/html/rfc7617#section-2.1:
           "The user-id and password MUST NOT contain any control characters" */
        if (decoded.search(/[\x00-\x1F]/) >= 0) {
          throw new _errors.BadRequest("Bad authorization header");
        }

        const [username, password] = decoded.split(":");
        this.data.username = username || "";
        this.data.password = password || "";
      }
    }

    return next();
  };
}
/* eslint-disable no-unused-expressions */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWF1dGhvcml6YXRpb24uanMiXSwibmFtZXMiOlsicGFyc2VBdXRob3JpemF0aW9uIiwibmV4dCIsImF1dGgiLCJnZXQiLCJ0eXBlIiwiY3JlZGVudGlhbHMiLCJzcGxpdCIsInRvTG93ZXJDYXNlIiwiZGVjb2RlZCIsIkJ1ZmZlciIsImZyb20iLCJ0b1N0cmluZyIsInNlYXJjaCIsIkJhZFJlcXVlc3QiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBTXdCQSxrQjs7QUFKeEI7O0FBSWUsU0FBU0Esa0JBQVQsR0FBMEM7QUFDdkQsU0FBTyxTQUFTQSxrQkFBVCxDQUE0QkMsSUFBNUIsRUFBd0M7QUFDNUMsUUFBRDs7QUFFQSxVQUFNQyxPQUFPLEtBQUtDLEdBQUwsQ0FBUyxlQUFULENBQWI7O0FBRUEsUUFBSUQsSUFBSixFQUFVO0FBQ1IsWUFBTSxDQUFDRSxJQUFELEVBQU9DLFdBQVAsSUFBc0JILEtBQUtJLEtBQUwsQ0FBVyxLQUFYLENBQTVCOztBQUVBLFVBQUlGLEtBQUtHLFdBQUwsT0FBdUIsT0FBdkIsSUFBa0NGLFdBQXRDLEVBQW1EO0FBQ2pELGNBQU1HLFVBQVVDLE9BQU9DLElBQVAsQ0FBWUwsV0FBWixFQUF5QixRQUF6QixFQUFtQ00sUUFBbkMsQ0FBNEMsTUFBNUMsQ0FBaEI7O0FBRUE7O0FBRUEsWUFBSUgsUUFBUUksTUFBUixDQUFlLGFBQWYsS0FBaUMsQ0FBckMsRUFBd0M7QUFDdEMsZ0JBQU0sSUFBSUMsa0JBQUosQ0FBZSwwQkFBZixDQUFOO0FBQ0Q7O0FBRUQsY0FBTSxDQUFDQyxRQUFELEVBQVdDLFFBQVgsSUFBdUJQLFFBQVFGLEtBQVIsQ0FBYyxHQUFkLENBQTdCO0FBQ0EsYUFBS1UsSUFBTCxDQUFVRixRQUFWLEdBQXFCQSxZQUFZLEVBQWpDO0FBQ0EsYUFBS0UsSUFBTCxDQUFVRCxRQUFWLEdBQXFCQSxZQUFZLEVBQWpDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPZCxNQUFQO0FBQ0QsR0F4QkQ7QUF5QkQ7QUEvQkQiLCJmaWxlIjoicGFyc2UtYXV0aG9yaXphdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCB7QmFkUmVxdWVzdH0gZnJvbSBcIi4uL2Vycm9yc1wiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlQXV0aG9yaXphdGlvbigpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHBhcnNlQXV0aG9yaXphdGlvbihuZXh0OiBOZXh0KSB7XG4gICAgKHRoaXM6IENvbnRleHQpXG5cbiAgICBjb25zdCBhdXRoID0gdGhpcy5nZXQoXCJhdXRob3JpemF0aW9uXCIpXG5cbiAgICBpZiAoYXV0aCkge1xuICAgICAgY29uc3QgW3R5cGUsIGNyZWRlbnRpYWxzXSA9IGF1dGguc3BsaXQoL1xccysvKVxuXG4gICAgICBpZiAodHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImJhc2ljXCIgJiYgY3JlZGVudGlhbHMpIHtcbiAgICAgICAgY29uc3QgZGVjb2RlZCA9IEJ1ZmZlci5mcm9tKGNyZWRlbnRpYWxzLCBcImJhc2U2NFwiKS50b1N0cmluZyhcInV0ZjhcIilcblxuICAgICAgICAvKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzYxNyNzZWN0aW9uLTIuMTpcbiAgICAgICAgICAgXCJUaGUgdXNlci1pZCBhbmQgcGFzc3dvcmQgTVVTVCBOT1QgY29udGFpbiBhbnkgY29udHJvbCBjaGFyYWN0ZXJzXCIgKi9cbiAgICAgICAgaWYgKGRlY29kZWQuc2VhcmNoKC9bXFx4MDAtXFx4MUZdLykgPj0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KFwiQmFkIGF1dGhvcml6YXRpb24gaGVhZGVyXCIpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbdXNlcm5hbWUsIHBhc3N3b3JkXSA9IGRlY29kZWQuc3BsaXQoXCI6XCIpXG4gICAgICAgIHRoaXMuZGF0YS51c2VybmFtZSA9IHVzZXJuYW1lIHx8IFwiXCJcbiAgICAgICAgdGhpcy5kYXRhLnBhc3N3b3JkID0gcGFzc3dvcmQgfHwgXCJcIlxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXh0KClcbiAgfVxufVxuIl19