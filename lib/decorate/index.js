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
exports.requireTLS = requireTLS;
exports.parseAuthorization = parseAuthorization;
exports.parseBody = parseBody;
exports.parseSession = parseSession;
exports.validateBody = validateBody;
exports.validateContentType = validateContentType;

var _requireTls = require("../middleware/require-tls");

var _requireTls2 = _interopRequireDefault(_requireTls);

var _parseAuthorization = require("../middleware/parse-authorization");

var _parseAuthorization2 = _interopRequireDefault(_parseAuthorization);

var _parseBody = require("../middleware/parse-body");

var _parseBody2 = _interopRequireDefault(_parseBody);

var _parseSession = require("../middleware/parse-session");

var _parseSession2 = _interopRequireDefault(_parseSession);

var _validateBody = require("../middleware/validate-body");

var _validateBody2 = _interopRequireDefault(_validateBody);

var _validateContentType = require("../middleware/validate-content-type");

var _validateContentType2 = _interopRequireDefault(_validateContentType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requireTLS(...args) {
  return (0, _use.use)((0, _requireTls2.default)(...args));
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

function validateBody(...args) {
  return (0, _use.use)((0, _validateBody2.default)(...args));
}

function validateContentType(...args) {
  return (0, _use.use)((0, _validateContentType2.default)(...args));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWNvcmF0ZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlVExTIiwicGFyc2VBdXRob3JpemF0aW9uIiwicGFyc2VCb2R5IiwicGFyc2VTZXNzaW9uIiwidmFsaWRhdGVCb2R5IiwidmFsaWRhdGVDb250ZW50VHlwZSIsImFyZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO1FBV2dCQSxVLEdBQUFBLFU7UUFJQUMsa0IsR0FBQUEsa0I7UUFJQUMsUyxHQUFBQSxTO1FBSUFDLFksR0FBQUEsWTtRQUlBQyxZLEdBQUFBLFk7UUFJQUMsbUIsR0FBQUEsbUI7O0FBM0JoQjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVPLFNBQVNMLFVBQVQsQ0FBb0IsR0FBR00sSUFBdkIsRUFBNkI7QUFDbEMsU0FBTyxjQUFJLDBCQUFxQixHQUFHQSxJQUF4QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTTCxrQkFBVCxDQUE0QixHQUFHSyxJQUEvQixFQUFxQztBQUMxQyxTQUFPLGNBQUksa0NBQTZCLEdBQUdBLElBQWhDLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNKLFNBQVQsQ0FBbUIsR0FBR0ksSUFBdEIsRUFBNEI7QUFDakMsU0FBTyxjQUFJLHlCQUFvQixHQUFHQSxJQUF2QixDQUFKLENBQVA7QUFDRDs7QUFFTSxTQUFTSCxZQUFULENBQXNCLEdBQUdHLElBQXpCLEVBQStCO0FBQ3BDLFNBQU8sY0FBSSw0QkFBdUIsR0FBR0EsSUFBMUIsQ0FBSixDQUFQO0FBQ0Q7O0FBRU0sU0FBU0YsWUFBVCxDQUFzQixHQUFHRSxJQUF6QixFQUErQjtBQUNwQyxTQUFPLGNBQUksNEJBQXVCLEdBQUdBLElBQTFCLENBQUosQ0FBUDtBQUNEOztBQUVNLFNBQVNELG1CQUFULENBQTZCLEdBQUdDLElBQWhDLEVBQXNDO0FBQzNDLFNBQU8sY0FBSSxtQ0FBOEIsR0FBR0EsSUFBakMsQ0FBSixDQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuZXhwb3J0ICogZnJvbSBcIi4vcmVzb3VyY2VcIlxuZXhwb3J0ICogZnJvbSBcIi4vcm91dGVcIlxuZXhwb3J0ICogZnJvbSBcIi4vc3RhcnRcIlxuZXhwb3J0ICogZnJvbSBcIi4vdXNlXCJcbmV4cG9ydCAqIGZyb20gXCIuL3doZW5cIlxuXG5pbXBvcnQge3VzZX0gZnJvbSBcIi4vdXNlXCJcblxuaW1wb3J0IHJlcXVpcmVUTFNNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3JlcXVpcmUtdGxzXCJcbmltcG9ydCBwYXJzZUF1dGhvcml6YXRpb25NaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3BhcnNlLWF1dGhvcml6YXRpb25cIlxuaW1wb3J0IHBhcnNlQm9keU1pZGRsZXdhcmUgZnJvbSBcIi4uL21pZGRsZXdhcmUvcGFyc2UtYm9keVwiXG5pbXBvcnQgcGFyc2VTZXNzaW9uTWlkZGxld2FyZSBmcm9tIFwiLi4vbWlkZGxld2FyZS9wYXJzZS1zZXNzaW9uXCJcbmltcG9ydCB2YWxpZGF0ZUJvZHlNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3ZhbGlkYXRlLWJvZHlcIlxuaW1wb3J0IHZhbGlkYXRlQ29udGVudFR5cGVNaWRkbGV3YXJlIGZyb20gXCIuLi9taWRkbGV3YXJlL3ZhbGlkYXRlLWNvbnRlbnQtdHlwZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlVExTKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHVzZShyZXF1aXJlVExTTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQXV0aG9yaXphdGlvbiguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UocGFyc2VBdXRob3JpemF0aW9uTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQm9keSguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UocGFyc2VCb2R5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2Vzc2lvbiguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UocGFyc2VTZXNzaW9uTWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQm9keSguLi5hcmdzKSB7XG4gIHJldHVybiB1c2UodmFsaWRhdGVCb2R5TWlkZGxld2FyZSguLi5hcmdzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ29udGVudFR5cGUoLi4uYXJncykge1xuICByZXR1cm4gdXNlKHZhbGlkYXRlQ29udGVudFR5cGVNaWRkbGV3YXJlKC4uLmFyZ3MpKVxufVxuIl19