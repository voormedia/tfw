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
exports.parseQuery = parseQuery;
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

var _parseQuery = require("../middleware/parse-query");

var _parseQuery2 = _interopRequireDefault(_parseQuery);

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

function parseQuery(...args) {
  return (0, _use.use)((0, _parseQuery2.default)(...args));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb25uZWN0IiwicGFyc2VBdXRob3JpemF0aW9uIiwicGFyc2VCb2R5IiwicGFyc2VRdWVyeSIsInBhcnNlU2Vzc2lvbiIsInJlcXVpcmVIb3N0IiwicmVxdWlyZVRMUyIsInZhbGlkYXRlQm9keSIsInZhbGlkYXRlQ29udGVudFR5cGUiLCJhcmdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtRQWNnQkEsTyxHQUFBQSxPO1FBSUFDLGtCLEdBQUFBLGtCO1FBSUFDLFMsR0FBQUEsUztRQUlBQyxVLEdBQUFBLFU7UUFJQUMsWSxHQUFBQSxZO1FBSUFDLFcsR0FBQUEsVztRQUlBQyxVLEdBQUFBLFU7UUFJQUMsWSxHQUFBQSxZO1FBSUFDLG1CLEdBQUFBLG1COztBQTFDaEI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTUixPQUFULENBQWlCLEdBQUdTLElBQXBCLEVBQTBCO0FBQy9CLFNBQU8sY0FBSSx1QkFBa0IsR0FBR0EsSUFBckIsQ0FBSixDQUFQO0FBQ0Q7QUFFTSxTQUFTUixrQkFBVCxDQUE0QixHQUFHUSxJQUEvQixFQUFxQztBQUMxQyxTQUFPLGNBQUksa0NBQTZCLEdBQUdBLElBQWhDLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNQLFNBQVQsQ0FBbUIsR0FBR08sSUFBdEIsRUFBNEI7QUFDakMsU0FBTyxjQUFJLHlCQUFvQixHQUFHQSxJQUF2QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTTixVQUFULENBQW9CLEdBQUdNLElBQXZCLEVBQTZCO0FBQ2xDLFNBQU8sY0FBSSwwQkFBcUIsR0FBR0EsSUFBeEIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0wsWUFBVCxDQUFzQixHQUFHSyxJQUF6QixFQUErQjtBQUNwQyxTQUFPLGNBQUksNEJBQXVCLEdBQUdBLElBQTFCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNKLFdBQVQsQ0FBcUIsR0FBR0ksSUFBeEIsRUFBOEI7QUFDbkMsU0FBTyxjQUFJLDJCQUFzQixHQUFHQSxJQUF6QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTSCxVQUFULENBQW9CLEdBQUdHLElBQXZCLEVBQTZCO0FBQ2xDLFNBQU8sY0FBSSwwQkFBcUIsR0FBR0EsSUFBeEIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0YsWUFBVCxDQUFzQixHQUFHRSxJQUF6QixFQUErQjtBQUNwQyxTQUFPLGNBQUksNEJBQXVCLEdBQUdBLElBQTFCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNELG1CQUFULENBQTZCLEdBQUdDLElBQWhDLEVBQXNDO0FBQzNDLFNBQU8sY0FBSSxtQ0FBOEIsR0FBR0EsSUFBakMsQ0FBSixDQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuZXhwb3J0ICogZnJvbSBcIi4vcmVzb3VyY2VcIlxuZXhwb3J0ICogZnJvbSBcIi4vcm91dGVcIlxuZXhwb3J0ICogZnJvbSBcIi4vc3RhcnRcIlxuZXhwb3J0ICogZnJvbSBcIi4vdXNlXCJcbmV4cG9ydCAqIGZyb20gXCIuL3doZW5cIlxuXG5pbXBvcnQge3VzZX0gZnJvbSBcIi4vdXNlXCJcblxuaW1wb3J0IGNvbm5lY3RNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL2Nvbm5lY3RcIlxuaW1wb3J0IHBhcnNlQXV0aG9yaXphdGlvbk1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvcGFyc2UtYXV0aG9yaXphdGlvblwiXG5pbXBvcnQgcGFyc2VCb2R5TWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1ib2R5XCJcbmltcG9ydCBwYXJzZVF1ZXJ5TWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1xdWVyeVwiXG5pbXBvcnQgcGFyc2VTZXNzaW9uTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1zZXNzaW9uXCJcbmltcG9ydCByZXF1aXJlSG9zdE1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvcmVxdWlyZS1ob3N0XCJcbmltcG9ydCByZXF1aXJlVExTTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9yZXF1aXJlLXRsc1wiXG5pbXBvcnQgdmFsaWRhdGVCb2R5TWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS92YWxpZGF0ZS1ib2R5XCJcbmltcG9ydCB2YWxpZGF0ZUNvbnRlbnRUeXBlTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS92YWxpZGF0ZS1jb250ZW50LXR5cGVcIlxuXG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdCguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UoY29ubmVjdE1pZGRsZXdhcmUoLi4uYXJncykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUF1dGhvcml6YXRpb24oLi4uYXJncykge1xuICByZXR1cm4gdXNlKHBhcnNlQXV0aG9yaXphdGlvbk1pZGRsZXdhcmUoLi4uYXJncykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUJvZHkoLi4uYXJncykge1xuICByZXR1cm4gdXNlKHBhcnNlQm9keU1pZGRsZXdhcmUoLi4uYXJncykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVF1ZXJ5KC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShwYXJzZVF1ZXJ5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2Vzc2lvbiguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UocGFyc2VTZXNzaW9uTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVIb3N0KC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShyZXF1aXJlSG9zdE1pZGRsZXdhcmUoLi4uYXJncykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlVExTKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShyZXF1aXJlVExTTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQm9keSguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UodmFsaWRhdGVCb2R5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ29udGVudFR5cGUoLi4uYXJncykge1xuICByZXR1cm4gdXNlKHZhbGlkYXRlQ29udGVudFR5cGVNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuIl19