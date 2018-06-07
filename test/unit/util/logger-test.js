import fs from "fs"
import timekeeper from "timekeeper"

import Logger from "src/util/logger"
import MemoryConsole from "src/util/memory-console"

describe("log", function() {
  before(function() {
    timekeeper.freeze(new Date(1330688329321))
  })

  describe("with json format", function() {
    before(function() {
      this.logger = new Logger(new MemoryConsole, Logger.JSON)
    })

    describe("with string message", function() {
      before(function() {
        this.logger.console.clear()
        this.logger.debug("Hello, world!")
        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log string", function() {
        assert.equal(this.entry.message, "Hello, world!")
      })

      it("should log time", function() {
        assert.equal(this.entry.time, "2012-03-02T11:38:49.321Z")
      })

      it("should log severity", function() {
        assert.equal(this.entry.severity, "DEBUG")
      })

      it("should log service name", function() {
        assert.equal(this.entry.serviceContext.service, "mocha")
      })

      it("should log service version", function() {
        assert.match(this.entry.serviceContext.version, /\d+\.\d+\.\d+/)
      })
    })

    describe("with multiline string message", function() {
      before(function() {
        this.logger.console.clear()
        this.logger.debug("Hello\nworld!")
        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log string", function() {
        assert.equal(this.entry.message, "Hello\nworld!")
      })
    })

    describe("with undefined message", function() {
      before(function() {
        this.logger.console.clear()
        this.logger.debug(undefined)
        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log undefined", function() {
        assert.equal(this.entry.message, "undefined")
      })
    })

    describe("with object message", function() {
      before(function() {
        this.logger.console.clear()
        this.logger.debug({"foo": "bar"})
        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log jsonified object", function() {
        assert.equal(this.entry.message, '{"foo":"bar"}')
      })
    })

    describe("with error level", function() {
      before(function errorTest() {
        this.logger.console.clear()
        this.logger.error("oops!")
        this.entry = JSON.parse(this.logger.console.stdout.toString())
      })

      it("should log source location", function() {
        assert.equal(this.entry.reportLocation.filePath,
          "test/unit/util/logger-test.js")

        assert.equal(this.entry.reportLocation.functionName,
          "errorTest")
      })
    })
  })

  describe("with pretty format", function() {
    before(function() {
      this.logger = new Logger(new MemoryConsole, Logger.PRETTY)
    })

    describe("with string message", function() {
      before(function() {
        this.logger.console.clear()
        this.logger.debug("Hello, world!")
        this.entry = this.logger.console.stdout.toString()
      })

      it("should log string", function() {
        assert.include(this.entry, "Hello, world!")
      })

      it("should log time", function() {
        assert.include(this.entry, "[Mar 2, 2012, 12:38:49]")
      })

      it("should log severity by color", function() {
        assert.include(this.entry, "\x1b[30m\x1b[1m")
      })
    })

    describe("with multiline string message", function() {
      before(function() {
        this.logger.console.clear()
        this.logger.debug("Hello\nworld!")
        this.entry = this.logger.console.stdout.toString()
      })

      it("should log string", function() {
        assert.include(this.entry, "Hello\nworld!")
      })
    })

    describe("with undefined message", function() {
      before(function() {
        this.logger.console.clear()
        this.logger.debug(undefined)
        this.entry = this.logger.console.stdout.toString()
      })

      it("should log undefined", function() {
        assert.include(this.entry, "undefined")
      })
    })

    describe("with object message", function() {
      before(function() {
        this.logger.console.clear()
        this.logger.debug({"foo": "bar"})
        this.entry = this.logger.console.stdout.toString()
      })

      it("should log jsonified object", function() {
        assert.include(this.entry, '{"foo":"bar"}')
      })
    })
  })
})
