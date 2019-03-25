import timekeeper from "timekeeper"

import {InternalServerError} from "lib/errors"
import Logger from "lib/util/logger"
import MemoryConsole from "lib/util/memory-console"
import {log, write, rescue} from "lib/middleware"

describe("log", function() {
  before(function() {
    timekeeper.freeze(new Date(1330688329321))
    this.logger = new Logger(new MemoryConsole, Logger.JSON)
  })

  describe("on success", function() {
    describe("without proxy", function() {
      before(async function() {
        this.logger.console.clear()
        const {res, body} = await test.request(
          test.createStack(log(this.logger), write(), rescue(), function() {
            this.body = "ok"
            this.status = 201
            this.data.log = {foo: {bar: "qux"}}
          }), {
            method: "POST",
            path: "/foo",
            body: "foobar",
          }
        )

        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log severity", function() {
        assert.equal(this.entry.severity, "INFO")
      })

      it("should log message", function() {
        assert.equal(this.entry.message, "created")
      })

      it("should log request method", function() {
        assert.equal(this.entry.httpRequest.requestMethod, "POST")
      })

      it("should log request url", function() {
        assert.equal(this.entry.httpRequest.requestUrl, "/foo")
      })

      it("should log request size", function() {
        assert.equal(this.entry.httpRequest.requestSize, 89)
      })

      it("should log response status", function() {
        assert.equal(this.entry.httpRequest.status, 201)
      })

      it("should log response size", function() {
        assert.equal(this.entry.httpRequest.responseSize, 101)
      })

      it("should log remote ip", function() {
        assert.equal(this.entry.httpRequest.remoteIp, "::ffff:127.0.0.1")
      })

      it("should log latency", function() {
        assert.match(this.entry.httpRequest.latency, /\d+\.\d{3}s/)
      })

      it("should log additional data", function() {
        assert.equal(this.entry.foo.bar, "qux")
      })
    })

    describe("with proxy", function() {
      before(async function() {
        this.logger.console.clear()
        const {res, body} = await test.request(
          test.createStack(log(this.logger), write(), rescue(), function() {
            this.body = "ok"
            this.status = 201
            this.data.log = {foo: {bar: "qux"}}
          }), {
            method: "POST",
            path: "/foo",
            body: "foobar",
            headers: {
              "x-forwarded-for": "185.110.132.232, 35.186.220.41"
            },
          }
        )

        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log severity", function() {
        assert.equal(this.entry.severity, "INFO")
      })

      it("should log message", function() {
        assert.equal(this.entry.message, "created")
      })

      it("should log request method", function() {
        assert.equal(this.entry.httpRequest.requestMethod, "POST")
      })

      it("should log request url", function() {
        assert.equal(this.entry.httpRequest.requestUrl, "/foo")
      })

      it("should log request size", function() {
        assert.equal(this.entry.httpRequest.requestSize, 138)
      })

      it("should log response status", function() {
        assert.equal(this.entry.httpRequest.status, 201)
      })

      it("should log response size", function() {
        assert.equal(this.entry.httpRequest.responseSize, 101)
      })

      it("should log remote ip", function() {
        assert.equal(this.entry.httpRequest.remoteIp, "185.110.132.232")
      })

      it("should log latency", function() {
        assert.match(this.entry.httpRequest.latency, /\d+\.\d{3}s/)
      })

      it("should log additional data", function() {
        assert.equal(this.entry.foo.bar, "qux")
      })
    })

    describe("as health check", function() {
      before(async function() {
        this.logger.console.clear()
        const {res, body} = await test.request(
          test.createStack(log(this.logger), write(), rescue(), function() {
            this.body = "ok"
            this.status = 201
            this.data.log = {foo: {bar: "qux"}}
          }), {
            method: "POST",
            path: "/foo",
            body: "foobar",
            headers: {"user-agent": "GoogleHC/1.0"}
          }
        )

        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log severity", function() {
        assert.equal(this.entry.severity, "DEBUG")
      })

      it("should log message", function() {
        assert.equal(this.entry.message, "created")
      })

      it("should log request method", function() {
        assert.equal(this.entry.httpRequest.requestMethod, "POST")
      })

      it("should log request url", function() {
        assert.equal(this.entry.httpRequest.requestUrl, "/foo")
      })

      it("should log request size", function() {
        assert.equal(this.entry.httpRequest.requestSize, 115)
      })

      it("should log response status", function() {
        assert.equal(this.entry.httpRequest.status, 201)
      })

      it("should log response size", function() {
        assert.equal(this.entry.httpRequest.responseSize, 101)
      })

      it("should log remote ip", function() {
        assert.equal(this.entry.httpRequest.remoteIp, "::ffff:127.0.0.1")
      })

      it("should log latency", function() {
        assert.match(this.entry.httpRequest.latency, /\d+\.\d{3}s/)
      })

      it("should log additional data", function() {
        assert.equal(this.entry.foo.bar, "qux")
      })
    })
  })

  describe("on exposable error", function() {
    describe("without proxy", function() {
      before(async function() {
        this.logger.console.clear()
        const {res, body} = await test.request(
          test.createStack(log(this.logger), write(), rescue(), function() {
            this.status = 500
            this.data.error = this.body = new InternalServerError("Failure")
            this.data.log = {foo: {bar: "qux"}}
          }), {
            method: "POST",
            path: "/foo",
            body: "foobar",
          }
        )

        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log severity", function() {
        assert.equal(this.entry.severity, "WARNING")
      })

      it("should log message", function() {
        assert.equal(this.entry.message, "Failure")
      })

      it("should log request method", function() {
        assert.equal(this.entry.httpRequest.requestMethod, "POST")
      })

      it("should log request url", function() {
        assert.equal(this.entry.httpRequest.requestUrl, "/foo")
      })

      it("should log request size", function() {
        assert.equal(this.entry.httpRequest.requestSize, 89)
      })

      it("should log response status", function() {
        assert.equal(this.entry.httpRequest.status, 500)
      })

      it("should log response size", function() {
        assert.equal(this.entry.httpRequest.responseSize, 199)
      })

      it("should log remote ip", function() {
        assert.equal(this.entry.httpRequest.remoteIp, "::ffff:127.0.0.1")
      })

      it("should log latency", function() {
        assert.match(this.entry.httpRequest.latency, /\d+\.\d{3}s/)
      })

      it("should log additional data", function() {
        assert.equal(this.entry.foo.bar, "qux")
      })
    })
  })

  describe("on anonymous exposable error", function() {
    describe("without proxy", function() {
      before(async function() {
        this.logger.console.clear()
        const {res, body} = await test.request(
          test.createStack(log(this.logger), write(), rescue(), function() {
            this.status = 500
            const err = new Error
            err.expose = true
            this.data.error = this.body = err
            this.data.log = {foo: {bar: "qux"}}
          }), {
            method: "POST",
            path: "/foo",
            body: "foobar",
          }
        )

        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log severity", function() {
        assert.equal(this.entry.severity, "WARNING")
      })

      it("should log message", function() {
        assert.equal(this.entry.message, "(no message)")
      })

      it("should log request method", function() {
        assert.equal(this.entry.httpRequest.requestMethod, "POST")
      })

      it("should log request url", function() {
        assert.equal(this.entry.httpRequest.requestUrl, "/foo")
      })

      it("should log request size", function() {
        assert.equal(this.entry.httpRequest.requestSize, 89)
      })

      it("should log response status", function() {
        assert.equal(this.entry.httpRequest.status, 500)
      })

      it("should log response size", function() {
        assert.equal(this.entry.httpRequest.responseSize, 161)
      })

      it("should log remote ip", function() {
        assert.equal(this.entry.httpRequest.remoteIp, "::ffff:127.0.0.1")
      })

      it("should log latency", function() {
        assert.match(this.entry.httpRequest.latency, /\d+\.\d{3}s/)
      })

      it("should log additional data", function() {
        assert.equal(this.entry.foo.bar, "qux")
      })
    })
  })

  describe("on internal error", function() {
    describe("without proxy", function() {
      before(async function() {
        this.logger.console.clear()
        const {res, body} = await test.request(
          test.createStack(log(this.logger), write(), rescue(), function() {
            this.status = 500
            this.data.error = new Error
            this.body = new InternalServerError
            this.data.log = {foo: {bar: "qux"}}
          }), {
            method: "POST",
            path: "/foo",
            body: "foobar",
          }
        )

        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log severity", function() {
        assert.equal(this.entry.severity, "ERROR")
      })

      it("should log error", function() {
        assert.include(this.entry.message, "Error")
      })

      it("should log request method", function() {
        assert.equal(this.entry.httpRequest.requestMethod, "POST")
      })

      it("should log request url", function() {
        assert.equal(this.entry.httpRequest.requestUrl, "/foo")
      })

      it("should log request size", function() {
        assert.equal(this.entry.httpRequest.requestSize, 89)
      })

      it("should log response status", function() {
        assert.equal(this.entry.httpRequest.status, 500)
      })

      it("should log response size", function() {
        assert.equal(this.entry.httpRequest.responseSize, 213)
      })

      it("should log remote ip", function() {
        assert.equal(this.entry.httpRequest.remoteIp, "::ffff:127.0.0.1")
      })

      it("should log latency", function() {
        assert.match(this.entry.httpRequest.latency, /\d+\.\d{3}s/)
      })

      it("should log additional data", function() {
        assert.equal(this.entry.foo.bar, "qux")
      })
    })
  })
})
