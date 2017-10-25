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
exports.parseAuthorization = parseAuthorization;
exports.parseBody = parseBody;
exports.parseSession = parseSession;
exports.requireHost = requireHost;
exports.requireTLS = requireTLS;
exports.validateBody = validateBody;
exports.validateContentType = validateContentType;

var _connect = require("../middleware/connect");

var _connect2 = _interopRequireDefault(_connect);

var _parseAuthorization = require("../middleware/parse-authorization");

var _parseAuthorization2 = _interopRequireDefault(_parseAuthorization);

var _parseBody = require("../middleware/parse-body");

var _parseBody2 = _interopRequireDefault(_parseBody);

var _parseSession = require("../middleware/parse-session");

var _parseSession2 = _interopRequireDefault(_parseSession);

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

function parseAuthorization(...args) {
  return (0, _use.use)((0, _parseAuthorization2.default)(...args));
}

function parseBody(...args) {
  return (0, _use.use)((0, _parseBody2.default)(...args));
}

function parseSession(...args) {
  return (0, _use.use)((0, _parseSession2.default)(...args));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb25uZWN0IiwicGFyc2VBdXRob3JpemF0aW9uIiwicGFyc2VCb2R5IiwicGFyc2VTZXNzaW9uIiwicmVxdWlyZUhvc3QiLCJyZXF1aXJlVExTIiwidmFsaWRhdGVCb2R5IiwidmFsaWRhdGVDb250ZW50VHlwZSIsImFyZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO1FBYWdCQSxPLEdBQUFBLE87UUFJQUMsa0IsR0FBQUEsa0I7UUFJQUMsUyxHQUFBQSxTO1FBSUFDLFksR0FBQUEsWTtRQUlBQyxXLEdBQUFBLFc7UUFJQUMsVSxHQUFBQSxVO1FBSUFDLFksR0FBQUEsWTtRQUlBQyxtQixHQUFBQSxtQjs7QUFyQ2hCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVPLFNBQVNQLE9BQVQsQ0FBaUIsR0FBR1EsSUFBcEIsRUFBMEI7QUFDL0IsU0FBTyxjQUFJLHVCQUFrQixHQUFHQSxJQUFyQixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTUCxrQkFBVCxDQUE0QixHQUFHTyxJQUEvQixFQUFxQztBQUMxQyxTQUFPLGNBQUksa0NBQTZCLEdBQUdBLElBQWhDLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNOLFNBQVQsQ0FBbUIsR0FBR00sSUFBdEIsRUFBNEI7QUFDakMsU0FBTyxjQUFJLHlCQUFvQixHQUFHQSxJQUF2QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTTCxZQUFULENBQXNCLEdBQUdLLElBQXpCLEVBQStCO0FBQ3BDLFNBQU8sY0FBSSw0QkFBdUIsR0FBR0EsSUFBMUIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0osV0FBVCxDQUFxQixHQUFHSSxJQUF4QixFQUE4QjtBQUNuQyxTQUFPLGNBQUksMkJBQXNCLEdBQUdBLElBQXpCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNILFVBQVQsQ0FBb0IsR0FBR0csSUFBdkIsRUFBNkI7QUFDbEMsU0FBTyxjQUFJLDBCQUFxQixHQUFHQSxJQUF4QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTRixZQUFULENBQXNCLEdBQUdFLElBQXpCLEVBQStCO0FBQ3BDLFNBQU8sY0FBSSw0QkFBdUIsR0FBR0EsSUFBMUIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0QsbUJBQVQsQ0FBNkIsR0FBR0MsSUFBaEMsRUFBc0M7QUFDM0MsU0FBTyxjQUFJLG1DQUE4QixHQUFHQSxJQUFqQyxDQUFKLENBQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5leHBvcnQgKiBmcm9tIFwiLi9yZXNvdXJjZVwiXG5leHBvcnQgKiBmcm9tIFwiLi9yb3V0ZVwiXG5leHBvcnQgKiBmcm9tIFwiLi9zdGFydFwiXG5leHBvcnQgKiBmcm9tIFwiLi91c2VcIlxuZXhwb3J0ICogZnJvbSBcIi4vd2hlblwiXG5cbmltcG9ydCB7dXNlfSBmcm9tIFwiLi91c2VcIlxuXG5pbXBvcnQgY29ubmVjdE1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvY29ubmVjdFwiXG5pbXBvcnQgcGFyc2VBdXRob3JpemF0aW9uTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1hdXRob3JpemF0aW9uXCJcbmltcG9ydCBwYXJzZUJvZHlNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3BhcnNlLWJvZHlcIlxuaW1wb3J0IHBhcnNlU2Vzc2lvbk1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvcGFyc2Utc2Vzc2lvblwiXG5pbXBvcnQgcmVxdWlyZUhvc3RNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3JlcXVpcmUtaG9zdFwiXG5pbXBvcnQgcmVxdWlyZVRMU01pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvcmVxdWlyZS10bHNcIlxuaW1wb3J0IHZhbGlkYXRlQm9keU1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvdmFsaWRhdGUtYm9keVwiXG5pbXBvcnQgdmFsaWRhdGVDb250ZW50VHlwZU1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvdmFsaWRhdGUtY29udGVudC10eXBlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3QoLi4uYXJncykge1xuICByZXR1cm4gdXNlKGNvbm5lY3RNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBdXRob3JpemF0aW9uKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShwYXJzZUF1dGhvcml6YXRpb25NaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VCb2R5KC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShwYXJzZUJvZHlNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTZXNzaW9uKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShwYXJzZVNlc3Npb25NaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZUhvc3QoLi4uYXJncykge1xuICByZXR1cm4gdXNlKHJlcXVpcmVIb3N0TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVUTFMoLi4uYXJncykge1xuICByZXR1cm4gdXNlKHJlcXVpcmVUTFNNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVCb2R5KC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZSh2YWxpZGF0ZUJvZHlNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVDb250ZW50VHlwZSguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UodmFsaWRhdGVDb250ZW50VHlwZU1pZGRsZXdhcmUoLi4uYXJncykpXG59XG4iXX0=