"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseAuthorization;

var _errors = require("../errors");

function parseAuthorization() {
  return function parseAuthorization(next) {
    const ctx = this;

    const auth = this.req.headers.authorization;

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
        ctx.data.username = username || "";
        ctx.data.password = password || "";
      }
    }

    return next();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLWF1dGhvcml6YXRpb24uanMiXSwibmFtZXMiOlsicGFyc2VBdXRob3JpemF0aW9uIiwibmV4dCIsImN0eCIsImF1dGgiLCJyZXEiLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsInR5cGUiLCJjcmVkZW50aWFscyIsInNwbGl0IiwidG9Mb3dlckNhc2UiLCJkZWNvZGVkIiwiQnVmZmVyIiwiZnJvbSIsInRvU3RyaW5nIiwic2VhcmNoIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUt3QkEsa0I7O0FBSnhCOztBQUllLFNBQVNBLGtCQUFULEdBQTBDO0FBQ3ZELFNBQU8sU0FBU0Esa0JBQVQsQ0FBNEJDLElBQTVCLEVBQXdDO0FBQzdDLFVBQU1DLE1BQWUsSUFBckI7O0FBRUEsVUFBTUMsT0FBTyxLQUFLQyxHQUFMLENBQVNDLE9BQVQsQ0FBaUJDLGFBQTlCOztBQUVBLFFBQUlILElBQUosRUFBVTtBQUNSLFlBQU0sQ0FBQ0ksSUFBRCxFQUFPQyxXQUFQLElBQXNCTCxLQUFLTSxLQUFMLENBQVcsS0FBWCxDQUE1Qjs7QUFFQSxVQUFJRixLQUFLRyxXQUFMLE9BQXVCLE9BQXZCLElBQWtDRixXQUF0QyxFQUFtRDtBQUNqRCxjQUFNRyxVQUFVQyxPQUFPQyxJQUFQLENBQVlMLFdBQVosRUFBeUIsUUFBekIsRUFBbUNNLFFBQW5DLENBQTRDLE1BQTVDLENBQWhCOztBQUVBOztBQUVBLFlBQUlILFFBQVFJLE1BQVIsQ0FBZSxhQUFmLEtBQWlDLENBQXJDLEVBQXdDO0FBQ3RDLGdCQUFNLHVCQUFlLDBCQUFmLENBQU47QUFDRDs7QUFFRCxjQUFNLENBQUNDLFFBQUQsRUFBV0MsUUFBWCxJQUF1Qk4sUUFBUUYsS0FBUixDQUFjLEdBQWQsQ0FBN0I7QUFDQVAsWUFBSWdCLElBQUosQ0FBU0YsUUFBVCxHQUFvQkEsWUFBWSxFQUFoQztBQUNBZCxZQUFJZ0IsSUFBSixDQUFTRCxRQUFULEdBQW9CQSxZQUFZLEVBQWhDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPaEIsTUFBUDtBQUNELEdBeEJEO0FBeUJEIiwiZmlsZSI6InBhcnNlLWF1dGhvcml6YXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHtCYWRSZXF1ZXN0fSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VBdXRob3JpemF0aW9uKCk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gZnVuY3Rpb24gcGFyc2VBdXRob3JpemF0aW9uKG5leHQ6IE5leHQpIHtcbiAgICBjb25zdCBjdHg6IENvbnRleHQgPSB0aGlzXG5cbiAgICBjb25zdCBhdXRoID0gdGhpcy5yZXEuaGVhZGVycy5hdXRob3JpemF0aW9uXG5cbiAgICBpZiAoYXV0aCkge1xuICAgICAgY29uc3QgW3R5cGUsIGNyZWRlbnRpYWxzXSA9IGF1dGguc3BsaXQoL1xccysvKVxuXG4gICAgICBpZiAodHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImJhc2ljXCIgJiYgY3JlZGVudGlhbHMpIHtcbiAgICAgICAgY29uc3QgZGVjb2RlZCA9IEJ1ZmZlci5mcm9tKGNyZWRlbnRpYWxzLCBcImJhc2U2NFwiKS50b1N0cmluZyhcInV0ZjhcIilcblxuICAgICAgICAvKiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzYxNyNzZWN0aW9uLTIuMTpcbiAgICAgICAgICAgXCJUaGUgdXNlci1pZCBhbmQgcGFzc3dvcmQgTVVTVCBOT1QgY29udGFpbiBhbnkgY29udHJvbCBjaGFyYWN0ZXJzXCIgKi9cbiAgICAgICAgaWYgKGRlY29kZWQuc2VhcmNoKC9bXFx4MDAtXFx4MUZdLykgPj0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KFwiQmFkIGF1dGhvcml6YXRpb24gaGVhZGVyXCIpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbdXNlcm5hbWUsIHBhc3N3b3JkXSA9IGRlY29kZWQuc3BsaXQoXCI6XCIpXG4gICAgICAgIGN0eC5kYXRhLnVzZXJuYW1lID0gdXNlcm5hbWUgfHwgXCJcIlxuICAgICAgICBjdHguZGF0YS5wYXNzd29yZCA9IHBhc3N3b3JkIHx8IFwiXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dCgpXG4gIH1cbn1cbiJdfQ==