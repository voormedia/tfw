import {IncomingMessage, Server, ServerResponse} from "http"
import {Socket} from "net"

export class ClosableServer extends Server {
  closing = false
  private readonly sockets = new Map<Socket, number>()

  constructor() {
    super()

    this.on("connection", (socket: Socket) => {
      this.sockets.set(socket, 0)

      socket.on("close", () => {
        this.sockets.delete(socket)
      })
    })

    this.on("request", (request: IncomingMessage, response: ServerResponse) => {
      const socket = request.socket
      this.sockets.set(socket, +this.sockets.get(socket)! + 1)

      if (this.closing) {
        response.setHeader("Connection", "close")
      }

      response.on("finish", () => {
        const pending = +this.sockets.get(socket)! - 1
        this.sockets.set(socket, pending)

        if (this.closing && pending === 0) {
          socket.end()
        }
      })
    })
  }

  close(callback?: (err?: Error) => void): this {
    super.close(callback)

    this.closing = true

    process.nextTick(() => {
      for (const [socket, pending] of this.sockets) {
        if (pending === 0) {
          socket.end()
        }
      }
    })

    return this
  }
}

export default ClosableServer
