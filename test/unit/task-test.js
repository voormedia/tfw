import mocha from "mocha"

import Task from "lib/task"
import Logger from "lib/util/logger"
import {TooManyRequests} from "lib/errors"

import sleep from "lib/util/sleep"

let exitCode = 0
const exitHandler = process.exit
const nullHandler = (code) => {exitCode = code}

describe("task", function() {
  before(function() {
    process.exit = nullHandler

    this.uncaughtExceptionListeners = process.listeners("uncaughtException")
    this.unhandledRejectionListeners = process.listeners("unhandledRejection")
  })

  after(function() {
    process.exit = exitHandler

    process.removeAllListeners("uncaughtException")
    for (const listener of this.uncaughtExceptionListeners) {
      process.on("uncaughtException", listener)
    }

    process.removeAllListeners("unhandledRejection")
    for (const listener of this.unhandledRejectionListeners) {
      process.on("unhandledRejection", listener)
    }
  })

  describe("start", function() {
    before(async function() {
      const calls = []
      class task extends Task {
        async run() {
          calls.push(1)
        }
      }

      this.task = new task()
      process.env.NODE_ENV = "production"
      await this.task.start()
      this.calls = calls
    })

    after(function() {
      process.env.NODE_ENV = "test"
    })

    it("should run task", function() {
      assert.deepEqual(this.calls, [1])
    })
  })

  describe("on uncaught error", function() {
    before(async function() {
      process.removeAllListeners("uncaughtException")

      class task extends Task {
        async run() {
          await sleep(100)
        }
      }

      this.task = new task()
      process.env.NODE_ENV = "production"
      await this.task.start()

      this.task.logger.console.clear()
      process.emit("uncaughtException", new Error())
      await sleep(550)
      this.entry = JSON.parse(this.task.logger.console.stdout.toString().split("\n").shift())
    })

    after(function() {
      process.env.NODE_ENV = "test"
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

  describe("on unhandled rejection", function() {
    before(async function() {
      process.removeAllListeners("unhandledRejection")

      class task extends Task {
        async run() {
          await sleep(100)
        }
      }

      this.task = new task()
      process.env.NODE_ENV = "production"
      await this.task.start()

      this.task.logger.console.clear()
      Promise.reject(new Error())
      await sleep(550)
      this.entry = JSON.parse(this.task.logger.console.stdout.toString().split("\n").shift())
    })

    after(function() {
      process.env.NODE_ENV = "test"
    })

    it("should log error", function() {
      assert.include(this.entry.message, "unhandled Error\n    at")
    })

    it("should log with critical severity", function() {
      assert.equal(this.entry.severity, "CRITICAL")
    })

    it("should set process exit code", function() {
      assert.equal(exitCode, 2)
    })
  })
})
