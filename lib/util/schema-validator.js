"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createValidator = createValidator;

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

var _switch = require("ajv-keywords/keywords/switch");

var _switch2 = _interopRequireDefault(_switch);

var _select = require("ajv-keywords/keywords/select");

var _select2 = _interopRequireDefault(_select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const instance = (0, _ajv2.default)({
  allErrors: true,
  $data: true
});

/* Force default metadata schema to be computed to avoid warnings when
   adding the select and switch keywords. */

instance.validateSchema({});

(0, _switch2.default)(instance);
(0, _select2.default)(instance);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3NjaGVtYS12YWxpZGF0b3IuanMiXSwibmFtZXMiOlsiY3JlYXRlVmFsaWRhdG9yIiwiaW5zdGFuY2UiLCJhbGxFcnJvcnMiLCIkZGF0YSIsInZhbGlkYXRlU2NoZW1hIiwic2NoZW1hIiwidmFsaWRhdGUiLCJjb21waWxlIiwiYm9keSIsImdyb3VwZWQiLCJNYXAiLCJlcnJvciIsImVycm9ycyIsImtleSIsInNjaGVtYVBhdGgiLCJkYXRhUGF0aCIsInNldCIsImdldCIsInB1c2giLCJtZXNzYWdlcyIsIlNldCIsImtleXdvcmQiLCJwYXRoIiwiZm10UGF0aCIsInR5cGUiLCJwYXJhbXMiLCJhZGQiLCJ2YWx1ZXMiLCJhbGxvd2VkVmFsdWVzIiwibWFwIiwidmFsIiwiZm10UHJvcCIsImpvaW4iLCJsZW5ndGgiLCJ1bmtub3duIiwiZXJyIiwiYWRkaXRpb25hbFByb3BlcnR5IiwiZm10UGx1cmFsIiwibWlzc2luZyIsIm1pc3NpbmdQcm9wZXJ0eSIsImxpbWl0IiwiZm9ybWF0IiwicHJvcCIsInNsaWNlIiwid29yZCIsImNvdW50Il0sIm1hcHBpbmdzIjoiOzs7OztRQW9CZ0JBLGUsR0FBQUEsZTs7QUFuQmhCOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBSUEsTUFBTUMsV0FBVyxtQkFBSTtBQUNuQkMsYUFBVyxJQURRO0FBRW5CQyxTQUFPO0FBRlksQ0FBSixDQUFqQjs7QUFLQTs7O0FBRUFGLFNBQVNHLGNBQVQsQ0FBd0IsRUFBeEI7O0FBRUEsc0JBQWNILFFBQWQ7QUFDQSxzQkFBY0EsUUFBZDs7QUFFTyxTQUFTRCxlQUFULENBQXlCSyxNQUF6QixFQUFvRDtBQUN6RCxRQUFNQyxXQUFXTCxTQUFTTSxPQUFULENBQWlCRixNQUFqQixDQUFqQjs7QUFFQSxTQUFRRyxJQUFELElBQWlCO0FBQ3RCLFFBQUlGLFNBQVNFLElBQVQsQ0FBSixFQUFvQixPQUFPLEVBQVA7O0FBRXBCLFVBQU1DLFVBQVUsSUFBSUMsR0FBSixFQUFoQjtB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WUFBWSxDQUFDTyxJQUFELEVBQU9DLEtBQVAsS0FBa0IsR0FBRUQsSUFBSyxHQUFFQyxRQUFRLENBQVIsR0FBWSxHQUFaLEdBQWtCLEVBQUcsRUFBbEUiLCJmaWxlIjoic2NoZW1hLXZhbGlkYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgYWp2IGZyb20gXCJhanZcIlxuXG5pbXBvcnQga2V5d29yZFN3aXRjaCBmcm9tIFwiYWp2LWtleXdvcmRzL2tleXdvcmRzL3N3aXRjaFwiXG5pbXBvcnQga2V5d29yZFNlbGVjdCBmcm9tIFwiYWp2LWtleXdvcmRzL2tleXdvcmRzL3NlbGVjdFwiXG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRvciA9IChib2R5OiBtaXhlZCkgPT4gc3RyaW5nW11cblxuY29uc3QgaW5zdGFuY2UgPSBhanYoe1xuICBhbGxFcnJvcnM6IHRydWUsXG4gICRkYXRhOiB0cnVlLFxufSlcblxuLyogRm9yY2UgZGVmYXVsdCBtZXRhZGF0YSBzY2hlbWEgdG8gYmUgY29tcHV0ZWQgdG8gYXZvaWQgd2FybmluZ3Mgd2hlblxuICAgYWRkaW5nIHRoZSBzZWxlY3QgYW5kIHN3aXRjaCBrZXl3b3Jkcy4gKi9cbmluc3RhbmNlLnZhbGlkYXRlU2NoZW1hKHt9KVxuXG5rZXl3b3JkU3dpdGNoKGluc3RhbmNlKVxua2V5d29yZFNlbGVjdChpbnN0YW5jZSlcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZhbGlkYXRvcihzY2hlbWE6IE9iamVjdCk6IFZhbGlkYXRvciB7XG4gIGNvbnN0IHZhbGlkYXRlID0gaW5zdGFuY2UuY29tcGlsZShzY2hlbWEpXG5cbiAgcmV0dXJuIChib2R5OiBtaXhlZCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZShib2R5KSkgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBncm91cGVkID0gbmV3IE1hcFxuICAgIGZvciAoY29uc3QgZXJyb3Igb2YgdmFsaWRhdGUuZXJyb3JzKSB7XG4gICAgICBjb25zdCBrZXkgPSBlcnJvci5zY2hlbWFQYXRoICsgXCI6XCIgKyBlcnJvci5kYXRhUGF0aFxuICAgICAgbGV0IHNldCA9IGdyb3VwZWQuZ2V0KGtleSlcbiAgICAgIGlmICghc2V0KSB7XG4gICAgICAgIHNldCA9IFtdXG4gICAgICAgIGdyb3VwZWQuc2V0KGtleSwgc2V0KVxuICAgICAgfVxuXG4gICAgICBzZXQucHVzaChlcnJvcilcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IG5ldyBTZXRcbiAgICBmb3IgKGNvbnN0IFsgLCBlcnJvcnNdIG9mIGdyb3VwZWQpIHtcbiAgICAgIGNvbnN0IHtrZXl3b3JkLCBkYXRhUGF0aH0gPSBlcnJvcnNbMF1cblxuICAgICAgY29uc3QgcGF0aCA9IGZtdFBhdGgoZGF0YVBhdGgpXG4gICAgICBzd2l0Y2ggKGtleXdvcmQpIHtcbiAgICAgICAgY2FzZSBcInR5cGVcIjoge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSBlcnJvcnNbMF0ucGFyYW1zLnR5cGVcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlICR7dHlwZX1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZW51bVwiOiB7XG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gZXJyb3JzWzBdLnBhcmFtcy5hbGxvd2VkVmFsdWVzLm1hcCh2YWwgPT4gZm10UHJvcCh2YWwpKS5qb2luKFwiLCBcIilcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlICR7ZXJyb3JzWzBdLnBhcmFtcy5hbGxvd2VkVmFsdWVzLmxlbmd0aCA+IDEgPyBcIm9uZSBvZiBcIiA6IFwiXCJ9JHt2YWx1ZXN9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICBjb25zdCB1bmtub3duID0gZXJyb3JzLm1hcChlcnIgPT4gZm10UHJvcChlcnIucGFyYW1zLmFkZGl0aW9uYWxQcm9wZXJ0eSkpLmpvaW4oXCIsIFwiKVxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBoYXMgdW5rbm93biAke2ZtdFBsdXJhbChcImtleVwiLCBlcnJvcnMubGVuZ3RoKX0gJHt1bmtub3dufWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJyZXF1aXJlZFwiOiB7XG4gICAgICAgICAgY29uc3QgbWlzc2luZyA9IGVycm9ycy5tYXAoZXJyID0+IGZtdFByb3AoZXJyLnBhcmFtcy5taXNzaW5nUHJvcGVydHkpKS5qb2luKFwiLCBcIilcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gcmVxdWlyZXMgJHtmbXRQbHVyYWwoXCJrZXlcIiwgZXJyb3JzLmxlbmd0aCl9ICR7bWlzc2luZ31gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwibWluaW11bVwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBsZWFzdCAke2xpbWl0fWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJleGNsdXNpdmVNaW5pbXVtXCI6IHtcbiAgICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIG1vcmUgdGhhbiAke2xpbWl0fWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJtYXhpbXVtXCI6IHtcbiAgICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGF0IG1vc3QgJHtsaW1pdH1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZXhjbHVzaXZlTWF4aW11bVwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBsZXNzIHRoYW4gJHtsaW1pdH1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICBsZXQgZm9ybWF0ID0gZXJyb3JzWzBdLnBhcmFtcy5mb3JtYXRcbiAgICAgICAgICBpZiAoZm9ybWF0ID09PSBcImVtYWlsXCIpIGZvcm1hdCA9IFwiZW1haWwgYWRkcmVzc1wiXG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBmb3JtYXR0ZWQgYXMgJHtmb3JtYXR9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcIm1pbkxlbmd0aFwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBsZWFzdCAke2xpbWl0fSAke2ZtdFBsdXJhbChcImNoYXJhY3RlclwiLCBsaW1pdCl9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcIm1heExlbmd0aFwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBtb3N0ICR7bGltaXR9ICR7Zm10UGx1cmFsKFwiY2hhcmFjdGVyXCIsIGxpbWl0KX1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBmYWlsZWQgY29uc3RyYWludGApXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFsuLi5tZXNzYWdlc11cbiAgfVxufVxuXG5jb25zdCBmbXRQcm9wID0gcHJvcCA9PiBgJyR7cHJvcH0nYFxuY29uc3QgZm10UGF0aCA9IHBhdGggPT4gcGF0aCA/IGAnJHtwYXRoLnNsaWNlKDEpfSdgIDogXCJyZXF1ZXN0IGJvZHlcIlxuY29uc3QgZm10UGx1cmFsID0gKHdvcmQsIGNvdW50KSA9PiBgJHt3b3JkfSR7Y291bnQgPiAxID8gXCJzXCIgOiBcIlwifWBcbiJdfQ==