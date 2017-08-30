import mocha from "mocha"

import Application from "src/application"
import Logger from "src/util/logger"
import {TooManyRequests} from "src/errors"

import sleep from "src/util/sleep"

let exitCode = 0
const exitHandler = process.exit
const nullHandler = (code) => {exitCode = code}

describe("application", function() {
  before(function() {
    this.uncaughtExceptionListeners = process.listeners("uncaughtException")
    process.exit = nullHandler
  })

  after(function() {
    process.exit = exitHandler
    process.removeAllListeners("uncaughtException")
    for (const listener of this.uncaughtExceptionListeners) {
      process.on("uncaughtException", listener)
    }
  })

  describe("start", function() {
    before(async function() {
      this.app = new Application({
        port: test.nextPort,
      })

      this.app.stack.length = 0
      this.app.stack.push(
        function(next) {
          setTimeout(() => {
            this.response.writeHead(200, {})
            this.response.end("OK")
          }, 5)
        }
      )

      this.app.start()
    })

    after(function() {
      this.app.stop()
    })

    describe("on connect", function() {
      before(async function() {
        this.client = await test.createConnection(test.thisPort)
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      after(function() {
        this.client.end()
      })

      it("should mark connection as idle", function() {
        assert.equal(this.app.sockets.values().next().value, 0)
      })
    })

    describe("on request", function() {
      before(async function() {
        this.client = await test.createConnection(test.thisPort)
        this.client.write("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n")

        await new Promise(resolve => {
          this.app.server.on("request", resolve)
        })
      })

      after(function() {
        this.client.end()
      })

      it("should mark connection as active", function() {
        assert.equal(this.app.sockets.values().next().value, 1)
      })
    })

    describe("on finish", function() {
      before(async function() {
        this.client = await test.createConnection(test.thisPort)
        this.client.write("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n")

        await new Promise(resolve => {
          this.app.server.on("request", (_, response) => {
            response.on("finish", resolve)
          })
        })
      })

      after(function() {
        this.client.end()
      })

      it("should mark connection as idle", function() {
        assert.equal(this.app.sockets.values().next().value, 0)
      })
    })

    describe("on stop", function() {
      before(async function() {
        this.client = await test.createConnection(test.thisPort)
        this.client.write("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n")

        await sleep(0)
        this.app.stop()
        this.client.write("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n")

        const chunks = []
        this.client.on("data", data => chunks.push(data))

        await new Promise(resolve => {
          this.client.on("end", resolve)
        })

        this.socket = this.app.sockets.values().next().value
        this.body = Buffer.concat(chunks).toString()
      })

      after(function() {
        this.client.end()
      })

      it("should mark connection as idle", function() {
        assert.include(this.body, "Connection: close")
      })
    })
  })

  describe("on uncaught error", function() {
    before(async function() {
      /* Do not const mocha catch exceptions. */
      process.removeAllListeners("uncaughtException")

      this.app = new Application({
        port: test.nextPort,
      })

      process.env.NODE_ENV = "production"
      this.app.start()

      this.app.logger.console.clear()
      process.emit("uncaughtException", new Error())
      await sleep(550)
      this.entry = JSON.parse(this.app.logger.console.stdout.toString().split("\n").shift())
    })

    after(function() {
      process.env.NODE_ENV = "test"
      this.app.stop()
    })

    it("should log error", function() {
      assert.include(this.entry.message, "uncaught Error\n    at")
    })

    it("should log with critical severity", function() {
      assert.equal(this.entry.severity, "CRITICAL")
    })

    it("should set process exit code", function() {
      assert.equal(exitCode, 1)
    })
  })

  describe("dispatch", function() {
    describe("without handler", function() {
      before(async function() {
        const app = new Application({
          port: test.nextPort,
        })

        const {res, body} = await test.request(app)

        this.res = res
        this.body = body
        this.entry = JSON.parse(app.logger.console.stdout.toString())
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Not found","message":"Endpoint does not exist"}')
      })

      it("should return http not found", function() {
        assert.equal(this.res.statusCode, 404)
      })

      it("should log request", function() {
        assert.equal(this.entry.httpRequest.status, 404)
      })
    })

    describe("with handlers", function() {
      before(async function() {
        let ctx
        const calls = []
        const app = new Application({
          port: test.nextPort,
        })

        app.stack.push(function(next) {
          ctx = this
          calls.push(1)
          this.body = "ok"
          return next()
        })

        app.stack.push(function() {
          calls.push(2)
          this.status = 202
        })

        const {res, body} = await test.request(app)

        this.ctx = ctx
        this.calls = calls
        this.res = res
        this.body = body
        this.entry = JSON.parse(app.logger.console.stdout.toString())
      })

      it("should call handlers with context", function() {
        assert.equal(this.ctx.constructor.name, "Context")
      })

      it("should call handlers in order", function() {
        assert.deepEqual(this.calls, [1, 2])
      })

      it("should render body", function() {
        assert.equal(this.body, "ok")
      })

      it("should return status", function() {
        assert.equal(this.res.statusCode, 202)
      })

      it("should log request", function() {
        assert.equal(this.entry.httpRequest.status, 202)
      })
    })

    describe("with dynamic stack", function() {
      before(async function() {
        const app = new Application({
          port: test.nextPort,
        })

        app.stack.push(function(next) {
          this.stack.push(function() {
            this.body = "ok"
            this.status = 202
          })
          return next()
        })

        const {res, body} = await test.request(app)

        this.res = res
        this.body = body
        this.entry = JSON.parse(app.logger.console.stdout.toString())
      })

      it("should render body", function() {
        assert.equal(this.body, "ok")
      })

      it("should return status", function() {
        assert.equal(this.res.statusCode, 202)
      })

      it("should log request", function() {
        assert.equal(this.entry.httpRequest.status, 202)
      })
    })

    describe("with sync top handler", function() {
      before(async function() {
        const app = new Application({
          port: test.nextPort,
        })

        /* Replace entire stack; but top handler is not async. */
        app.stack.splice(0, app.stack.length, function() {
          this.response.end("ok")
        })

        const {res, body} = await test.request(app)

        this.res = res
        this.body = body
      })

      it("should render body", function() {
        assert.equal(this.body, "ok")
      })

      it("should return status", function() {
        assert.equal(this.res.statusCode, 200)
      })
    })

    describe("with uncallable handler", function() {
      before(async function() {
        const app = new Application({
          port: test.nextPort,
        })

        app.stack.push({foo: "bar"})

        const {res, body} = await test.request(app)

        this.res = res
        this.body = body
        this.entry = JSON.parse(app.logger.console.stdout.toString())
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Internal server error","message":"Bad handler"}')
      })

      it("should return http internal error", function() {
        assert.equal(this.res.statusCode, 500)
      })

      it("should log request", function() {
        assert.equal(this.entry.httpRequest.status, 500)
      })
    })

    describe("with http error", function() {
      before(async function() {
        const app = new Application({
          port: test.nextPort,
        })

        app.stack.push(() => {
          throw new TooManyRequests
        })

        const {res, body} = await test.request(app)

        this.res = res
        this.body = body
        this.entry = JSON.parse(app.logger.console.stdout.toString())
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Too many requests","message":"Too many requests"}')
      })

      it("should return error status", function() {
        assert.equal(this.res.statusCode, 429)
      })

      it("should log request", function() {
        assert.equal(this.entry.httpRequest.status, 429)
      })
    })

    describe("with unexposable error", function() {
      before(async function() {
        const app = new Application({
          port: test.nextPort,
        })

        app.stack.push(() => {
          throw new Error("Something went wrong")
        })

        process.env.NODE_ENV = "production"
        const {res, body} = await test.request(app)

        this.res = res
        this.body = body
        this.entry = JSON.parse(app.logger.console.stdout.toString())
      })

      after(function() {
        process.env.NODE_ENV = "test"
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Internal server error","message":"Internal server error"}')
      })

      it("should return http internal error", function() {
        assert.equal(this.res.statusCode, 500)
      })

      it("should log request", function() {
        assert.equal(this.entry.httpRequest.status, 500)
      })
    })

    describe("with uncaught error", function() {
      before(async function() {
        this.app = new Application({
          port: test.nextPort,
        })

        this.app.stack.length = 0
        this.app.stack.push(async () => {
          throw new Error("Something went wrong")
        })

        process.env.NODE_ENV = "production"
        this.app.start()

        process.removeAllListeners("uncaughtException")
        process.on("uncaughtException", err => {
          this.error = err
        })

        this.client = await test.createConnection(test.thisPort)
        this.client.write("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n")
      })

      after(function() {
        this.app.stop()
        process.env.NODE_ENV = "test"
      })

      it("should rethrow error", function() {
        assert.equal(this.error.message, "Something went wrong")
      })
    })
  })
})
