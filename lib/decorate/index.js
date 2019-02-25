"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _resource = require("./resource");

Object.keys(_resource).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _resource[key];
    }
  });
});

var _route = require("./route");

Object.keys(_route).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _route[key];
    }
  });
});

var _start = require("./start");

Object.keys(_start).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _start[key];
    }
  });
});

var _use = require("./use");

Object.keys(_use).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _use[key];
    }
  });
});

var _when = require("./when");

Object.keys(_when).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _when[key];
    }
  });
});
exports.allowCors = allowCors;
exports.connect = connect;
exports.exposeAllErrors = exposeAllErrors;
exports.parseAuthorization = parseAuthorization;
exports.parseBody = parseBody;
exports.parseQuery = parseQuery;
exports.parseSession = parseSession;
exports.requireAuthorization = requireAuthorization;
exports.requireHost = requireHost;
exports.requireTLS = requireTLS;
exports.validateBody = validateBody;
exports.validateContentType = validateContentType;

var _allowCors = require("../middleware/allow-cors");

var _allowCors2 = _interopRequireDefault(_allowCors);

var _connect = require("../middleware/connect");

var _connect2 = _interopRequireDefault(_connect);

var _exposeAllErrors = require("../middleware/expose-all-errors");

var _exposeAllErrors2 = _interopRequireDefault(_exposeAllErrors);

var _parseAuthorization = require("../middleware/parse-authorization");

var _parseAuthorization2 = _interopRequireDefault(_parseAuthorization);

var _parseBody = require("../middleware/parse-body");

var _parseBody2 = _interopRequireDefault(_parseBody);

var _parseQuery = require("../middleware/parse-query");

var _parseQuery2 = _interopRequireDefault(_parseQuery);

var _parseSession = require("../middleware/parse-session");

var _parseSession2 = _interopRequireDefault(_parseSession);

var _requireAuthorization = require("../middleware/require-authorization");

var _requireAuthorization2 = _interopRequireDefault(_requireAuthorization);

var _requireHost = require("../middleware/require-host");

var _requireHost2 = _interopRequireDefault(_requireHost);

var _requireTls = require("../middleware/require-tls");

var _requireTls2 = _interopRequireDefault(_requireTls);

var _validateBody = require("../middleware/validate-body");

var _validateBody2 = _interopRequireDefault(_validateBody);

var _validateContentType = require("../middleware/validate-content-type");

