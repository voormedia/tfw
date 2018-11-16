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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3NjaGVtYS12YWxpZGF0b3IuanMiXSwibmFtZXMiOlsiY3JlYXRlVmFsaWRhdG9yIiwiaW5zdGFuY2UiLCJhbGxFcnJvcnMiLCJ2YWxpZGF0ZVNjaGVtYSIsInNjaGVtYSIsInZhbGlkYXRlIiwiY29tcGlsZSIsImJvZHkiLCJncm91cGVkIiwiTWFwIiwiZXJyb3IiLCJlcnJvcnMiLCJrZXkiLCJzY2hlbWFQYXRoIiwiZGF0YVBhdGgiLCJzZXQiLCJnZXQiLCJwdXNoIiwibWVzc2FnZXMiLCJTZXQiLCJrZXl3b3JkIiwicGF0aCIsImZtdFBhdGgiLCJ0eXBlIiwicGFyYW1zIiwiYWRkIiwidmFsdWVzIiwiYWxsb3dlZFZhbHVlcyIsIm1hcCIsInZhbCIsImZtdFByb3AiLCJqb2luIiwibGVuZ3RoIiwidW5rbm93biIsImVyciIsImFkZGl0aW9uYWxQcm9wZXJ0eSIsImZtdFBsdXJhbCIsIm1pc3NpbmciLCJtaXNzaW5nUHJvcGVydHkiLCJsaW1pdCIsImZvcm1hdCIsInByb3AiLCJzbGljZSIsIndvcmQiLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFhZ0JBLGUsR0FBQUEsZTs7QUFaaEI7Ozs7OztBQUlBLE1BQU1DLFdBQVcsbUJBQUk7QUFDbkJDLGFBQVc7QUFEUSxDQUFKLENBQWpCOztBQUlBOzs7QUFFQUQsU0FBU0UsY0FBVCxDQUF3QixFQUF4Qjs7QUFFTyxTQUFTSCxlQUFULENBQXlCSSxNQUF6QixFQUFvRDtBQUN6RCxRQUFNQyxXQUFXSixTQUFTSyxPQUFULENBQWlCRixNQUFqQixDQUFqQjs7QUFFQSxTQUFRRyxJQUFELElBQWlCO0FBQ3RCLFFBQUlGLFNBQVNFLElBQVQsQ0FBSixFQUFvQixPQUFPLEVBQVA7O0FBRXBCLFVBQU1DLFVBQVUsSUFBSUMsR0FBSixFQUFoQjtBQUNBLFNBQUssTUFBTUMsS0FBWCxJQUFvQkwsU0FBU00sTUFBN0IsRUFBcUM7QUFDbkMsWUFBTUMsTUFBTUYsTUFBTUcsVUFBTixHQUFt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QVEsQ0FBUixHQUFZLEdBQVosR0FBa0IsRUFBRyxFQUFsRSIsImZpbGUiOiJzY2hlbWEtdmFsaWRhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBhanYgZnJvbSBcImFqdlwiXG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRvciA9IChib2R5OiBtaXhlZCkgPT4gc3RyaW5nW11cblxuY29uc3QgaW5zdGFuY2UgPSBhanYoe1xuICBhbGxFcnJvcnM6IHRydWUsXG59KVxuXG4vKiBGb3JjZSBkZWZhdWx0IG1ldGFkYXRhIHNjaGVtYSB0byBiZSBjb21wdXRlZCB0byBhdm9pZCB3YXJuaW5ncyB3aGVuXG4gICBhZGRpbmcgdGhlIHNlbGVjdCBhbmQgc3dpdGNoIGtleXdvcmRzLiAqL1xuaW5zdGFuY2UudmFsaWRhdGVTY2hlbWEoe30pXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWYWxpZGF0b3Ioc2NoZW1hOiBPYmplY3QpOiBWYWxpZGF0b3Ige1xuICBjb25zdCB2YWxpZGF0ZSA9IGluc3RhbmNlLmNvbXBpbGUoc2NoZW1hKVxuXG4gIHJldHVybiAoYm9keTogbWl4ZWQpID0+IHtcbiAgICBpZiAodmFsaWRhdGUoYm9keSkpIHJldHVybiBbXVxuXG4gICAgY29uc3QgZ3JvdXBlZCA9IG5ldyBNYXBcbiAgICBmb3IgKGNvbnN0IGVycm9yIG9mIHZhbGlkYXRlLmVycm9ycykge1xuICAgICAgY29uc3Qga2V5ID0gZXJyb3Iuc2NoZW1hUGF0aCArIFwiOlwiICsgZXJyb3IuZGF0YVBhdGhcbiAgICAgIGxldCBzZXQgPSBncm91cGVkLmdldChrZXkpXG4gICAgICBpZiAoIXNldCkge1xuICAgICAgICBzZXQgPSBbXVxuICAgICAgICBncm91cGVkLnNldChrZXksIHNldClcbiAgICAgIH1cblxuICAgICAgc2V0LnB1c2goZXJyb3IpXG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZXMgPSBuZXcgU2V0XG4gICAgZm9yIChjb25zdCBbICwgZXJyb3JzXSBvZiBncm91cGVkKSB7XG4gICAgICBjb25zdCB7a2V5d29yZCwgZGF0YVBhdGh9ID0gZXJyb3JzWzBdXG5cbiAgICAgIGNvbnN0IHBhdGggPSBmbXRQYXRoKGRhdGFQYXRoKVxuICAgICAgc3dpdGNoIChrZXl3b3JkKSB7XG4gICAgICAgIGNhc2UgXCJ0eXBlXCI6IHtcbiAgICAgICAgICBjb25zdCB0eXBlID0gZXJyb3JzWzBdLnBhcmFtcy50eXBlXG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSAke3R5cGV9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcImVudW1cIjoge1xuICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGVycm9yc1swXS5wYXJhbXMuYWxsb3dlZFZhbHVlcy5tYXAodmFsID0+IGZtdFByb3AodmFsKSkuam9pbihcIiwgXCIpXG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSAke2Vycm9yc1swXS5wYXJhbXMuYWxsb3dlZFZhbHVlcy5sZW5ndGggPiAxID8gXCJvbmUgb2YgXCIgOiBcIlwifSR7dmFsdWVzfWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiB7XG4gICAgICAgICAgY29uc3QgdW5rbm93biA9IGVycm9ycy5tYXAoZXJyID0+IGZtdFByb3AoZXJyLnBhcmFtcy5hZGRpdGlvbmFsUHJvcGVydHkpKS5qb2luKFwiLCBcIilcbiAgICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gaGFzIHVua25vd24gJHtmbXRQbHVyYWwoXCJrZXlcIiwgZXJyb3JzLmxlbmd0aCl9ICR7dW5rbm93bn1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwicmVxdWlyZWRcIjoge1xuICAgICAgICAgIGNvbnN0IG1pc3NpbmcgPSBlcnJvcnMubWFwKGVyciA9PiBmbXRQcm9wKGVyci5wYXJhbXMubWlzc2luZ1Byb3BlcnR5KSkuam9pbihcIiwgXCIpXG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHJlcXVpcmVzICR7Zm10UGx1cmFsKFwia2V5XCIsIGVycm9ycy5sZW5ndGgpfSAke21pc3Npbmd9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcIm1pbmltdW1cIjoge1xuICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgYXQgbGVhc3QgJHtsaW1pdH1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiZXhjbHVzaXZlTWluaW11bVwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBtb3JlIHRoYW4gJHtsaW1pdH1gKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwibWF4aW11bVwiOiB7XG4gICAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBtb3N0ICR7bGltaXR9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcImV4Y2x1c2l2ZU1heGltdW1cIjoge1xuICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgbGVzcyB0aGFuICR7bGltaXR9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgbGV0IGZvcm1hdCA9IGVycm9yc1swXS5wYXJhbXMuZm9ybWF0XG4gICAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJlbWFpbFwiKSBmb3JtYXQgPSBcImVtYWlsIGFkZHJlc3NcIlxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgZm9ybWF0dGVkIGFzICR7Zm9ybWF0fWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJtaW5MZW5ndGhcIjoge1xuICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgYXQgbGVhc3QgJHtsaW1pdH0gJHtmbXRQbHVyYWwoXCJjaGFyYWN0ZXJcIiwgbGltaXQpfWApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgXCJtYXhMZW5ndGhcIjoge1xuICAgICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgYXQgbW9zdCAke2xpbWl0fSAke2ZtdFBsdXJhbChcImNoYXJhY3RlclwiLCBsaW1pdCl9YClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgLyogSWdub3JlIHNwdXJpb3VzIGVycm9ycyByZWdhcmRpbmcgZmFpbGluZyBpZi90aGVuL2Vsc2UuICovXG4gICAgICAgIGNhc2UgXCJpZlwiOiBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IGZhaWxlZCBjb25zdHJhaW50YClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gWy4uLm1lc3NhZ2VzXVxuICB9XG59XG5cbmNvbnN0IGZtdFByb3AgPSBwcm9wID0+IGAnJHtwcm9wfSdgXG5jb25zdCBmbXRQYXRoID0gcGF0aCA9PiBwYXRoID8gYCcke3BhdGguc2xpY2UoMSl9J2AgOiBcInJlcXVlc3QgYm9keVwiXG5jb25zdCBmbXRQbHVyYWwgPSAod29yZCwgY291bnQpID0+IGAke3dvcmR9JHtjb3VudCA+IDEgPyBcInNcIiA6IFwiXCJ9YFxuIl19