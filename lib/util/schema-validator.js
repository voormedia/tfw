"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = validate;

var _ajv = require("ajv");

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(schema, body) {
  const validator = (0, _ajv2.default)({
    allErrors: true,
    v5: true
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3NjaGVtYS12YWxpZGF0b3IuanMiXSwibmFtZXMiOlsidmFsaWRhdGUiLCJzY2hlbWEiLCJib2R5IiwidmFsaWRhdG9yIiwiYWxsRXJyb3JzIiwidjUiLCJncm91cGVkIiwiTWFwIiwiZXJyb3IiLCJlcnJvcnMiLCJrZXkiLCJzY2hlbWFQYXRoIiwiZGF0YVBhdGgiLCJzZXQiLCJnZXQiLCJwdXNoIiwibWVzc2FnZXMiLCJTZXQiLCJrZXl3b3JkIiwicGF0aCIsImZtdFBhdGgiLCJ0eXBlIiwicGFyYW1zIiwiYWRkIiwidmFsdWVzIiwiYWxsb3dlZFZhbHVlcyIsIm1hcCIsInZhbCIsImZtdFByb3AiLCJqb2luIiwibGVuZ3RoIiwidW5rbm93biIsImVyciIsImFkZGl0aW9uYWxQcm9wZXJ0eSIsImZtdFBsdXJhbCIsIm1pc3NpbmciLCJtaXNzaW5nUHJvcGVydHkiLCJsaW1pdCIsImZvcm1hdCIsInByb3AiLCJzbGljZSIsIndvcmQiLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFHZ0JBLFEsR0FBQUEsUTs7QUFGaEI7Ozs7OztBQUVPLFNBQVNBLFFBQVQsQ0FBa0JDLE1BQWxCLEVBQWtDQyxJQUFsQyxFQUErQztBQUNwRCxRQUFNQyxZQUFZLG1CQUFJO0FBQ3BCQyxlQUFXLElBRFM7QUFFcEJDLFFBQUk7QUFGZ0IsR0FBSixDQUFsQjs7QUFLQSxNQUFJRixVQUFVSCxRQUFWLENBQW1CQyxNQUFuQixFQUEyQkMsSUFBM0IsQ0FBSixFQUFzQyxPQUFPLEVBQVA7O0FBRXRDLFFBQU1JLFVBQVUsSUFBSUMsR0FBSixFQUFoQjtBQUNBLE9BQUssTUFBTUMsS0FBWCxJQUFvQkwsVUFBVU0sTUFBOUIsRUFBc0M7QUFDcEMsVUFBTUMsTUFBTUYsTUFBTUcsVUFBTixHQUFtQixHQUFuQixHQUF5QkgsTUFBTUksUUFBM0M7QUFDQSxRQUFJQyxNQUFNUCxRQUFRUSxHQUFSLENBQVlKLEdBQVosQ0FBVjtBQUNBLFFBQUksQ0FBQ0csR0FB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QU8sQ0FBUCxFQUFVYSxNQUFWLENBQWlCZ0IsTUFBOUI7QUFDQSxjQUFJQSxXQUFXLE9BQWYsRUFBd0JBLFNBQVMsZUFBVDtBQUN4QnRCLG1CQUFTTyxHQUFULENBQWMsR0FBRUosSUFBSywyQkFBMEJtQixNQUFPLEVBQXREO0FBQ0E7QUFDRDs7QUFFRCxXQUFLLFdBQUw7QUFBa0I7QUFDaEIsZ0JBQU1ELFFBQVE1QixPQUFPLENBQVAsRUFBVWEsTUFBVixDQUFpQmUsS0FBL0I7QUFDQXJCLG1CQUFTTyxHQUFULENBQWMsR0FBRUosSUFBSyx1QkFBc0JrQixLQUFNLElBQUdILFVBQVUsV0FBVixFQUF1QkcsS0FBdkIsQ0FBOEIsRUFBbEY7QUFDQTtBQUNEOztBQUVELFdBQUssV0FBTDtBQUFrQjtBQUNoQixnQkFBTUEsUUFBUTVCLE9BQU8sQ0FBUCxFQUFVYSxNQUFWLENBQWlCZSxLQUEvQjtBQUNBckIsbUJBQVNPLEdBQVQsQ0FBYyxHQUFFSixJQUFLLHNCQUFxQmtCLEtBQU0sSUFBR0gsVUFBVSxXQUFWLEVBQXVCRyxLQUF2QixDQUE4QixFQUFqRjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDRXJCLGlCQUFTTyxHQUFULENBQWMsR0FBRUosSUFBSyxvQkFBckI7QUFyRUo7QUF1RUQ7O0FBRUQsU0FBTyxDQUFDLEdBQUdILFFBQUosQ0FBUDtBQUNEOzs7QUFFRCxNQUFNWSxVQUFVVyxRQUFTLElBQUdBLElBQUssR0FBakM7QUFDQSxNQUFNbkIsVUFBVUQsUUFBUUEsT0FBUSxJQUFHQSxLQUFLcUIsS0FBTCxDQUFXLENBQVgsQ0FBYyxHQUF6QixHQUE4QixjQUF0RDtBQUNBLE1BQU1OLFlBQVksQ0FBQ08sSUFBRCxFQUFPQyxLQUFQLEtBQWtCLEdBQUVELElBQUssR0FBRUMsUUFBUSxDQUFSLEdBQVksR0FBWixHQUFrQixFQUFHLEVBQWxFIiwiZmlsZSI6InNjaGVtYS12YWxpZGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IGFqdiBmcm9tIFwiYWp2XCJcblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlKHNjaGVtYTogT2JqZWN0LCBib2R5OiBtaXhlZCkge1xuICBjb25zdCB2YWxpZGF0b3IgPSBhanYoe1xuICAgIGFsbEVycm9yczogdHJ1ZSxcbiAgICB2NTogdHJ1ZSxcbiAgfSlcblxuICBpZiAodmFsaWRhdG9yLnZhbGlkYXRlKHNjaGVtYSwgYm9keSkpIHJldHVybiBbXVxuXG4gIGNvbnN0IGdyb3VwZWQgPSBuZXcgTWFwXG4gIGZvciAoY29uc3QgZXJyb3Igb2YgdmFsaWRhdG9yLmVycm9ycykge1xuICAgIGNvbnN0IGtleSA9IGVycm9yLnNjaGVtYVBhdGggKyBcIjpcIiArIGVycm9yLmRhdGFQYXRoXG4gICAgbGV0IHNldCA9IGdyb3VwZWQuZ2V0KGtleSlcbiAgICBpZiAoIXNldCkge1xuICAgICAgc2V0ID0gW11cbiAgICAgIGdyb3VwZWQuc2V0KGtleSwgc2V0KVxuICAgIH1cblxuICAgIHNldC5wdXNoKGVycm9yKVxuICB9XG5cbiAgY29uc3QgbWVzc2FnZXMgPSBuZXcgU2V0XG4gIGZvciAoY29uc3QgWyAsIGVycm9yc10gb2YgZ3JvdXBlZCkge1xuICAgIGNvbnN0IHtrZXl3b3JkLCBkYXRhUGF0aH0gPSBlcnJvcnNbMF1cblxuICAgIGNvbnN0IHBhdGggPSBmbXRQYXRoKGRhdGFQYXRoKVxuICAgIHN3aXRjaCAoa2V5d29yZCkge1xuICAgICAgY2FzZSBcInR5cGVcIjoge1xuICAgICAgICBjb25zdCB0eXBlID0gZXJyb3JzWzBdLnBhcmFtcy50eXBlXG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgJHt0eXBlfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJlbnVtXCI6IHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gZXJyb3JzWzBdLnBhcmFtcy5hbGxvd2VkVmFsdWVzLm1hcCh2YWwgPT4gZm10UHJvcCh2YWwpKS5qb2luKFwiLCBcIilcbiAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSAke2Vycm9yc1swXS5wYXJhbXMuYWxsb3dlZFZhbHVlcy5sZW5ndGggPiAxID8gXCJvbmUgb2YgXCIgOiBcIlwifSR7dmFsdWVzfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiB7XG4gICAgICAgIGNvbnN0IHVua25vd24gPSBlcnJvcnMubWFwKGVyciA9PiBmbXRQcm9wKGVyci5wYXJhbXMuYWRkaXRpb25hbFByb3BlcnR5KSkuam9pbihcIiwgXCIpXG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBoYXMgdW5rbm93biAke2ZtdFBsdXJhbChcImtleVwiLCBlcnJvcnMubGVuZ3RoKX0gJHt1bmtub3dufWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJyZXF1aXJlZFwiOiB7XG4gICAgICAgIGNvbnN0IG1pc3NpbmcgPSBlcnJvcnMubWFwKGVyciA9PiBmbXRQcm9wKGVyci5wYXJhbXMubWlzc2luZ1Byb3BlcnR5KSkuam9pbihcIiwgXCIpXG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSByZXF1aXJlcyAke2ZtdFBsdXJhbChcImtleVwiLCBlcnJvcnMubGVuZ3RoKX0gJHttaXNzaW5nfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJtaW5pbXVtXCI6IHtcbiAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgYXQgbGVhc3QgJHtsaW1pdH1gKVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwiZXhjbHVzaXZlTWluaW11bVwiOiB7XG4gICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIG1vcmUgdGhhbiAke2xpbWl0fWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJtYXhpbXVtXCI6IHtcbiAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgYXQgbW9zdCAke2xpbWl0fWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJleGNsdXNpdmVNYXhpbXVtXCI6IHtcbiAgICAgICAgY29uc3QgbGltaXQgPSBlcnJvcnNbMF0ucGFyYW1zLmxpbWl0XG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgbGVzcyB0aGFuICR7bGltaXR9YClcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY2FzZSBcImZvcm1hdFwiOiB7XG4gICAgICAgIGxldCBmb3JtYXQgPSBlcnJvcnNbMF0ucGFyYW1zLmZvcm1hdFxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImVtYWlsXCIpIGZvcm1hdCA9IFwiZW1haWwgYWRkcmVzc1wiXG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBzaG91bGQgYmUgZm9ybWF0dGVkIGFzICR7Zm9ybWF0fWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgXCJtaW5MZW5ndGhcIjoge1xuICAgICAgICBjb25zdCBsaW1pdCA9IGVycm9yc1swXS5wYXJhbXMubGltaXRcbiAgICAgICAgbWVzc2FnZXMuYWRkKGAke3BhdGh9IHNob3VsZCBiZSBhdCBsZWFzdCAke2xpbWl0fSAke2ZtdFBsdXJhbChcImNoYXJhY3RlclwiLCBsaW1pdCl9YClcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY2FzZSBcIm1heExlbmd0aFwiOiB7XG4gICAgICAgIGNvbnN0IGxpbWl0ID0gZXJyb3JzWzBdLnBhcmFtcy5saW1pdFxuICAgICAgICBtZXNzYWdlcy5hZGQoYCR7cGF0aH0gc2hvdWxkIGJlIGF0IG1vc3QgJHtsaW1pdH0gJHtmbXRQbHVyYWwoXCJjaGFyYWN0ZXJcIiwgbGltaXQpfWApXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG1lc3NhZ2VzLmFkZChgJHtwYXRofSBmYWlsZWQgY29uc3RyYWludGApXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFsuLi5tZXNzYWdlc11cbn1cblxuY29uc3QgZm10UHJvcCA9IHByb3AgPT4gYCcke3Byb3B9J2BcbmNvbnN0IGZtdFBhdGggPSBwYXRoID0+IHBhdGggPyBgJyR7cGF0aC5zbGljZSgxKX0nYCA6IFwicmVxdWVzdCBib2R5XCJcbmNvbnN0IGZtdFBsdXJhbCA9ICh3b3JkLCBjb3VudCkgPT4gYCR7d29yZH0ke2NvdW50ID4gMSA/IFwic1wiIDogXCJcIn1gXG4iXX0=