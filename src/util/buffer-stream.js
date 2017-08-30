/* @flow */
import {Writable} from "stream"

export class BufferStream extends Writable {
  buffers: Array<Buffer> = []

  _write(chunk: Buffer | string, encoding: string, callback: Function) {
    if (typeof chunk === "string") chunk = Buffer.from(chunk)
    this.buffers.push(chunk)
    callback(null)
    return true
  }

  clear() {
    this.buffers.length = 0
  }

  inspect() {
    return Buffer.concat(this.buffers).toString()
  }

  toString() {
    return Buffer.concat(this.buffers).toString()
  }
}

export default BufferStream
