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

/* Force default metadata schema to be computed to avoid warnings when
   adding the select and switch keywords. */
instance.validateSchema({})

export function createValidator(schema: object): Validator {
  const validate = instance.compile(schema)

  return body => {
    if (validate(body)) return []

    const results: ValidationResult[] = []
    for (const error of validate.errors!) {
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
          results.push({path, error: "invalid_value", expected})
          break
        }

        case "additionalProperties": {
          const unknown = (error.params as ajv.AdditionalPropertiesParams).additionalProperty
          results.push({path: path ? `${path}.${unknown}` : unknown, error: "unknown"})
          break
        }

        case "required": {
          const required = (error.params as ajv.RequiredParams).missingProperty
          results.push({path: path ? `${path}.${required}` : required, error: "required"})
          break
        }

        case "minimum":
        case "exclusiveMinimum":
        case "maximum":
        case "exclusiveMaximum": {
          const {limit, comparison: operator} = (error.params as ajv.ComparisonParams)
          results.push({path, error: "invalid_range", limit, operator})
          break
        }

        case "minLength": {
          const limit = (error.params as ajv.LimitParams).limit
          results.push({path, error: "invalid_length", limit, operator: ">="})
          break
        }

        case "maxLength": {
          const limit = (error.params as ajv.LimitParams).limit
          results.push({path, error: "invalid_length", limit, operator: "<="})
          break
        }

        /* Ignore spurious errors regarding failing if/then/else. */
        case "if": break

        default: {
          results.push({path, error: "other"})
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

      case "unknown":
      case "required": {
        const [key, ...parts] = (result.path || "").split(".").reverse()
        const parent = parts.length ? `'${parts.reverse().join(".")}'` : "request body"
        const map = result.error === "unknown" ? unknowns : requireds
        if (map.has(parent)) {
          map.get(parent)!.push(`'${key}'`)
        } else {
          map.set(parent, [`'${key}'`])
        }
        break
      }

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
    case "unknown":
      return `requires ${fmtPlural("key", length)}`

    case "required":
      return `has unknown ${fmtPlural("key", length)}`

    case "invalid_type":
      return `should be ${result.expected}`

    case "invalid_value":
      if (result.expected) {
        return `should be ${result.expected.length > 1 ? "one of " : ""}${result.expected.map(fmtProp).join(", ")}`
      } else {
        return "is not valid"
      }

    case "invalid_format":
      let format = result.expected
      switch (format) {
        case "email": format = "email address"; break
        case "rfc2822-datetime": format = "rfc 2822 date-time"; break
        default:
      }

      return `should be formatted as ${format}`

    case "invalid_range":
      return `should be ${fmtOperator(result.operator)} ${result.limit}`

    case "invalid_length":
      return `should be ${fmtOperator(result.operator)} ${result.limit} ${fmtPlural("character", result.limit)}`

    case "blocked_value":
      return "has a value that is not allowed"

    default:
      return "failed constraint"
  }
}

export interface Success {
  error: undefined
}

interface Error {
  path?: string
  error: string
  message?: string
}

export interface UnknownField extends Error {
  error: "unknown"
}

export interface RequiredField extends Error {
  error: "required"
}

export interface InvalidType extends Error {
  error: "invalid_type"
  expected: string
}

export interface InvalidValue extends Error {
  error: "invalid_value"
  expected?: string[]
  suggestion?: string
}

export interface InvalidFormat extends Error {
  error: "invalid_format"
  expected: string
}

export interface InvalidRange extends Error {
  error: "invalid_range"
  limit: string | number
  operator: string
}

export interface InvalidLength extends Error {
  error: "invalid_length"
  limit: number
  operator: string
}

export interface BlockedValue extends Error {
  error: "blocked_value"
}

export interface OtherFailure extends Error {
  error: "other"
}

export type ValidationResult = (
  Success |
  UnknownField |
  RequiredField |
  InvalidType |
  InvalidValue |
  InvalidFormat |
  InvalidRange |
  InvalidLength |
  BlockedValue |
  OtherFailure
)
