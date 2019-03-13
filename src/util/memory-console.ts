import {Console} from "console"
import BufferStream from "./buffer-stream"

export class MemoryConsole extends Console {
  public stdout: BufferStream
  public stderr: BufferStream

  constructor() {
    const stdout = new BufferStream
    const stderr = new BufferStream
    super(stdout, stderr)

    this.stdout = stdout
    this.stderr = stderr
    Object.freeze(this)
  }

  public clear() {
    this.stdout.clear()
    this.stderr.clear()
  }
}

export default MemoryConsole
