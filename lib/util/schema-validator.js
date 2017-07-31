"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

var _switch = require("ajv-keywords/keywords/switch");

var _switch2 = _interopRequireDefault(_switch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(schema, body) {
  const validator = (0, _ajv2.default)({
    allErrors: true,
    v5: true
  });

  (0, _switch2.default)(validator);

  if (validator.validate(schema, body)) return [];

  const grouped = new Map();
  for (const error of validator.errors) {
    const key = error.schemaPath + ":" + error.dataPath;
    let set = grouped.get(key);
    if (!set) {
      set = [];
      grouped.set(key, set);
    }

    set.push(error);
  }

  const messages = new Set();
  for (const [, errors] of grouped) {
    const { keyword, dataPath } = errors[0];

    const path = fmtPath(dataPath);
    switch (keyword) {
      case "type":
        {
          const type = errors[0].params.type;
          messages.add(`${path} should be ${type}`);
          break;
        }

      case "enum":
        {
          const values = errors[0].params.allowedValues.map(val => fmtProp(val)).join(", ");
          messages.add(`${path} should be ${errors[0].params.allowedValues.length > 1 ? "one of " : ""}${values}`);
          break;
        }

      case "additionalProperties":
        {
          const unknown = errors.map(err => fmtProp(err.params.additionalProperty)).join(", ");
          messages.add(`${path} has unknown ${fmtPlural("key", errors.length)} ${unknown}`);
          break;
        }

      case "required":
        {
          const missing = errors.map(err => fmtProp(err.params.missingProperty)).join(", ");
          messages.add(`${path} requires ${fmtPlural("key", errors.length)} ${missing}`);
          break;
        }

      case "minimum":
        {
          const limit = errors[0].params.limit;
          messages.add(`${path} should be at least ${limit}`);
          break;
        }

      case "exclusiveMinimum":
        {
          const limit = errors[0].params.limit;
          messages.add(`${path} should be more than ${limit}`);
          break;
        }

      case "maximum":
        {
          const limit = errors[0].params.limit;
          messages.add(`${path} should be at most ${limit}`);
          break;
        }

      case "exclusiveMaximum":
        {
          const limit = errors[0].params.limit;
          messages.add(`${path} should be less than ${limit}`);
          break;
        }

      case "format":
        {
          let format = errors[0].params.format;
          if (format === "email") format = "email address";
          messages.add(`${path} should be formatted as ${format}`);
          break;
        }

      case "minLength":
        {
          const limit = errors[0].params.limit;
          messages.add(`${path} should be at least ${limit} ${fmtPlural("character", limit)}`);
          break;
        }

      case "maxLength":
        {
          const limit = errors[0].params.limit;
          messages.add(`${path} should be at most ${limit} ${fmtPlural("character", limit)}`);
          break;
        }

      default:
        messages.add(`${path} failed constraint`);
    }
  }

  return [...messages];
}

const fmtProp = prop => `'${prop}'`;
const fmtPath = path => path ? `'${path.slice(1)}'` : "request body";
const fmtPlural = (word, count) => `${word}${count > 1 ? "s" : ""}`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3NjaGVtYS12YWxpZGF0b3IuanMiXSwibmFtZXMiOlsidmFsaWRhdGUiLCJzY2hlbWEiLCJib2R5IiwidmFsaWRhdG9yIiwiYWxsRXJyb3JzIiwidjUiLCJncm91cGVkIiwiTWFwIiwiZXJyb3IiLCJlcnJvcnMiLCJrZXkiLCJzY2hlbWFQYXRoIiwiZGF0YVBhdGgiLCJzZXQiLCJnZXQiLCJwdXNoIiwibWVzc2FnZXMiLCJTZXQiLCJrZXl3b3JkIiwicGF0aCIsImZtdFBhdGgiLCJ0eXBlIiwicGFyYW1zIiwiYWRkIiwidmFsdWVzIiwiYWxsb3dlZFZhbHVlcyIsIm1hcCIsInZhbCIsImZtdFByb3AiLCJqb2luIiwibGVuZ3RoIiwidW5rbm93biIsImVyciIsImFkZGl0aW9uYWxQcm9wZXJ0eSIsImZtdFBsdXJhbCIsIm1pc3NpbmciLCJtaXNzaW5nUHJvcGVydHkiLCJsaW1pdCIsImZvcm1hdCIsInByb3AiLCJzbGljZSIsIndvcmQiLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFJZ0JBLFEsR0FBQUEsUTs7QUFIaEI7Ozs7QUFDQTs7Ozs7O0FBRU8sU0FBU0EsUUFBVCxDQUFrQkMsTUFBbEIsRUFBa0NDLElBQWxDLEVBQStDO0FBQ3BELFFBQU1DLFlBQVksbUJBQUk7QUFDcEJDLGVBQVcsSUFEUztBQUVwQkMsUUFBSTtBQUZnQixHQUFKLENBQWxCOztBQUtBLHdCQUFjRixTQUFkOztBQUVBLE1BQUlBLFVBQVVILFFBQVYsQ0FBbUJDLE1BQW5CLEVBQTJCQyxJQUEzQixDQUFKLEVBQXNDLE9BQU8sRUFBUDs7QUFFdEMsUUFBTUksVUFBVSxJQUFJQyxHQUFKLEVBQWhCO0FBQ0EsT0FBSyxNQUFNQyxLQUFYLElBQW9CTCxVQUFVTSxNQUE5QixFQUFzQztBQUNwQyxVQUFNQyxNQUFNRixNQUFNRyxVQUFOLEdBQW1CLEdBQW5CLEdBQXlCSCxNQUFNSSxRQUEzQztBQUNBLFFBQUlDLE1BQU1QLFFBQVFRLEdBQVIsQ0FBWUosR0FB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anYgZnJvbSBcImFqdlwiXG5pbXBvcnQga2V5d29yZFN3aXRjaCBmcm9tIFwiYWp2LWtleXdvcmRzL2tleXdvcmRzL3N3aXRjaFwiXG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZShzY2hlbWE6IE9iamVjdCwgYm9keTogbWl4ZWQpIHtcbiAgY29uc3QgdmFsaWRhdG9yID0gYWp2KHtcbiAgICBhbGxFcnJvcnM6IHRydWUsXG4gICAgdjU6IHRydWUsXG4gIH0pXG5cbiAga2V5d29yZFN3aXRjaCh2YWxpZGF0b3IpXG5cbiAgaWYgKHZhbGlkYXRvci52YWxpZGF0ZShzY2hlbWEsIGJvZHkpKSByZXR1cm4gW11cblxuICBjb25zdCBncm91cGVkID0gbmV3IE1hcFxuICBmb3IgKGNvbnN0IGVycm9yIG9mIHZhbGlkYXRvci5lcnJvcnMpIHtcbiAgICBjb25zdCBrZXkgPSBlcnJvci5zY2hlbWFQYXRoICsgXCI6XCIgKyBlcnJvci5kYXRhUGF0aFxuICAgIGxldCBzZXQgPSBncm91cGVkLmdldChrZXkpXG4gICAgaWYgKCFzZXQpIHtcbiAgICAgIHNldCA9IFtdXG4gICAgICBncm91cGVkLnNldChrZXksIHNldClcbiAgICB9XG5cbiAgICBzZXQucHVzaChlcnJvcilcbiAgfVxuXG4gIGNvbnN0IG1lc3NhZ2VzID0gbmV3IFNldFxuICBmb3IgKGNvbnN0IFsgLCBlcnJvcnNdIG9mIGdyb3VwZWQpIHtcbiAgICBjb25zdCB7a2V5d29yZCwgZGF0YVBhdGh9ID0gZXJyb3JzWzBdXG5cbiAgICBjb25zdCBwYXRoID0gZm10UGF0aChkYXRhUGF0aClcbiAgICBzd2l0Y2ggKGtleXdvcmQpIHtcbiAgICAgIGNhc2UgXCJ0eXBlXCI6IHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGVycm9yc1swXS5wYXJhbXMudHlwZVxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlICR7dHlwZX1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwiZW51bVwiOiB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGVycm9yc1swXS5wYXJhbXMuYWxsb3dlZFZhbHVlcy5tYXAodmFsID0+IGZtdFByb3AodmFsKSkuam9pbihcIiwgXCIpXG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgJHtlcnJvcnNbMF0ucGFyYW1zLmFsbG93ZWRWYWx1ZXMubGVuZ3RoID4gMSA/IFwib25lIG9mIFwiIDogXCJcIn0ke3ZhbHVlc31gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjoge1xuICAgICAgICBjb25zdCB1bmtub3duID0gZXJyb3JzLm1hcChlcnIgPT4gZm10UHJvcChlcnIucGFyYW1zLmFkZGl0aW9uYWxQcm9wZXJ0eSkpLmpvaW4oXCIsIFwiKVxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gaGFzIHVua25vd24gJHtmbXRQbHVyYWwoXCJrZXlcIiwgZXJyb3JzLmxlbmd0aCl9ICR7dW5rbm93bn1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwicmVxdWlyZWRcIjoge1xuICAgICAgICBjb25zdCBtaXNzaW5nID0gZXJyb3JzLm1hcChlcnIgPT4gZm10UHJvcChlcnIucGFyYW1zLm1pc3NpbmdQcm9wZXJ0eSkpLmpvaW4oXCIsIFwiKVxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gcmVxdWlyZXMgJHtmbXRQbHVyYWwoXCJrZXlcIiwgZXJyb3JzLmxlbmd0aCl9ICR7bWlzc2luZ31gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwibWluaW11bVwiOiB7XG4gICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGF0IGxlYXN0ICR7bGltaXR9YClcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY2FzZSBcImV4Y2x1c2l2ZU1pbmltdW1cIjoge1xuICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBtb3JlIHRoYW4gJHtsaW1pdH1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwibWF4aW11bVwiOiB7XG4gICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGF0IG1vc3QgJHtsaW1pdH1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwiZXhjbHVzaXZlTWF4aW11bVwiOiB7XG4gICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGxlc3MgdGhhbiAke2xpbWl0fWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJmb3JtYXRcIjoge1xuICAgICAgICBsZXQgZm9ybWF0ID0gZXJyb3JzWzBdLnBhcmFtcy5mb3JtYXRcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJlbWFpbFwiKSBmb3JtYXQgPSBcImVtYWlsIGFkZHJlc3NcIlxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGZvcm1hdHRlZCBhcyAke2Zvcm1hdH1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwibWluTGVuZ3RoXCI6IHtcbiAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgYXQgbGVhc3QgJHtsaW1pdH0gJHtmbXRQbHVyYWwoXCJjaGFyYWN0ZXJcIiwgbGltaXQpfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJtYXhMZW5ndGhcIjoge1xuICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBtb3N0ICR7bGltaXR9ICR7Zm10UGx1cmFsKFwiY2hhcmFjdGVyXCIsIGxpbWl0KX1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gZmFpbGVkIGNvbnN0cmFpbnRgKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbLi4ubWVzc2FnZXNdXG59XG5cbmNvbnN0IGZtdFByb3AgPSBwcm9wID0+IGAnJHtwcm9wfSdgXG5jb25zdCBmbXRQYXRoID0gcGF0aCA9PiBwYXRoID8gYCcke3BhdGguc2xpY2UoMSl9J2AgOiBcInJlcXVlc3QgYm9keVwiXG5jb25zdCBmbXRQbHVyYWwgPSAod29yZCwgY291bnQpID0+IGAke3dvcmR9JHtjb3VudCA+IDEgPyBcInNcIiA6IFwiXCJ9YFxuIl19