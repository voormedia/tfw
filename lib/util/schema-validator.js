"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createValidator = createValidator;

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const instance = (0, _ajv2.default)({
  allErrors: true
});


instance.addFormat("rfc2822-datetime",
/* Based on http://regexlib.com/REDetails.aspx?regexp_id=969 */
/^((Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+)?(0?[1-9]|[1-2][0-9]|3[01])\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(19[0-9]{2}|[2-9][0-9]{3}|[0-9]{2})\s+(2[0-3]|[0-1][0-9]):([0-5][0-9])(:(60|[0-5][0-9]))?\s+([-+][0-9]{2}[0-5][0-9]|(UT|GMT|(E|C|M|P)(ST|DT)|[A-IK-Z]))$/);

/* Force default metadata schema to be computed to avoid warnings when
   adding the select and switch keywords. */
instance.validateSchema({});

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

            switch (format) {
              case "email":
                format = "email address";break;
              case "rfc2822-datetime":
                format = "rfc 2822 date-time";break;
            }

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

        /* Ignore spurious errors regarding failing if/then/else. */
        case "if":
          break;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3NjaGVtYS12YWxpZGF0b3IuanMiXSwibmFtZXMiOlsiY3JlYXRlVmFsaWRhdG9yIiwiaW5zdGFuY2UiLCJhbGxFcnJvcnMiLCJhZGRGb3JtYXQiLCJ2YWxpZGF0ZVNjaGVtYSIsInNjaGVtYSIsInZhbGlkYXRlIiwiY29tcGlsZSIsImJvZHkiLCJncm91cGVkIiwiTWFwIiwiZXJyb3IiLCJlcnJvcnMiLCJrZXkiLCJzY2hlbWFQYXRoIiwiZGF0YVBhdGgiLCJzZXQiLCJnZXQiLCJwdXNoIiwibWVzc2FnZXMiLCJTZXQiLCJrZXl3b3JkIiwicGF0aCIsImZtdFBhdGgiLCJ0eXBlIiwicGFyYW1zIiwiYWRkIiwidmFsdWVzIiwiYWxsb3dlZFZhbHVlcyIsIm1hcCIsInZhbCIsImZtdFByb3AiLCJqb2luIiwibGVuZ3RoIiwidW5rbm93biIsImVyciIsImFkZGl0aW9uYWxQcm9wZXJ0eSIsImZtdFBsdXJhbCIsIm1pc3NpbmciLCJtaXNzaW5nUHJvcGVydHkiLCJsaW1pdCIsImZvcm1hdCIsInByb3AiLCJzbGljZSIsIndvcmQiLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFrQmdCQSxlLEdBQUFBLGU7O0FBakJoQjs7Ozs7O0FBSUEsTUFBTUMsV0FBVyxtQkFBSTtBQUNuQkMsYUFBVztBQURRLENBQUosQ0FBakI7OztBQUlBRCxTQUFTRSxTQUFULENBQW1CLGtCQUFuQjtBQUNFO0FBQ0EsaVJBRkY7O0FBS0E7O0FBRUFGLFNBQVNHLGNBQVQsQ0FBd0IsRUFBeEI7O0FBRU8sU0FBU0osZUFBVCxDQUF5QkssTUFBekIsRUFBb0Q7QUFDekQsUUFBTUMsV0FBV0wsU0FBU00sT0FBVCxDQUFpQkYsTUFBakIsQ0FBakI7O0FBRUEsU0FBUUcsSUFBRCxJQUFpQjtBQUN0QixRQUFJRixTQUFTRSxJQUFULENBQUosRUFBb0IsT0FBTyxFQUFQOztBQUVwQixVQUFNQyxVQUFVLElBQUlDLEdBQUosRUFBaEI7QUFDQSxTQUFLLE1BQU1DLEtB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VUQsUUFBUUEsT0FBUSxJQUFHQSxLQUFLcUIsS0FBTCxDQUFXLENBQVgsQ0FBYyxHQUF6QixHQUE4QixjQUF0RDtBQUNBLE1BQU1OLFlBQVksQ0FBQ08sSUFBRCxFQUFPQyxLQUFQLEtBQWtCLEdBQUVELElBQUssR0FBRUMsUUFBUSxDQUFSLEdBQVksR0FBWixHQUFrQixFQUFHLEVBQWxFIiwiZmlsZSI6InNjaGVtYS12YWxpZGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IGFqdiBmcm9tIFwiYWp2XCJcblxuZXhwb3J0IHR5cGUgVmFsaWRhdG9yID0gKGJvZHk6IG1peGVkKSA9PiBzdHJpbmdbXVxuXG5jb25zdCBpbnN0YW5jZSA9IGFqdih7XG4gIGFsbEVycm9yczogdHJ1ZSxcbn0pXG5cbmluc3RhbmNlLmFkZEZvcm1hdChcInJmYzI4MjItZGF0ZXRpbWVcIixcbiAgLyogQmFzZWQgb24gaHR0cDovL3JlZ2V4bGliLmNvbS9SRURldGFpbHMuYXNweD9yZWdleHBfaWQ9OTY5ICovXG4gIC9eKChTdW58TW9ufFR1ZXxXZWR8VGh1fEZyaXxTYXQpLD9cXHMrKT8oMD9bMS05XXxbMS0yXVswLTldfDNbMDFdKVxccysoSmFufEZlYnxNYXJ8QXByfE1heXxKdW58SnVsfEF1Z3xTZXB8T2N0fE5vdnxEZWMpXFxzKygxOVswLTldezJ9fFsyLTldWzAtOV17M318WzAtOV17Mn0pXFxzKygyWzAtM118WzAtMV1bMC05XSk6KFswLTVdWzAtOV0pKDooNjB8WzAtNV1bMC05XSkpP1xccysoWy0rXVswLTldezJ9WzAtNV1bMC05XXwoVVR8R01UfChFfEN8TXxQKShTVHxEVCl8W0EtSUstWl0pKSQvXG4pXG5cbi8qIEZvcmNlIGRlZmF1bHQgbWV0YWRhdGEgc2NoZW1hIHRvIGJlIGNvbXB1dGVkIHRvIGF2b2lkIHdhcm5pbmdzIHdoZW5cbiAgIGFkZGluZyB0aGUgc2VsZWN0IGFuZCBzd2l0Y2gga2V5d29yZHMuICovXG5pbnN0YW5jZS52YWxpZGF0ZVNjaGVtYSh7fSlcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZhbGlkYXRvcihzY2hlbWE6IE9iamVjdCk6IFZhbGlkYXRvciB7XG4gIGNvbnN0IHZhbGlkYXRlID0gaW5zdGFuY2UuY29tcGlsZShzY2hlbWEpXG5cbiAgcmV0dXJuIChib2R5OiBtaXhlZCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZShib2R5KSkgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBncm91cGVkID0gbmV3IE1hcFxuICAgIGZvciAoY29uc3QgZXJyb3Igb2YgdmFsaWRhdGUuZXJyb3JzKSB7XG4gICAgICBjb25zdCBrZXkgPSBlcnJvci5zY2hlbWFQYXRoICsgXCI6XCIgKyBlcnJvci5kYXRhUGF0aFxuICAgICAgbGV0IHNldCA9IGdyb3VwZWQuZ2V0KGtleSlcbiAgICAgIGlmICghc2V0KSB7XG4gICAgICAgIHNldCA9IFtdXG4gICAgICAgIGdyb3VwZWQuc2V0KGtleSwgc2V0KVxuICAgICAgfVxuXG4gICAgICBzZXQucHVzaChlcnJvcilcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IG5ldyBTZXRcbiAgICBmb3IgKGNvbnN0IFsgLCBlcnJvcnNdIG9mIGdyb3VwZWQpIHtcbiAgICAgIGNvbnN0IHtrZXl3b3JkLCBkYXRhUGF0aH0gPSBlcnJvcnNbMF1cblxuICAgICAgY29uc3QgcGF0aCA9IGZtdFBhdGgoZGF0YVBhdGgpXG4gICAgICBzd2l0Y2ggKGtleXdvcmQpIHtcbiAgICAgICAgY2FzZSBcInR5cGVcIjoge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSBlcnJvcnNbMF0ucGFyYW1zLnR5cGVcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlICR7dHlwZX1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZW51bVwiOiB7XG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gZXJyb3JzWzBdLnBhcmFtcy5hbGxvd2VkVmFsdWVzLm1hcCh2YWwgPT4gZm10UHJvcCh2YWwpKS5qb2luKFwiLCBcIilcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlICR7ZXJyb3JzWzBdLnBhcmFtcy5hbGxvd2VkVmFsdWVzLmxlbmd0aCA+IDEgPyBcIm9uZSBvZiBcIiA6IFwiXCJ9JHt2YWx1ZXN9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICBjb25zdCB1bmtub3duID0gZXJyb3JzLm1hcChlcnIgPT4gZm10UHJvcChlcnIucGFyYW1zLmFkZGl0aW9uYWxQcm9wZXJ0eSkpLmpvaW4oXCIsIFwiKVxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBoYXMgdW5rbm93biAke2ZtdFBsdXJhbChcImtleVwiLCBlcnJvcnMubGVuZ3RoKX0gJHt1bmtub3dufWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJyZXF1aXJlZFwiOiB7XG4gICAgICAgICAgY29uc3QgbWlzc2luZyA9IGVycm9ycy5tYXAoZXJyID0+IGZtdFByb3AoZXJyLnBhcmFtcy5taXNzaW5nUHJvcGVydHkpKS5qb2luKFwiLCBcIilcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gcmVxdWlyZXMgJHtmbXRQbHVyYWwoXCJrZXlcIiwgZXJyb3JzLmxlbmd0aCl9ICR7bWlzc2luZ31gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwibWluaW11bVwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBsZWFzdCAke2xpbWl0fWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJleGNsdXNpdmVNaW5pbXVtXCI6IHtcbiAgICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIG1vcmUgdGhhbiAke2xpbWl0fWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJtYXhpbXVtXCI6IHtcbiAgICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGF0IG1vc3QgJHtsaW1pdH1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZXhjbHVzaXZlTWF4aW11bVwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBsZXNzIHRoYW4gJHtsaW1pdH1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICBsZXQgZm9ybWF0ID0gZXJyb3JzWzBdLnBhcmFtcy5mb3JtYXRcblxuICAgICAgICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICAgICAgY2FzZSBcImVtYWlsXCI6IGZvcm1hdCA9IFwiZW1haWwgYWRkcmVzc1wiOyBicmVha1xuICAgICAgICAgIGNhc2UgXCJyZmMyODIyLWRhdGV0aW1lXCI6IGZvcm1hdCA9IFwicmZjIDI4MjIgZGF0ZS10aW1lXCI7IGJyZWFrXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBmb3JtYXR0ZWQgYXMgJHtmb3JtYXR9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcIm1pbkxlbmd0aFwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBsZWFzdCAke2xpbWl0fSAke2ZtdFBsdXJhbChcImNoYXJhY3RlclwiLCBsaW1pdCl9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcIm1heExlbmd0aFwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBtb3N0ICR7bGltaXR9ICR7Zm10UGx1cmFsKFwiY2hhcmFjdGVyXCIsIGxpbWl0KX1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICAvKiBJZ25vcmUgc3B1cmlvdXMgZXJyb3JzIHJlZ2FyZGluZyBmYWlsaW5nIGlmL3RoZW4vZWxzZS4gKi9cbiAgICAgICAgY2FzZSBcImlmXCI6IGJyZWFrXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gZmFpbGVkIGNvbnN0cmFpbnRgKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBbLi4ubWVzc2FnZXNdXG4gIH1cbn1cblxuY29uc3QgZm10UHJvcCA9IHByb3AgPT4gYCcke3Byb3B9J2BcbmNvbnN0IGZtdFBhdGggPSBwYXRoID0+IHBhdGggPyBgJyR7cGF0aC5zbGljZSgxKX0nYCA6IFwicmVxdWVzdCBib2R5XCJcbmNvbnN0IGZtdFBsdXJhbCA9ICh3b3JkLCBjb3VudCkgPT4gYCR7d29yZH0ke2NvdW50ID4gMSA/IFwic1wiIDogXCJcIn1gXG4iXX0=