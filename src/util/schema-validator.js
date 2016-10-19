/* @flow */
import ajv from "ajv"
import url from "url"

export function validate(schema: Object, body: mixed) {
  const validator = ajv({
    allErrors: true,
    v5: true,
  })

  validator.addFormat("url", data => {
    const parts = url.parse(data)
    if (!(parts.protocol && parts.protocol.startsWith("http"))) return false
    return true
  })

  if (validator.validate(schema, body)) return []

  const grouped = new Map
  for (const error of validator.errors) {
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
        const comparison = errors[0].params.exclusive ? "more than" : "at least"
        const limit = errors[0].params.limit
        messages.add(`${path} should be ${comparison} ${limit}`)
        break
      }

      case "maximum": {
        const comparison = errors[0].params.exclusive ? "less than" : "at most"
        const limit = errors[0].params.limit
        messages.add(`${path} should be ${comparison} ${limit}`)
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

const fmtProp = prop => `'${prop}'`
const fmtPath = path => path ? `'${path.slice(1)}'` : "request body"
const fmtPlural = (word, count) => `${word}${count > 1 ? "s" : ""}`
