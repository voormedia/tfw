"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateBody;

var _schemaValidator = require("../util/schema-validator");

var validator = _interopRequireWildcard(_schemaValidator);

var _errors = require("../errors");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* eslint-disable no-unused-expressions */
function validateBody(options) {
  return function validateBody(next) {
    this;

    validate(this.data.body, options);
    return next();
  };
}

function validate(body, { schema, message = "Request is invalid", details = true, optional = false }) {
  /* Don't validate non-JSON bodies if the request schema is optional. */
  if (!body || Buffer.isBuffer(body)) {
    if (optional) return;

    /* Validate empty body. */
    body = {};
  }

  const errors = validator.validate(schema, body);
  if (errors.length) {
    if (details) {
      throw new _errors.BadRequest(`${message}: ${errors.join("; ")}`);
    } else {
      throw new _errors.BadRequest(message);
    }
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3ZhbGlkYXRlLWJvZHkuanMiXSwibmFtZXMiOlsidmFsaWRhdGVCb2R5IiwidmFsaWRhdG9yIiwib3B0aW9ucyIsIm5leHQiLCJ2YWxpZGF0ZSIsImRhdGEiLCJib2R5Iiwic2NoZW1hIiwibWVzc2FnZSIsImRldGFpbHMiLCJvcHRpb25hbCIsIkJ1ZmZlciIsImlzQnVmZmVyIiwiZXJyb3JzIiwibGVuZ3RoIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBZXdCQSxZOztBQWJ4Qjs7SUFBWUMsUzs7QUFFWjs7OztBQUhBO0FBY2UsU0FBU0QsWUFBVCxDQUFzQkUsT0FBdEIsRUFBOEQ7QUFDM0UsU0FBTyxTQUFTRixZQUFULENBQXNCRyxJQUF0QixFQUFrQztBQUN0QyxRQUFEOztBQUVBQyxhQUFTLEtBQUtDLElBQUwsQ0FBVUMsSUFBbkIsRUFBeUJKLE9BQXpCO0FBQ0EsV0FBT0MsTUFBUDtBQUNELEdBTEQ7QUFNRDs7QUFFRCxTQUFTQyxRQUFULENBQWtCRSxJQUFsQixFQUF3QixFQUFDQyxNQUFELEVBQVNDLFVBQVUsb0JBQW5CLEVBQXlDQyxVQUFVLElBQW5ELEVBQXlEQyxXQUFXLEtBQXBFLEVBQXhCLEVBQW9HO0FBQ2xHO0FBQ0EsTUFBSSxDQUFDSixJQUFELElBQVNLLE9BQU9DLFFBQVAsQ0FBZ0JOLElBQWhCLENBQWIsRUFBb0M7QUFDbEMsUUFBSUksUUFBSixFQUFjOztBQUVkO0FBQ0FKLFdBQU8sRUFBUDtBQUNEOztBQUVELFFBQU1PLFNBQVNaLFVBQVVHLFFBQVYsQ0FBbUJHLE1BQW5CLEVBQTJCRCxJQUEzQixDQUFmO0FBQ0EsTUFBSU8sT0FBT0MsTUFBWCxFQUFtQjtBQUNqQixRQUFJTCxPQUFKLEVBQWE7QUFDWCxZQUFNLHVCQUFnQixHQUFFRCxPQUFRLEtBQUlLLE9BQU9FLElBQVAsQ0FBWSxJQUFaLENBQWtCLEVBQWhELENBQU47QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNLHVCQUFlUCxPQUFmLENBQU47QUFDRDtBQUNGO0FBQ0YiLCJmaWxlIjoidmFsaWRhdGUtYm9keS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvbnMgKi9cbmltcG9ydCAqIGFzIHZhbGlkYXRvciBmcm9tIFwiLi4vdXRpbC9zY2hlbWEtdmFsaWRhdG9yXCJcblxuaW1wb3J0IHtCYWRSZXF1ZXN0fSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxudHlwZSBWYWxpZGF0aW9uT3B0aW9ucyA9IHtcbiAgc2NoZW1hOiBPYmplY3QsXG4gIG1lc3NhZ2U6IHN0cmluZyxcbiAgZGV0YWlsczogYm9vbGVhbixcbiAgb3B0aW9uYWw6IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHZhbGlkYXRlQm9keShvcHRpb25zOiBWYWxpZGF0aW9uT3B0aW9ucyk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gZnVuY3Rpb24gdmFsaWRhdGVCb2R5KG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIHZhbGlkYXRlKHRoaXMuZGF0YS5ib2R5LCBvcHRpb25zKVxuICAgIHJldHVybiBuZXh0KClcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZShib2R5LCB7c2NoZW1hLCBtZXNzYWdlID0gXCJSZXF1ZXN0IGlzIGludmFsaWRcIiwgZGV0YWlscyA9IHRydWUsIG9wdGlvbmFsID0gZmFsc2V9KSB7XG4gIC8qIERvbid0IHZhbGlkYXRlIG5vbi1KU09OIGJvZGllcyBpZiB0aGUgcmVxdWVzdCBzY2hlbWEgaXMgb3B0aW9uYWwuICovXG4gIGlmICghYm9keSB8fCBCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcbiAgICBpZiAob3B0aW9uYWwpIHJldHVyblxuXG4gICAgLyogVmFsaWRhdGUgZW1wdHkgYm9keS4gKi9cbiAgICBib2R5ID0ge31cbiAgfVxuXG4gIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRvci52YWxpZGF0ZShzY2hlbWEsIGJvZHkpXG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgaWYgKGRldGFpbHMpIHtcbiAgICAgIHRocm93IG5ldyBCYWRSZXF1ZXN0KGAke21lc3NhZ2V9OiAke2Vycm9ycy5qb2luKFwiOyBcIil9YClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3QobWVzc2FnZSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==