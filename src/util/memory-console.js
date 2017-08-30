/* @flow */
/* eslint-disable no-console */
import BufferStream from "./buffer-stream"

export class MemoryConsole extends console.Console {
  stdout: BufferStream
  stderr: BufferStream

  constructor() {
    const stdout = new BufferStream
    const stderr = new BufferStream
    super(stdout, stderr)

    this.stdout = stdout
    this.stderr = stderr
    Object.freeze(this)
  }

  clear() {
    this.stdout.clear()
    this.stderr.clear()
  }
}

export default MemoryConsole
