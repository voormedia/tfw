import * as ajv from "ajv"

export type SimpleValidator = (body: object) => string[]
export type Validator = (body: object) => ValidationResult[]

const instance = ajv({
  allErrors: true,
})

instance.addFormat(
  "rfc2822-datetime",
  /* Based on http://regexlib.com/REDetails.aspx?regexp_id=969 */
  /^((Sun|Mon|Tue|Wed|Thu|Fri|Sat),?\s+)?(0?[1-9]|[1-2][0-9]|3[01])\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(19[0-9]{2}|[2-9][0-9]{3}|[0-9]{2})\s+(2[0-3]|[0-1][0-9]):([0-5][0-9])(:(60|[0-5][0-9]))?\s+([-+][0-9]{2}[0-5][0-9]|(UT|GMT|(E|C|M|P)(ST|DT)|[A-IK-Z]))$/,
)

instance.addFormat(
  "url",
  /* Improvement to prevent URL validation DoS */
  new RegExp(
    "^" +
      // Protocol identifier
      "(?:(?:(?:https?|ftp):)\\/\\/)" +
      // User:pass BasicAuth (optional)
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
        // IP address exclusion
        // Private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // Excludes loopback network 0.0.0.0
        // Excludes reserved space >= 224.0.0.0
        // Excludes network & broadcast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
        // Host & domain names, may end with dot
        // Can be replaced by a shortest alternative
        // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
        "(?:" +
          "(?:" +
            "[a-z0-9\\u00a1-\\uffff]" +
            "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
          ")?" +
          "[a-z0-9\\u00a1-\\uffff]\\." +
        ")+" +
        // TLD identifier name, may end with dot
        "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
      ")" +
      // Port number (optional)
      "(?::\\d{2,5})?" +
      // Resource path (optional)
      "(?:[/?#]\\S*)?" +
    "$",
    "i",
  ),
)

/* Force default metadata schema to be computed to avoid warnings when
   adding the select and switch keywords. */
instance.validateSchema({})

export function createValidator(schema: object, {maxErrors = 50}: {maxErrors?: number} = {}): Validator {
  const validate = instance.compile(schema)

  return body => {
    if (validate(body) || !validate.errors) return []

    const results: ValidationResult[] = []
    for (const [i, error] of validate.errors.entries()) {
      if (i > maxErrors) {
        results.push({error: "too_many_errors"})
        break
      }

      const path = fmtPath(error.dataPath)
      switch (error.keyword) {
        case "type": {
          const expected = (error.params as ajv.TypeParams).type.split(",")[0]
          results.push({path, error: "invalid_type", expected})
          break
        }

        case "format": {
          const expected = (error.params as ajv.FormatParams).format
          results.push({path, error: "invalid_format", expected})
          break
        }

        case "enum": {
          const expected = (error.params as ajv.EnumParams).allowedValues
          results.push({path, error: "invalid_option", expected})
          break
        }

        case "additionalProperties": {
          const unknown = (error.params as ajv.AdditionalPropertiesParams).additionalProperty
          results.push({path: path ? `${path}.${unknown}` : unknown, error: "unknown_field"})
          break
        }

        case "required": {
          const required = (error.params as ajv.RequiredParams).missingProperty
          results.push({path: path ? `${path}.${required}` : required, error: "required_field"})
          break
        }

        case "minimum":
        case "exclusiveMinimum":
        case "maximum":
        case "exclusiveMaximum": {
          const {limit, comparison} = (error.params as ajv.ComparisonParams)
          const expected: RangeExpecation<string | number> = {operator: comparison as Operator, limit}
          results.push({path, error: "invalid_range", expected})
          break
        }

        case "minLength": {
          const limit = (error.params as ajv.LimitParams).limit
          results.push({path, error: "invalid_length", expected: {operator: ">=", limit}})
          break
        }

        case "maxLength": {
          const limit = (error.params as ajv.LimitParams).limit
          results.push({path, error: "invalid_length", expected: {operator: "<=", limit}})
          break
        }

        /* Ignore spurious errors regarding failing if/then/else. */
        case "if": break

        default: {
          results.push({path, error: "other_failure"})
        }
      }
    }

    return results
  }
}

export function createSimpleValidator(schema: object): SimpleValidator {
  const validate = createValidator(schema)
  return body => simplifyResults(validate(body))
}

const fmtProp = (prop: string) =>
  `'${prop}'`

const fmtPath = (path: string) =>
  path ? path.slice(1) : undefined

const fmtPlural = (word: string, count: number) =>
  `${word}${count > 1 ? "s" : ""}`