var _validateContentType2 = _interopRequireDefault(_validateContentType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function allowCors(...args) {
  return (0, _use.use)((0, _allowCors2.default)(...args));
}

function connect(...args) {
  return (0, _use.use)((0, _connect2.default)(...args));
}

function exposeAllErrors(...args) {
  return (0, _use.use)((0, _exposeAllErrors2.default)(...args));
}

function parseAuthorization(...args) {
  return (0, _use.use)((0, _parseAuthorization2.default)(...args));
}

function parseBody(...args) {
  return (0, _use.use)((0, _parseBody2.default)(...args));
}

function parseQuery(...args) {
  return (0, _use.use)((0, _parseQuery2.default)(...args));
}

function parseSession(...args) {
  return (0, _use.use)((0, _parseSession2.default)(...args));
}

function requireAuthorization(...args) {
  return (0, _use.use)((0, _requireAuthorization2.default)(...args));
}

function requireHost(...args) {
  return (0, _use.use)((0, _requireHost2.default)(...args));
}

function requireTLS(...args) {
  return (0, _use.use)((0, _requireTls2.default)(...args));
}

function validateBody(...args) {
  return (0, _use.use)((0, _validateBody2.default)(...args));
}

function validateContentType(...args) {
  return (0, _use.use)((0, _validateContentType2.default)(...args));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJhbGxvd0NvcnMiLCJjb25uZWN0IiwiZXhwb3NlQWxsRXJyb3JzIiwicGFyc2VBdXRob3JpemF0aW9uIiwicGFyc2VCb2R5IiwicGFyc2VRdWVyeSIsInBhcnNlU2Vzc2lvbiIsInJlcXVpcmVBdXRob3JpemF0aW9uIiwicmVxdWlyZUhvc3QiLCJyZXF1aXJlVExTIiwidmFsaWRhdGVCb2R5IiwidmFsaWRhdGVDb250ZW50VHlwZSIsImFyZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO1FBaUJnQkEsUyxHQUFBQSxTO1FBSUFDLE8sR0FBQUEsTztRQUlBQyxlLEdBQUFBLGU7UUFJQUMsa0IsR0FBQUEsa0I7UUFJQUMsUyxHQUFBQSxTO1FBSUFDLFUsR0FBQUEsVTtRQUlBQyxZLEdBQUFBLFk7UUFJQUMsb0IsR0FBQUEsb0I7UUFJQUMsVyxHQUFBQSxXO1FBSUFDLFUsR0FBQUEsVTtRQUlBQyxZLEdBQUFBLFk7UUFJQUMsbUIsR0FBQUEsbUI7O0FBekRoQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVPLFNBQVNYLFNBQVQsQ0FBbUIsR0FBR1ksSUFBdEIsRUFBbUM7QUFDeEMsU0FBTyxjQUFJLHlCQUFvQixHQUFHQSxJQUF2QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTWCxPQUFULENBQWlCLEdBQUdXLElBQXBCLEVBQWlDO0FBQ3RDLFNBQU8sY0FBSSx1QkFBa0IsR0FBR0EsSUFBckIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU1YsZUFBVCxDQUF5QixHQUFHVSxJQUE1QixFQUF5QztBQUM5QyxTQUFPLGNBQUksK0JBQTBCLEdBQUdBLElBQTdCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNULGtCQUFULENBQTRCLEdBQUdTLElBQS9CLEVBQTRDO0FBQ2pELFNBQU8sY0FBSSxrQ0FBNkIsR0FBR0EsSUFBaEMsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU1IsU0FBVCxDQUFtQixHQUFHUSxJQUF0QixFQUFtQztBQUN4QyxTQUFPLGNBQUkseUJBQW9CLEdBQUdBLElBQXZCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNQLFVBQVQsQ0FBb0IsR0FBR08sSUFBdkIsRUFBb0M7QUFDekMsU0FBTyxjQUFJLDBCQUFxQixHQUFHQSxJQUF4QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTTixZQUFULENBQXNCLEdBQUdNLElBQXpCLEVBQXNDO0FBQzNDLFNBQU8sY0FBSSw0QkFBdUIsR0FBR0EsSUFBMUIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0wsb0JBQVQsQ0FBOEIsR0FBR0ssSUFBakMsRUFBOEM7QUFDbkQsU0FBTyxjQUFJLG9DQUErQixHQUFHQSxJQUFsQyxDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTSixXQUFULENBQXFCLEdBQUdJLElBQXhCLEVBQXFDO0FBQzFDLFNBQU8sY0FBSSwyQkFBc0IsR0FBR0EsSUFBekIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0gsVUFBVCxDQUFvQixHQUFHRyxJQUF2QixFQUFvQztBQUN6QyxTQUFPLGNBQUksMEJBQXFCLEdBQUdBLElBQXhCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNGLFlBQVQsQ0FBc0IsR0FBR0UsSUFBekIsRUFBc0M7QUFDM0MsU0FBTyxjQUFJLDRCQUF1QixHQUFHQSxJQUExQixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTRCxtQkFBVCxDQUE2QixHQUFHQyxJQUFoQyxFQUE2QztBQUNsRCxTQUFPLGNBQUksbUNBQThCLEdBQUdBLElBQWpDLENBQUosQ0FBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmV4cG9ydCAqIGZyb20gXCIuL3Jlc291cmNlXCJcbmV4cG9ydCAqIGZyb20gXCIuL3JvdXRlXCJcbmV4cG9ydCAqIGZyb20gXCIuL3N0YXJ0XCJcbmV4cG9ydCAqIGZyb20gXCIuL3VzZVwiXG5leHBvcnQgKiBmcm9tIFwiLi93aGVuXCJcblxuaW1wb3J0IHt1c2V9IGZyb20gXCIuL3VzZVwiXG5cbmltcG9ydCBhbGxvd0NvcnNNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL2FsbG93LWNvcnNcIlxuaW1wb3J0IGNvbm5lY3RNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL2Nvbm5lY3RcIlxuaW1wb3J0IGV4cG9zZUFsbEVycm9yc01pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvZXhwb3NlLWFsbC1lcnJvcnNcIlxuaW1wb3J0IHBhcnNlQXV0aG9yaXphdGlvbk1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvcGFyc2UtYXV0aG9yaXphdGlvblwiXG5pbXBvcnQgcGFyc2VCb2R5TWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1ib2R5XCJcbmltcG9ydCBwYXJzZVF1ZXJ5TWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1xdWVyeVwiXG5pbXBvcnQgcGFyc2VTZXNzaW9uTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1zZXNzaW9uXCJcbmltcG9ydCByZXF1aXJlQXV0aG9yaXphdGlvbk1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvcmVxdWlyZS1hdXRob3JpemF0aW9uXCJcbmltcG9ydCByZXF1aXJlSG9zdE1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvcmVxdWlyZS1ob3N0XCJcbmltcG9ydCByZXF1aXJlVExTTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9yZXF1aXJlLXRsc1wiXG5pbXBvcnQgdmFsaWRhdGVCb2R5TWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS92YWxpZGF0ZS1ib2R5XCJcbmltcG9ydCB2YWxpZGF0ZUNvbnRlbnRUeXBlTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS92YWxpZGF0ZS1jb250ZW50LXR5cGVcIlxuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dDb3JzKC4uLmFyZ3M6IGFueVtdKSB7XG4gIHJldHVybiB1c2UoYWxsb3dDb3JzTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3QoLi4uYXJnczogYW55W10pIHtcbiAgcmV0dXJuIHVzZShjb25uZWN0TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZUFsbEVycm9ycyguLi5hcmdzOiBhbnlbXSkge1xuICByZXR1cm4gdXNlKGV4cG9zZUFsbEVycm9yc01pZGRsZXdhcmUoLi4uYXJncykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUF1dGhvcml6YXRpb24oLi4uYXJnczogYW55W10pIHtcbiAgcmV0dXJuIHVzZShwYXJzZUF1dGhvcml6YXRpb25NaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VCb2R5KC4uLmFyZ3M6IGFueVtdKSB7XG4gIHJldHVybiB1c2UocGFyc2VCb2R5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUXVlcnkoLi4uYXJnczogYW55W10pIHtcbiAgcmV0dXJuIHVzZShwYXJzZVF1ZXJ5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2Vzc2lvbiguLi5hcmdzOiBhbnlbXSkge1xuICByZXR1cm4gdXNlKHBhcnNlU2Vzc2lvbk1pZGRsZXdhcmUoLi4uYXJncykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlQXV0aG9yaXphdGlvbiguLi5hcmdzOiBhbnlbXSkge1xuICByZXR1cm4gdXNlKHJlcXVpcmVBdXRob3JpemF0aW9uTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVIb3N0KC4uLmFyZ3M6IGFueVtdKSB7XG4gIHJldHVybiB1c2UocmVxdWlyZUhvc3RNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZVRMUyguLi5hcmdzOiBhbnlbXSkge1xuICByZXR1cm4gdXNlKHJlcXVpcmVUTFNNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVCb2R5KC4uLmFyZ3M6IGFueVtdKSB7XG4gIHJldHVybiB1c2UodmFsaWRhdGVCb2R5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ29udGVudFR5cGUoLi4uYXJnczogYW55W10pIHtcbiAgcmV0dXJuIHVzZSh2YWxpZGF0ZUNvbnRlbnRUeXBlTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cbiJdfQ==