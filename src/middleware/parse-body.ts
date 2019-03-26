import * as contentType from "content-type"
import * as querystring from "querystring"

import {BadRequest, UnsupportedMediaType} from "../errors"

import {Request} from "../app/context"
import {Context, Middleware, Next} from "../middleware"

export default function parseBody(): Middleware {
  return async function parseBody(this: Context, next: Next) {
    const buffers: Buffer[] = []

    this.request.on("data", (chunk: Buffer) => {
      buffers.push(chunk)
    })

    await new Promise<void>(resolve => {
      this.request.on("end", resolve)
    })

    const body = Buffer.concat(buffers)

    if (body.length) {
      let parsed
      try {
        /* Guess the type of the content based on magic headers.
           This is a workaround for clients that accidentally set application/json
           Content-Type header when uploading images. */
        parsed = contentType.parse(guessType(this.request, body))
      } catch (err) {
        throw new BadRequest("Invalid Content-Type header")
      }

      const {type, parameters: {charset = "utf-8"}} = parsed

      if (charset.toLowerCase() !== "utf-8") {
        throw new UnsupportedMediaType(`Character set '${charset.toLowerCase()}' is not supported`)
      }

      switch (type) {
        case "application/x-www-form-urlencoded":
          try {
            /* Validate query string? */
            this.data.body = querystring.parse(body.toString(), undefined, undefined, {maxKeys: 0})
          } catch (err) {
            /* TODO: Throw error to client? */
            this.data.body = Object.create(null)
          }
          break

        case "application/json":
          try {
            this.data.body = JSON.parse(body.toString())
          } catch (err) {
            throw new BadRequest(err.message)
          }
          break

        default:
          this.data.body = body
      }
    }

    await next()
  }
}

function guessType(req: Request, body: Buffer) {
  /* Detect GIF and PDF to provide better error messages. */
  const magic: {[key: string]: Buffer} = {
    "application/pdf":  Buffer.from([0x25, 0x50, 0x44, 0x46]),
    "image/gif":        Buffer.from([0x47, 0x49, 0x46]),
    "image/jpeg":       Buffer.from([0xFF, 0xD8, 0xFF]),
    "image/png":        Buffer.from([0x89, 0x50, 0x4E, 0x47]),
    /* TODO: Assume '{"' means we have JSON? */
    // "application/json": Buffer.from([0x7b, 0x22]),
  }

  if (body instanceof Buffer) {
    /* Check for magic headers of various binary files. */
    for (const [type, header] of Object.entries(magic)) {
      if (body.slice(0, header.length).equals(header)) return type
    }
  }

  return req.headers["content-type"] || "application/octet-stream"
}