const fmtOperator = (input: string) => {
  switch (input) {
    case ">=": return "at least"
    case "<=": return "at most"
    case ">": return "more than"
    case "<": return "less than"
    default: return ""
  }
}

export function simplifyResults(results: ValidationResult[]): string[] {
  const simplified: string[] = []
  const requireds = new Map<string, string[]>()
  const unknowns = new Map<string, string[]>()

  for (const result of results) {
    switch (result.error) {
      case undefined:
        break

      case "unknown_field":
      case "required_field": {
        const [key, ...parts] = (result.path || "").split(".").reverse()
        const parent = parts.length ? `'${parts.reverse().join(".")}'` : "request body"
        const map = result.error === "unknown_field" ? unknowns : requireds

        if (map.has(parent)) {
          map.get(parent)!.push(`'${key}'`)
        } else {
          map.set(parent, [`'${key}'`])
        }

        break
      }

      case "too_many_errors":
        simplified.unshift("too many errors, some have been omitted")
        break

      default:
        const path = result.path ? `'${result.path}'` : "request body"
        simplified.push(`${path} ${messageForError(result)}`)
    }
  }

  for (const [path, keys] of requireds) {
    simplified.push(`${path} requires key${keys.length > 1 ? "s" : ""} ${keys.join(", ")}`)
  }

  for (const [path, keys] of unknowns) {
    simplified.push(`${path} has unknown key${keys.length > 1 ? "s" : ""} ${keys.join(", ")}`)
  }

  return simplified
}

function messageForError(result: ValidationResult, length: number = 1): string {
  switch (result.error) {
    case "unknown_field":
      return `requires ${fmtPlural("key", length)}`

    case "required_field":
      return `has unknown ${fmtPlural("key", length)}`

    case "invalid_type": {
      const a = ["a", "e", "i", "o", "u"].includes(result.expected[0]) ? "an" : "a"
      return `should be ${a} ${result.expected}`
    }

    case "invalid_format": {
      let format = result.expected
      switch (format) {
        case "email": format = "email address"; break
        case "rfc2822-datetime": format = "rfc 2822 date-time"; break
        default:
      }

      return `should be formatted as ${format}`
    }

    case "invalid_range": {
      const {operator, limit} = result.expected
      return `should be ${fmtOperator(operator)} ${limit}`
    }

    case "invalid_length": {
      const {operator, limit} = result.expected
      return `should be ${fmtOperator(operator)} ${limit} ${fmtPlural("character", limit)}`
    }

    case "duplicate_value":
      return "has a value that is already in use"

    case "blocked_value":
      return "has a value that is not allowed"

    case "invalid_option": {
      const expected = result.expected
      return `should be ${expected.length > 1 ? "one of " : ""}${expected.map(fmtProp).join(", ")}`
    }

    default:
    case "other_failure":
      return "is invalid"
  }
}

interface Error {
  path?: string
  error: string
  message?: string
}

export interface TooManyErrors extends Error {
  error: "too_many_errors"
}

export interface UnknownField extends Error {
  error: "unknown_field"
}

export interface RequiredField extends Error {
  error: "required_field"
}

export interface InvalidType extends Error {
  error: "invalid_type"
  expected: string
  suggestion?: string
}

export interface InvalidFormat extends Error {
  error: "invalid_format"
  expected: string
  suggestion?: string
}

export interface InvalidRange extends Error {
  error: "invalid_range"
  expected: RangeExpecation<string | number>
  suggestion?: string
}

export interface InvalidLength extends Error {
  error: "invalid_length"
  expected: RangeExpecation<number>
  suggestion?: string
}

export interface InvalidOption extends Error {
  error: "invalid_option"
  expected: string[]
  suggestion?: string
}

export interface InvalidValue extends Error {
  error: "invalid_value"
  suggestion?: string
}

export interface DuplicateValue extends Error {
  error: "duplicate_value"
  suggestion?: string
}

export interface BlockedValue extends Error {
  error: "blocked_value"
  suggestion?: string
}

export interface OtherFailure extends Error {
  error: "other_failure"
  suggestion?: string
}

type Operator = "==" | "<=" | ">=" | "<" | ">"

interface RangeExpecation<T> {
  operator: Operator
  limit: T
}

export type ValidationResult = (
  TooManyErrors |
  UnknownField |
  RequiredField |
  InvalidType |
  InvalidFormat |
  InvalidRange |
  InvalidLength |
  InvalidOption |
  InvalidValue |
  DuplicateValue |
  BlockedValue |
  OtherFailure
)
