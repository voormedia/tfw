import {Context, Middleware, Next} from "../middleware"

export default function bufferBody(): Middleware {
  return async function bufferBody(this: Context, next: Next) {
    const buffers: Buffer[] = []

    this.request.on("data", (chunk: Buffer) => {
      buffers.push(chunk)
    })

    await new Promise<void>(resolve => {
      this.request.on("end", resolve)
    })

    if (buffers.length) {
      this.data.body = Buffer.concat(buffers)
    }

    await next()
  }
}
