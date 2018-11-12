"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createValidator = createValidator;

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

var _switch = require("ajv-keywords/keywords/switch");

var _switch2 = _interopRequireDefault(_switch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const instance = (0, _ajv2.default)({
  allErrors: true,
  $data: true
});

/* Force default metadata schema to be computed to avoid warnings when
   adding the select and switch keywords. */
instance.validateSchema({});

(0, _switch2.default)(instance);

function createValidator(schema) {
  const validate = instance.compile(schema);

  return body => {
    if (validate(body)) return [];

    const grouped = new Map();
    for (const error of validate.errors) {
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
  };
}

const fmtProp = prop => `'${prop}'`;
const fmtPath = path => path ? `'${path.slice(1)}'` : "request body";
const fmtPlural = (word, count) => `${word}${count > 1 ? "s" : ""}`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3NjaGVtYS12YWxpZGF0b3IuanMiXSwibmFtZXMiOlsiY3JlYXRlVmFsaWRhdG9yIiwiaW5zdGFuY2UiLCJhbGxFcnJvcnMiLCIkZGF0YSIsInZhbGlkYXRlU2NoZW1hIiwic2NoZW1hIiwidmFsaWRhdGUiLCJjb21waWxlIiwiYm9keSIsImdyb3VwZWQiLCJNYXAiLCJlcnJvciIsImVycm9ycyIsImtleSIsInNjaGVtYVBhdGgiLCJkYXRhUGF0aCIsInNldCIsImdldCIsInB1c2giLCJtZXNzYWdlcyIsIlNldCIsImtleXdvcmQiLCJwYXRoIiwiZm10UGF0aCIsInR5cGUiLCJwYXJhbXMiLCJhZGQiLCJ2YWx1ZXMiLCJhbGxvd2VkVmFsdWVzIiwibWFwIiwidmFsIiwiZm10UHJvcCIsImpvaW4iLCJsZW5ndGgiLCJ1bmtub3duIiwiZXJyIiwiYWRkaXRpb25hbFByb3BlcnR5IiwiZm10UGx1cmFsIiwibWlzc2luZyIsIm1pc3NpbmdQcm9wZXJ0eSIsImxpbWl0IiwiZm9ybWF0IiwicHJvcCIsInNsaWNlIiwid29yZCIsImNvdW50Il0sIm1hcHBpbmdzIjoiOzs7OztRQWtCZ0JBLGUsR0FBQUEsZTs7QUFqQmhCOzs7O0FBRUE7Ozs7OztBQUlBLE1BQU1DLFdBQVcsbUJBQUk7QUFDbkJDLGFBQVcsSUFEUTtBQUVuQkMsU0FBTztBQUZZLENBQUosQ0FBakI7O0FBS0E7O0FBRUFGLFNBQVNHLGNBQVQsQ0FBd0IsRUFBeEI7O0FBRUEsc0JBQWNILFFBQWQ7O0FBRU8sU0FBU0QsZUFBVCxDQUF5QkssTUFBekIsRUFBb0Q7QUFDekQsUUFBTUMsV0FBV0wsU0FBU00sT0FBVCxDQUFpQkYsTUFBakIsQ0FBakI7O0FBRUEsU0FBUUcsSUFBRCxJQUFpQjtBQUN0QixRQUFJRixTQUFTRSxJQUFULENBQUosRUFBb0IsT0FBTyxFQUFQOztBQUVwQixVQUFNQyxVQUFVLElBQUlDLEdBQUosRUFBaEI7QUFDQSxTQUFLLE1BQU1DLEtBQVgsSUFBb0JM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LEtBQWtCLEdBQUVELElBQUssR0FBRUMsUUFBUSxDQUFSLEdBQVksR0FBWixHQUFrQixFQUFHLEVBQWxFIiwiZmlsZSI6InNjaGVtYS12YWxpZGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IGFqdiBmcm9tIFwiYWp2XCJcblxuaW1wb3J0IGtleXdvcmRTd2l0Y2ggZnJvbSBcImFqdi1rZXl3b3Jkcy9rZXl3b3Jkcy9zd2l0Y2hcIlxuXG5leHBvcnQgdHlwZSBWYWxpZGF0b3IgPSAoYm9keTogbWl4ZWQpID0+IHN0cmluZ1tdXG5cbmNvbnN0IGluc3RhbmNlID0gYWp2KHtcbiAgYWxsRXJyb3JzOiB0cnVlLFxuICAkZGF0YTogdHJ1ZSxcbn0pXG5cbi8qIEZvcmNlIGRlZmF1bHQgbWV0YWRhdGEgc2NoZW1hIHRvIGJlIGNvbXB1dGVkIHRvIGF2b2lkIHdhcm5pbmdzIHdoZW5cbiAgIGFkZGluZyB0aGUgc2VsZWN0IGFuZCBzd2l0Y2gga2V5d29yZHMuICovXG5pbnN0YW5jZS52YWxpZGF0ZVNjaGVtYSh7fSlcblxua2V5d29yZFN3aXRjaChpbnN0YW5jZSlcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZhbGlkYXRvcihzY2hlbWE6IE9iamVjdCk6IFZhbGlkYXRvciB7XG4gIGNvbnN0IHZhbGlkYXRlID0gaW5zdGFuY2UuY29tcGlsZShzY2hlbWEpXG5cbiAgcmV0dXJuIChib2R5OiBtaXhlZCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZShib2R5KSkgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBncm91cGVkID0gbmV3IE1hcFxuICAgIGZvciAoY29uc3QgZXJyb3Igb2YgdmFsaWRhdGUuZXJyb3JzKSB7XG4gICAgICBjb25zdCBrZXkgPSBlcnJvci5zY2hlbWFQYXRoICsgXCI6XCIgKyBlcnJvci5kYXRhUGF0aFxuICAgICAgbGV0IHNldCA9IGdyb3VwZWQuZ2V0KGtleSlcbiAgICAgIGlmICghc2V0KSB7XG4gICAgICAgIHNldCA9IFtdXG4gICAgICAgIGdyb3VwZWQuc2V0KGtleSwgc2V0KVxuICAgICAgfVxuXG4gICAgICBzZXQucHVzaChlcnJvcilcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IG5ldyBTZXRcbiAgICBmb3IgKGNvbnN0IFsgLCBlcnJvcnNdIG9mIGdyb3VwZWQpIHtcbiAgICAgIGNvbnN0IHtrZXl3b3JkLCBkYXRhUGF0aH0gPSBlcnJvcnNbMF1cblxuICAgICAgY29uc3QgcGF0aCA9IGZtdFBhdGgoZGF0YVBhdGgpXG4gICAgICBzd2l0Y2ggKGtleXdvcmQpIHtcbiAgICAgICAgY2FzZSBcInR5cGVcIjoge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSBlcnJvcnNbMF0ucGFyYW1zLnR5cGVcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlICR7dHlwZX1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZW51bVwiOiB7XG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gZXJyb3JzWzBdLnBhcmFtcy5hbGxvd2VkVmFsdWVzLm1hcCh2YWwgPT4gZm10UHJvcCh2YWwpKS5qb2luKFwiLCBcIilcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlICR7ZXJyb3JzWzBdLnBhcmFtcy5hbGxvd2VkVmFsdWVzLmxlbmd0aCA+IDEgPyBcIm9uZSBvZiBcIiA6IFwiXCJ9JHt2YWx1ZXN9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICBjb25zdCB1bmtub3duID0gZXJyb3JzLm1hcChlcnIgPT4gZm10UHJvcChlcnIucGFyYW1zLmFkZGl0aW9uYWxQcm9wZXJ0eSkpLmpvaW4oXCIsIFwiKVxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBoYXMgdW5rbm93biAke2ZtdFBsdXJhbChcImtleVwiLCBlcnJvcnMubGVuZ3RoKX0gJHt1bmtub3dufWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJyZXF1aXJlZFwiOiB7XG4gICAgICAgICAgY29uc3QgbWlzc2luZyA9IGVycm9ycy5tYXAoZXJyID0+IGZtdFByb3AoZXJyLnBhcmFtcy5taXNzaW5nUHJvcGVydHkpKS5qb2luKFwiLCBcIilcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gcmVxdWlyZXMgJHtmbXRQbHVyYWwoXCJrZXlcIiwgZXJyb3JzLmxlbmd0aCl9ICR7bWlzc2luZ31gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwibWluaW11bVwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBsZWFzdCAke2xpbWl0fWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJleGNsdXNpdmVNaW5pbXVtXCI6IHtcbiAgICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIG1vcmUgdGhhbiAke2xpbWl0fWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJtYXhpbXVtXCI6IHtcbiAgICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGF0IG1vc3QgJHtsaW1pdH1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZXhjbHVzaXZlTWF4aW11bVwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBsZXNzIHRoYW4gJHtsaW1pdH1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICBsZXQgZm9ybWF0ID0gZXJyb3JzWzBdLnBhcmFtcy5mb3JtYXRcbiAgICAgICAgICBpZiAoZm9ybWF0ID09PSBcImVtYWlsXCIpIGZvcm1hdCA9IFwiZW1haWwgYWRkcmVzc1wiXG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBmb3JtYXR0ZWQgYXMgJHtmb3JtYXR9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcIm1pbkxlbmd0aFwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBsZWFzdCAke2xpbWl0fSAke2ZtdFBsdXJhbChcImNoYXJhY3RlclwiLCBsaW1pdCl9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcIm1heExlbmd0aFwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBtb3N0ICR7bGltaXR9ICR7Zm10UGx1cmFsKFwiY2hhcmFjdGVyXCIsIGxpbWl0KX1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBmYWlsZWQgY29uc3RyYWludGApXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFsuLi5tZXNzYWdlc11cbiAgfVxufVxuXG5jb25zdCBmbXRQcm9wID0gcHJvcCA9PiBgJyR7cHJvcH0nYFxuY29uc3QgZm10UGF0aCA9IHBhdGggPT4gcGF0aCA/IGAnJHtwYXRoLnNsaWNlKDEpfSdgIDogXCJyZXF1ZXN0IGJvZHlcIlxuY29uc3QgZm10UGx1cmFsID0gKHdvcmQsIGNvdW50KSA9PiBgJHt3b3JkfSR7Y291bnQgPiAxID8gXCJzXCIgOiBcIlwifWBcbiJdfQ==