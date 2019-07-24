"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contentType = require("content-type");
const querystring = require("querystring");
const errors_1 = require("../errors");
function parseBody({ maxLength = 10000 } = {}) {
    const kb = Math.round(maxLength / 1000);
    class BodyTooLarge extends errors_1.RequestEntityTooLarge {
        constructor(type) {
            super(`Request body of type '${type}' cannot be longer than ${kb} KB`);
        }
    }
    return async function parseBody(next) {
        const buffers = [];
        this.request.on("data", (chunk) => {
            buffers.push(chunk);
        });
        await new Promise(resolve => {
            this.request.on("end", resolve);
        });
        const body = Buffer.concat(buffers);
        if (body.length) {
            let parsed;
            try {
                /* Guess the type of the content based on magic headers.
                   This is a workaround for clients that accidentally set application/json
                   Content-Type header when uploading images. */
                parsed = contentType.parse(guessType(this.request, body));
            }
            catch (err) {
                throw new errors_1.BadRequest("Invalid Content-Type header");
            }
            const { type, parameters: { charset = "utf-8" } } = parsed;
            if (charset.toLowerCase() !== "utf-8") {
                throw new errors_1.UnsupportedMediaType(`Character set '${charset.toLowerCase()}' is not supported`);
            }
            switch (type) {
                case "application/x-www-form-urlencoded":
                    if (body.length > maxLength) {
                        throw new BodyTooLarge(type);
                    }
                    try {
                        /* Validate query string? */
                        this.data.body = querystring.parse(body.toString(), undefined, undefined, { maxKeys: 0 });
                    }
                    catch (err) {
                        /* TODO: Throw error to client? */
                        this.data.body = Object.create(null);
                    }
                    break;
                case "application/json":
                    if (body.length > maxLength) {
                        throw new BodyTooLarge(type);
                    }
                    try {
                        this.data.body = JSON.parse(body.toString());
                    }
                    catch (err) {
                        throw new errors_1.BadRequest(err.message);
                    }
                    break;
                default:
                    this.data.body = body;
            }
        }
        await next();
    };
}
exports.default = parseBody;
function guessType(req, body) {
    /* Detect GIF and PDF to provide better error messages. */
    const magic = {
        "application/pdf": Buffer.from([0x25, 0x50, 0x44, 0x46]),
        "image/gif": Buffer.from([0x47, 0x49, 0x46]),
        "image/jpeg": Buffer.from([0xFF, 0xD8, 0xFF]),
        "image/png": Buffer.from([0x89, 0x50, 0x4E, 0x47]),
        "image/vnd.adobe.photoshop": Buffer.from([0x38, 0x42, 0x50, 0x53]),
        "image/tiff": Buffer.from([0x49, 0x49, 0x2A, 0x00]),
    };
    if (body instanceof Buffer) {
        /* Check for magic headers of various binary files. */
        for (const [type, header] of Object.entries(magic)) {
            if (body.slice(0, header.length).equals(header))
                return type;
        }
    }
    return req.headers["content-type"] || "application/octet-stream";
}
//# sourceMappingURL=parse-body.js.map