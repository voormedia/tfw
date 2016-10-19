/* @flow */
import querystring from "querystring"
import contentType from "content-type"

import {BadRequest, UnsupportedMediaType} from "../errors"

import type {Context, Next, Middleware} from "../middleware"

export default function parseBody(): Middleware {
  return async function parseBody(next: Next) {
    const ctx: Context = this

    const buffers = []

    ctx.req.on("data", chunk => {
      buffers.push(chunk)
    })

    await new Promise(resolve => {
      ctx.req.on("end", resolve)
    })

    const body = Buffer.concat(buffers)

    if (body.length) {
      let parsed
      try {
        /* Guess the type of the content based on magic headers.
           This is a workaround for clients that accidentally set application/json
           Content-Type header when uploading images. */
        parsed = contentType.parse(guessType(ctx.req, body))
      } catch (err) {
        throw new BadRequest("Bad Content-Type header")
      }

      const {type, parameters: {charset = "utf-8"}} = parsed

      if (charset.toLowerCase() !== "utf-8") {
        throw new UnsupportedMediaType(`Charset ${charset.toLowerCase()} is not supported`)
      }

      switch (type) {
        case "application/x-www-form-urlencoded":
          try {
            /* Validate query string? */
            ctx.data.body = querystring.parse(body.toString(), null, null, {maxKeys: 0})
          } catch (err) {
            /* TODO: Throw error to client? */
            ctx.data.body = {}
          }
          break

        case "application/json":
          try {
            ctx.data.body = JSON.parse(body.toString())
          } catch (err) {
            throw new BadRequest(err.message)
          }
          break

        default:
          ctx.data.body = body
      }
    }

    return await next()
  }
}

function guessType(req, body) {
  /* Detect GIF and PDF to provide better error messages. */
  const magic = {
    "image/png":        Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    "image/jpeg":       Buffer.from([0xff, 0xd8, 0xff]),
    "image/gif":        Buffer.from([0x47, 0x49, 0x46]),
    "application/pdf":  Buffer.from([0x25, 0x50, 0x44, 0x46]),
    /* TODO: Assume '{"' means we have JSON? */
    // "application/json": Buffer.from([0x7b, 0x22]),
  }

  if (body instanceof Buffer) {
    /* Check for magic headers of various binary files. */
    for (const type in magic) {
      let header = magic[type]
      if (body.slice(0, header.length).equals(header)) return type
    }
  }

  return req.headers["content-type"] || "application/octet-stream"
}
