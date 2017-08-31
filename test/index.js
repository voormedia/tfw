import path from "app-module-path"
import chai from "chai"
import http from "http"
import net from "net"

import stream from "stream"
import timekeeper from "timekeeper"

import Application from "../src/application"
import Logger from "../src/util/logger"
import MemoryConsole from "../src/util/memory-console"

/* Force test env. */
process.env.NODE_ENV = "test"

/* Add root to load path. */
path.addPath(__dirname + "/..")

let port = 12345

const test = {
  get nextPort() {
    return ++port
  },

  get thisPort() {
    return port
  },

  createStack(...middlewares) {
    const logger = new Logger(new MemoryConsole)
    const app = new Application({port: test.nextPort, logger})
    app.stack.splice(0, app.stack.length, ...middlewares)
    return app
  },

  request(app, options = {}) {
    timekeeper.freeze(new Date(1330688329321))

    options = Object.assign({port: app.port, method: "GET"}, options)
    if (options.method == "GET" && options.body) throw new Error("get required")
    return new Promise((resolve, reject) => {
      if (app.start) app.start()
      if (app.server && options.fakeEncrypted) {
        app.server.on("connection", conn => conn.encrypted = true)
      }

      const handle = res => {
        const body = []
        if (app.stop) app.stop()
        res.on("data", ::body.push)
        res.on("end", () => resolve({res, body: Buffer.concat(body)}))
      }

      http.request(options, handle).on("error", reject).end(options.body)
    })
  },

  createConnection(port, options = {}) {
    return new Promise((resolve, reject) => {
      const conn = new net.Socket()
      conn.connect(port, () => {
        setTimeout(() => resolve(conn), 0)
      })
    })
  },
}

/* Expose assert() and other helpers. */
global.assert = chai.assert
global.test = test
