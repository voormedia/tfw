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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWF1dGhvcml6YXRpb24uanMiXSwibmFtZXMiOlsicGFyc2VBdXRob3JpemF0aW9uIiwibmV4dCIsImF1dGgiLCJnZXQiLCJ0eXBlIiwiY3JlZGVudGlhbHMiLCJzcGxpdCIsInRvTG93ZXJDYXNlIiwiZGVjb2RlZCIsIkJ1ZmZlciIsImZyb20iLCJ0b1N0cmluZyIsInNlYXJjaCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFNd0JBLGtCOztBQUp4Qjs7QUFJZSxTQUFTQSxrQkFBVCxHQUEwQztBQUN2RCxTQUFPLFNBQVNBLGtCQUFULENBQTRCQyxJQUE1QixFQUF3QztBQUM1QyxRQUFEOztBQUVBLFVBQU1DLE9BQU8sS0FBS0MsR0FBTCxDQUFTLGVBQVQsQ0FBYjs7QUFFQSxRQUFJRCxJQUFKLEVBQVU7QUFDUixZQUFNLENBQUNFLElBQUQsRUFBT0MsV0FBUCxJQUFzQkgsS0FBS0ksS0FBTCxDQUFXLEtBQVgsQ0FBNUI7O0FBRUEsVUFBSUYsS0FBS0csV0FBTCxPQUF1QixPQUF2QixJQUFrQ0YsV0FBdEMsRUFBbUQ7QUFDakQsY0FBTUcsVUFBVUMsT0FBT0MsSUFBUCxDQUFZTCxXQUFaLEVBQXlCLFFBQXpCLEVBQW1DTSxRQUFuQyxDQUE0QyxNQUE1QyxDQUFoQjs7QUFFQTs7QUFFQSxZQUFJSCxRQUFRSSxNQUFSLENBQWUsYUFBZixLQUFpQyxDQUFyQyxFQUF3QztBQUN0QyxnQkFBTSx1QkFBZSwwQkFBZixDQUFOO0FBQ0Q7O0FBRUQsY0FBTSxDQUFDQyxRQUFELEVBQVdDLFFBQVgsSUFBdUJOLFFBQVFGLEtBQVIsQ0FBYyxHQUFkLENBQTdCO0FBQ0EsYUFBS1MsSUFBTCxDQUFVRixRQUFWLEdBQXFCQSxZQUFZLEVBQWpDO0FBQ0EsYUFBS0UsSUFBTCxDQUFVRCxRQUFWLEdBQXFCQSxZQUFZLEVBQWpDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPYixNQUFQO0FBQ0QsR0F4QkQ7QUF5QkQ7QUEvQkQiLCJmaWxlIjoicGFyc2UtYXV0aG9yaXphdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCB7QmFkUmVxdWVzdH0gZnJvbSBcIi4uL2Vycm9yc1wiXG5cbmltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlQXV0aG9yaXphdGlvbigpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHBhcnNlQXV0aG9yaXphdGlvbihuZXh0OiBOZXh0KSB7XG4gICAgKHRoaXM6IENvbnRleHQpXG5cbiAgICBjb25zdCBhdXRoID0gdGhpcy5nZXQoXCJhdXRob3JpemF0aW9uXCIpXG5cbiAgICBpZiAoYXV0aCkge1xuICAgICAgY29uc3QgW3R5cGUsIGNyZWRlbnRpYWxzXSA9IGF1dGguc3BsaXQoL1xccysvKVxuXG4gICAgICBpZiAodHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImJhc2ljXCIgJiYgY3JlZGVudGlhbHMpIHtcbiAgICAgICAgY29uc3QgZGVjb2RlZCA9IEJ1ZmZlci5mcm9tKGNyZWRlbnRpYWxzLCBcImJhc2U2NFwiKS50b1N0cmluZyhcInV0ZjhcIilcblxuICAgICAgICAvKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzYxNyNzZWN0aW9uLTIuMTpcbiAgICAgICAgICAgXCJUaGUgdXNlci1pZCBhbmQgcGFzc3dvcmQgTVVTVCBOT1QgY29udGFpbiBhbnkgY29udHJvbCBjaGFyYWN0ZXJzXCIgKi9cbiAgICAgICAgaWYgKGRlY29kZWQuc2VhcmNoKC9bXFx4MDAtXFx4MUZdLykgPj0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KFwiQmFkIGF1dGhvcml6YXRpb24gaGVhZGVyXCIpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbdXNlcm5hbWUsIHBhc3N3b3JkXSA9IGRlY29kZWQuc3BsaXQoXCI6XCIpXG4gICAgICAgIHRoaXMuZGF0YS51c2VybmFtZSA9IHVzZXJuYW1lIHx8IFwiXCJcbiAgICAgICAgdGhpcy5kYXRhLnBhc3N3b3JkID0gcGFzc3dvcmQgfHwgXCJcIlxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXh0KClcbiAgfVxufVxuIl19