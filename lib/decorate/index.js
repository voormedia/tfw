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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb25uZWN0IiwiZXhwb3NlQWxsRXJyb3JzIiwicGFyc2VBdXRob3JpemF0aW9uIiwicGFyc2VCb2R5IiwicGFyc2VRdWVyeSIsInBhcnNlU2Vzc2lvbiIsInJlcXVpcmVBdXRob3JpemF0aW9uIiwicmVxdWlyZUhvc3QiLCJyZXF1aXJlVExTIiwidmFsaWRhdGVCb2R5IiwidmFsaWRhdGVDb250ZW50VHlwZSIsImFyZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO1FBZ0JnQkEsTyxHQUFBQSxPO1FBSUFDLGUsR0FBQUEsZTtRQUlBQyxrQixHQUFBQSxrQjtRQUlBQyxTLEdBQUFBLFM7UUFJQUMsVSxHQUFBQSxVO1FBSUFDLFksR0FBQUEsWTtRQUlBQyxvQixHQUFBQSxvQjtRQUlBQyxXLEdBQUFBLFc7UUFJQUMsVSxHQUFBQSxVO1FBSUFDLFksR0FBQUEsWTtRQUlBQyxtQixHQUFBQSxtQjs7QUFwRGhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVPLFNBQVNWLE9BQVQsQ0FBaUIsR0FBR1csSUFBcEIsRUFBMEI7QUFDL0IsU0FBTyxjQUFJLHVCQUFrQixHQUFHQSxJQUFyQixDQUFKLENBQVA7QUFDRDtBQUVNLFNBQVNWLGVBQVQsQ0FBeUIsR0FBR1UsSUFBNUIsRUFBa0M7QUFDdkMsU0FBTyxjQUFJLCtCQUEwQixHQUFHQSxJQUE3QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTVCxrQkFBVCxDQUE0QixHQUFHUyxJQUEvQixFQUFxQztBQUMxQyxTQUFPLGNBQUksa0NBQTZCLEdBQUdBLElBQWhDLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNSLFNBQVQsQ0FBbUIsR0FBR1EsSUFBdEIsRUFBNEI7QUFDakMsU0FBTyxjQUFJLHlCQUFvQixHQUFHQSxJQUF2QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTUCxVQUFULENBQW9CLEdBQUdPLElBQXZCLEVBQTZCO0FBQ2xDLFNBQU8sY0FBSSwwQkFBcUIsR0FBR0EsSUFBeEIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU04sWUFBVCxDQUFzQixHQUFHTSxJQUF6QixFQUErQjtBQUNwQyxTQUFPLGNBQUksNEJBQXVCLEdBQUdBLElBQTFCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNMLG9CQUFULENBQThCLEdBQUdLLElBQWpDLEVBQXVDO0FBQzVDLFNBQU8sY0FBSSxvQ0FBK0IsR0FBR0EsSUFBbEMsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0osV0FBVCxDQUFxQixHQUFHSSxJQUF4QixFQUE4QjtBQUNuQyxTQUFPLGNBQUksMkJBQXNCLEdBQUdBLElBQXpCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNILFVBQVQsQ0FBb0IsR0FBR0csSUFBdkIsRUFBNkI7QUFDbEMsU0FBTyxjQUFJLDBCQUFxQixHQUFHQSxJQUF4QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTRixZQUFULENBQXNCLEdBQUdFLElBQXpCLEVBQStCO0FBQ3BDLFNBQU8sY0FBSSw0QkFBdUIsR0FBR0EsSUFBMUIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0QsbUJBQVQsQ0FBNkIsR0FBR0MsSUFBaEMsRUFBc0M7QUFDM0MsU0FBTyxjQUFJLG1DQUE4QixHQUFHQSxJQUFqQyxDQUFKLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5leHBvcnQgKiBmcm9tIFwiLi9yZXNvdXJjZVwiXG5leHBvcnQgKiBmcm9tIFwiLi9yb3V0ZVwiXG5leHBvcnQgKiBmcm9tIFwiLi9zdGFydFwiXG5leHBvcnQgKiBmcm9tIFwiLi91c2VcIlxuZXhwb3J0ICogZnJvbSBcIi4vd2hlblwiXG5cbmltcG9ydCB7dXNlfSBmcm9tIFwiLi91c2VcIlxuXG5pbXBvcnQgY29ubmVjdE1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvY29ubmVjdFwiXG5pbXBvcnQgZXhwb3NlQWxsRXJyb3JzTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9leHBvc2UtYWxsLWVycm9yc1wiXG5pbXBvcnQgcGFyc2VBdXRob3JpemF0aW9uTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1hdXRob3JpemF0aW9uXCJcbmltcG9ydCBwYXJzZUJvZHlNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3BhcnNlLWJvZHlcIlxuaW1wb3J0IHBhcnNlUXVlcnlNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3BhcnNlLXF1ZXJ5XCJcbmltcG9ydCBwYXJzZVNlc3Npb25NaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3BhcnNlLXNlc3Npb25cIlxuaW1wb3J0IHJlcXVpcmVBdXRob3JpemF0aW9uTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9yZXF1aXJlLWF1dGhvcml6YXRpb25cIlxuaW1wb3J0IHJlcXVpcmVIb3N0TWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9yZXF1aXJlLWhvc3RcIlxuaW1wb3J0IHJlcXVpcmVUTFNNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3JlcXVpcmUtdGxzXCJcbmltcG9ydCB2YWxpZGF0ZUJvZHlNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3ZhbGlkYXRlLWJvZHlcIlxuaW1wb3J0IHZhbGlkYXRlQ29udGVudFR5cGVNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3ZhbGlkYXRlLWNvbnRlbnQtdHlwZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShjb25uZWN0TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZUFsbEVycm9ycyguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UoZXhwb3NlQWxsRXJyb3JzTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQXV0aG9yaXphdGlvbiguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UocGFyc2VBdXRob3JpemF0aW9uTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQm9keSguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UocGFyc2VCb2R5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUXVlcnkoLi4uYXJncykge1xuICByZXR1cm4gdXNlKHBhcnNlUXVlcnlNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTZXNzaW9uKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShwYXJzZVNlc3Npb25NaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZUF1dGhvcml6YXRpb24oLi4uYXJncykge1xuICByZXR1cm4gdXNlKHJlcXVpcmVBdXRob3JpemF0aW9uTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVIb3N0KC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShyZXF1aXJlSG9zdE1pZGRsZXdhcmUoLi4uYXJncykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlVExTKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShyZXF1aXJlVExTTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQm9keSguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UodmFsaWRhdGVCb2R5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ29udGVudFR5cGUoLi4uYXJncykge1xuICByZXR1cm4gdXNlKHZhbGlkYXRlQ29udGVudFR5cGVNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuIl19