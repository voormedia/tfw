"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(schema, body) {
  const validator = (0, _ajv2.default)({
    allErrors: true,
    v5: true
  });

  validator.addFormat("url", data => {
    const parts = _url2.default.parse(data);
    if (!(parts.protocol && parts.protocol.startsWith("http"))) return false;
    return true;
  });

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
          const comparison = errors[0].params.exclusive ? "more than" : "at least";
          const limit = errors[0].params.limit;
          messages.add(`${path} should be ${comparison} ${limit}`);
          break;
        }

      case "maximum":
        {
          const comparison = errors[0].params.exclusive ? "less than" : "at most";
          const limit = errors[0].params.limit;
          messages.add(`${path} should be ${comparison} ${limit}`);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3NjaGVtYS12YWxpZGF0b3IuanMiXSwibmFtZXMiOlsidmFsaWRhdGUiLCJzY2hlbWEiLCJib2R5IiwidmFsaWRhdG9yIiwiYWxsRXJyb3JzIiwidjUiLCJhZGRGb3JtYXQiLCJkYXRhIiwicGFydHMiLCJwYXJzZSIsInByb3RvY29sIiwic3RhcnRzV2l0aCIsImdyb3VwZWQiLCJNYXAiLCJlcnJvciIsImVycm9ycyIsImtleSIsInNjaGVtYVBhdGgiLCJkYXRhUGF0aCIsInNldCIsImdldCIsInB1c2giLCJtZXNzYWdlcyIsIlNldCIsImtleXdvcmQiLCJwYXRoIiwiZm10UGF0aCIsInR5cGUiLCJwYXJhbXMiLCJhZGQiLCJ2YWx1ZXMiLCJhbGxvd2VkVmFsdWVzIiwibWFwIiwidmFsIiwiZm10UHJvcCIsImpvaW4iLCJsZW5ndGgiLCJ1bmtub3duIiwiZXJyIiwiYWRkaXRpb25hbFByb3BlcnR5IiwiZm10UGx1cmFsIiwibWlzc2luZyIsIm1pc3NpbmdQcm9wZXJ0eSIsImNvbXBhcmlzb24iLCJleGNsdXNpdmUiLCJsaW1pdCIsImZvcm1hdCIsInByb3AiLCJzbGljZSIsIndvcmQiLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFJZ0JBLFEsR0FBQUEsUTs7QUFIaEI7Ozs7QUFDQTs7Ozs7O0FBRU8sU0FBU0EsUUFBVCxDQUFrQkMsTUFBbEIsRUFBa0NDLElBQWxDLEVBQStDO0FBQ3BELFFBQU1DLFlBQVksbUJBQUk7QUFDcEJDLGVBQVcsSUFEUztBQUVwQkMsUUFBSTtBQUZnQixHQUFKLENBQWxCOztBQUtBRixZQUFVRyxTQUFWLENBQW9CLEtBQXBCLEVBQTJCQyxRQUFRO0FBQ2pDLFVBQU1DLFFBQVEsY0FBSUMsS0FBSixDQUFVRixJQUFWLENBQWQ7QUFDQSxRQUFJLEVBQUVDLE1BQU1FLFFBQU4sSUFBa0JGLE1BQU1FLFFBQU4sQ0FBZUMsVUFBZixDQUEwQixNQUExQixDQUFwQixDQUFKLEVBQTRELE9BQU8sS0FBUDtB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QUNBLE1BQU1SLFlBQVksQ0FBQ1MsSUFBRCxFQUFPQyxLQUFQLEtBQWtCLEdBQUVELElBQUssR0FBRUMsUUFBUSxDQUFSLEdBQVksR0FBWixHQUFrQixFQUFHLEVBQWxFIiwiZmlsZSI6InNjaGVtYS12YWxpZGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IGFqdiBmcm9tIFwiYWp2XCJcbmltcG9ydCB1cmwgZnJvbSBcInVybFwiXG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZShzY2hlbWE6IE9iamVjdCwgYm9keTogbWl4ZWQpIHtcbiAgY29uc3QgdmFsaWRhdG9yID0gYWp2KHtcbiAgICBhbGxFcnJvcnM6IHRydWUsXG4gICAgdjU6IHRydWUsXG4gIH0pXG5cbiAgdmFsaWRhdG9yLmFkZEZvcm1hdChcInVybFwiLCBkYXRhID0+IHtcbiAgICBjb25zdCBwYXJ0cyA9IHVybC5wYXJzZShkYXRhKVxuICAgIGlmICghKHBhcnRzLnByb3RvY29sICYmIHBhcnRzLnByb3RvY29sLnN0YXJ0c1dpdGgoXCJodHRwXCIpKSkgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbiAgfSlcblxuICBpZiAodmFsaWRhdG9yLnZhbGlkYXRlKHNjaGVtYSwgYm9keSkpIHJldHVybiBbXVxuXG4gIGNvbnN0IGdyb3VwZWQgPSBuZXcgTWFwXG4gIGZvciAoY29uc3QgZXJyb3Igb2YgdmFsaWRhdG9yLmVycm9ycykge1xuICAgIGNvbnN0IGtleSA9IGVycm9yLnNjaGVtYVBhdGggKyBcIjpcIiArIGVycm9yLmRhdGFQYXRoXG4gICAgbGV0IHNldCA9IGdyb3VwZWQuZ2V0KGtleSlcbiAgICBpZiAoIXNldCkge1xuICAgICAgc2V0ID0gW11cbiAgICAgIGdyb3VwZWQuc2V0KGtleSwgc2V0KVxuICAgIH1cblxuICAgIHNldC5wdXNoKGVycm9yKVxuICB9XG5cbiAgY29uc3QgbWVzc2FnZXMgPSBuZXcgU2V0XG4gIGZvciAoY29uc3QgWyAsIGVycm9yc10gb2YgZ3JvdXBlZCkge1xuICAgIGNvbnN0IHtrZXl3b3JkLCBkYXRhUGF0aH0gPSBlcnJvcnNbMF1cblxuICAgIGNvbnN0IHBhdGggPSBmbXRQYXRoKGRhdGFQYXRoKVxuICAgIHN3aXRjaCAoa2V5d29yZCkge1xuICAgICAgY2FzZSBcInR5cGVcIjoge1xuICAgICAgICBjb25zdCB0eXBlID0gZXJyb3JzWzBdLnBhcmFtcy50eXBlXG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgJHt0eXBlfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJlbnVtXCI6IHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gZXJyb3JzWzBdLnBhcmFtcy5hbGxvd2VkVmFsdWVzLm1hcCh2YWwgPT4gZm10UHJvcCh2YWwpKS5qb2luKFwiLCBcIilcbiAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSAke2Vycm9yc1swXS5wYXJhbXMuYWxsb3dlZFZhbHVlcy5sZW5ndGggPiAxID8gXCJvbmUgb2YgXCIgOiBcIlwifSR7dmFsdWVzfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiB7XG4gICAgICAgIGNvbnN0IHVua25vd24gPSBlcnJvcnMubWFwKGVyciA9PiBmbXRQcm9wKGVyci5wYXJhbXMuYWRkaXRpb25hbFByb3BlcnR5KSkuam9pbihcIiwgXCIpXG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBoYXMgdW5rbm93biAke2ZtdFBsdXJhbChcImtleVwiLCBlcnJvcnMubGVuZ3RoKX0gJHt1bmtub3dufWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJyZXF1aXJlZFwiOiB7XG4gICAgICAgIGNvbnN0IG1pc3NpbmcgPSBlcnJvcnMubWFwKGVyciA9PiBmbXRQcm9wKGVyci5wYXJhbXMubWlzc2luZ1Byb3BlcnR5KSkuam9pbihcIiwgXCIpXG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSByZXF1aXJlcyAke2ZtdFBsdXJhbChcImtleVwiLCBlcnJvcnMubGVuZ3RoKX0gJHttaXNzaW5nfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJtaW5pbXVtXCI6IHtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvbiA9IGVycm9yc1swXS5wYXJhbXMuZXhjbHVzaXZlID8gXCJtb3JlIHRoYW5cIiA6IFwiYXQgbGVhc3RcIlxuICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSAke2NvbXBhcmlzb259ICR7bGltaXR9YClcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY2FzZSBcIm1heGltdW1cIjoge1xuICAgICAgICBjb25zdCBjb21wYXJpc29uID0gZXJyb3JzWzBdLnBhcmFtcy5leGNsdXNpdmUgPyBcImxlc3MgdGhhblwiIDogXCJhdCBtb3N0XCJcbiAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgJHtjb21wYXJpc29ufSAke2xpbWl0fWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJmb3JtYXRcIjoge1xuICAgICAgICBsZXQgZm9ybWF0ID0gZXJyb3JzWzBdLnBhcmFtcy5mb3JtYXRcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJlbWFpbFwiKSBmb3JtYXQgPSBcImVtYWlsIGFkZHJlc3NcIlxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGZvcm1hdHRlZCBhcyAke2Zvcm1hdH1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwibWluTGVuZ3RoXCI6IHtcbiAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgYXQgbGVhc3QgJHtsaW1pdH0gJHtmbXRQbHVyYWwoXCJjaGFyYWN0ZXJcIiwgbGltaXQpfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJtYXhMZW5ndGhcIjoge1xuICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBtb3N0ICR7bGltaXR9ICR7Zm10UGx1cmFsKFwiY2hhcmFjdGVyXCIsIGxpbWl0KX1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gZmFpbGVkIGNvbnN0cmFpbnRgKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbLi4ubWVzc2FnZXNdXG59XG5cbmNvbnN0IGZtdFByb3AgPSBwcm9wID0+IGAnJHtwcm9wfSdgXG5jb25zdCBmbXRQYXRoID0gcGF0aCA9PiBwYXRoID8gYCcke3BhdGguc2xpY2UoMSl9J2AgOiBcInJlcXVlc3QgYm9keVwiXG5jb25zdCBmbXRQbHVyYWwgPSAod29yZCwgY291bnQpID0+IGAke3dvcmR9JHtjb3VudCA+IDEgPyBcInNcIiA6IFwiXCJ9YFxuIl19