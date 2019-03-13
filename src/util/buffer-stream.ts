import {Writable} from "stream"

export class BufferStream extends Writable {
  private buffers: Buffer[] = []

  public _write(chunk: Buffer | string, encoding: string, callback: (err?: Error) => void) {
    if (typeof chunk === "string") chunk = Buffer.from(chunk)
    this.buffers.push(chunk)
    callback()
    return true
  }

  public clear() {
    this.buffers.length = 0
  }

  public inspect() {
    return Buffer.concat(this.buffers).toString()
  }

  public toString() {
    return Buffer.concat(this.buffers).toString()
  }
}

export default BufferStream
