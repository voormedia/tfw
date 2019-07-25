import * as contentType from "content-type"
import * as querystring from "querystring"

import {
  BadRequest,
  RequestEntityTooLarge,
  UnsupportedMediaType,
} from "../errors"

import {Request} from "../app/context"
import {Context, Middleware, Next} from "../middleware"

export interface BodyOptions {
  maxLength?: number,
}

export default function parseBody({maxLength = 100000}: BodyOptions = {}): Middleware {
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
          validateLength(body, type, maxLength)
          validateAsciiText(body, type)

          try {
            /* Validate query string? */
            this.data.body = querystring.parse(body.toString(), undefined, undefined, {maxKeys: 0})
          } catch (err) {
            /* TODO: Throw error to client? */
            this.data.body = Object.create(null)
          }
          break

        case "application/json":
          validateLength(body, type, maxLength)

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
  /* Detect multiple formats to provide better error messages. */
  const magic: {[key: string]: Buffer} = {
    "application/pdf":  Buffer.from([0x25, 0x50, 0x44, 0x46]),
    "image/gif":        Buffer.from([0x47, 0x49, 0x46]),
    "image/jpeg":       Buffer.from([0xFF, 0xD8, 0xFF]),
    "image/png":        Buffer.from([0x89, 0x50, 0x4E, 0x47]),
    "image/vnd.adobe.photoshop": Buffer.from([0x38, 0x42, 0x50, 0x53]),
    "image/tiff":       Buffer.from([0x49, 0x49, 0x2A, 0x00]),
    // "image/tiff":       Buffer.from([0x4D, 0x4D, 0x00, 0x2A]), // big endian
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

function validateLength(buf: Buffer, type: string, maxLength: number) {
  if (buf.length > maxLength) {
    throw new BodyTooLarge(type, maxLength)
  }
}

function validateAsciiText(buf: Buffer, type: string) {
  /* tslint:disable-next-line: prefer-for-of -- for-of is much slower! */
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i]
    if (byte < 0x20 || byte > 0x7E) {
      throw new InvalidCharacters(type, byte)
    }
  }
}

class BodyTooLarge extends RequestEntityTooLarge {
  constructor(type: string, maxLength: number) {
    const kb = Math.round(maxLength / 1000)
    super(`Request body of type '${type}' cannot be longer than ${kb} KB`)
  }
}

class InvalidCharacters extends BadRequest {
  constructor(type: string, char: number) {
    super(`Request body of type '${type}' contains invalid byte 0x${char.toString(16)}`)
  }
}
