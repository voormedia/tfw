/* @flow */
/* eslint-disable no-console */
import ajv from "ajv"

import keywordSwitch from "ajv-keywords/keywords/switch"
import keywordSelect from "ajv-keywords/keywords/select"

export type Validator = (body: mixed) => string[]

const instance = ajv({
  allErrors: true,
  $data: true,
})

/* Currently ajv-keywords still uses draft-06. */
const jsonSchemaId = "draft-06"
instance.addMetaSchema(require(`ajv/lib/refs/json-schema-${jsonSchemaId}.json`))

keywordSwitch(instance)
keywordSelect(instance)

export function createValidator(schema: Object): Validator {
  schema.$schema = `http://json-schema.org/${jsonSchemaId}/schema`
  const validate = instance.compile(schema)

  return (body: mixed) => {
    if (validate(body)) return []

    const grouped = new Map
    for (const error of validate.errors) {
      const key = error.schemaPath + ":" + error.dataPath
      let set = grouped.get(key)
      if (!set) {
        set = []
        grouped.set(key, set)
      }

      set.push(error)
    }

    const messages = new Set
    for (const [ , errors] of grouped) {
      const {keyword, dataPath} = errors[0]

      const path = fmtPath(dataPath)
      switch (keyword) {
        case "type": {
          const type = errors[0].params.type
          messages.add(`${path} should be ${type}`)
          break
        }

        case "enum": {
          const values = errors[0].params.allowedValues.map(val => fmtProp(val)).join(", ")
          messages.add(`${path} should be ${errors[0].params.allowedValues.length > 1 ? "one of " : ""}${values}`)
          break
        }

        case "additionalProperties": {
          const unknown = errors.map(err => fmtProp(err.params.additionalProperty)).join(", ")
          messages.add(`${path} has unknown ${fmtPlural("key", errors.length)} ${unknown}`)
          break
        }

        case "required": {
          const missing = errors.map(err => fmtProp(err.params.missingProperty)).join(", ")
          messages.add(`${path} requires ${fmtPlural("key", errors.length)} ${missing}`)
          break
        }

        case "minimum": {
          const limit = errors[0].params.limit
          messages.add(`${path} should be at least ${limit}`)
          break
        }

        case "exclusiveMinimum": {
          const limit = errors[0].params.limit
          messages.add(`${path} should be more than ${limit}`)
          break
        }

        case "maximum": {
          const limit = errors[0].params.limit
          messages.add(`${path} should be at most ${limit}`)
          break
        }

        case "exclusiveMaximum": {
          const limit = errors[0].params.limit
          messages.add(`${path} should be less than ${limit}`)
          break
        }

        case "format": {
          let format = errors[0].params.format
          if (format === "email") format = "email address"
          messages.add(`${path} should be formatted as ${format}`)
          break
        }

        case "minLength": {
          const limit = errors[0].params.limit
          messages.add(`${path} should be at least ${limit} ${fmtPlural("character", limit)}`)
          break
        }

        case "maxLength": {
          const limit = errors[0].params.limit
          messages.add(`${path} should be at most ${limit} ${fmtPlural("character", limit)}`)
          break
        }

        default:
          messages.add(`${path} failed constraint`)
      }
    }

    return [...messages]
  }
}

const fmtProp = prop => `'${prop}'`
const fmtPath = path => path ? `'${path.slice(1)}'` : "request body"
const fmtPlural = (word, count) => `${word}${count > 1 ? "s" : ""}`
