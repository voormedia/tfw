import fs from "fs"

import {write, rescue, shutdown} from "lib/middleware"

import {PaymentRequired} from "lib/errors"

let exitCode = 0
const exitHandler = process.exit
const nullHandler = (code) => {exitCode = code}

describe("shutdown", function() {
  before(function() {
    process.exit = nullHandler
  })

  after(function() {
    process.exit = exitHandler
  })

  describe("with running server", function() {
    describe("with slow request", function() {
      before(async function() {
       const {res, body} = await test.request(
          test.createStack(write(), rescue(), shutdown(0.02), async function() {
            await new Promise(resolve => setTimeout(resolve, 100))
            this.body = "ok"
          })
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should not render error", function() {
        assert.equal(this.body.toString(), "ok")
      })
    })

    describe("with fast request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), shutdown(0.02), async function() {
            await new Promise(resolve => setTimeout(resolve, 1))
            this.body = "ok"
          })
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should not render error", function() {
        assert.equal(this.body.toString(), "ok")
      })
    })
  })

  describe("with closing server", function() {
    describe("with slow request", function() {
      before(async function() {
        const app = test.createStack(write(), rescue(), shutdown(0.02), async function() {
          app.stop()
          await new Promise(resolve => setTimeout(resolve, 100))
          this.body = "ok"
        })

        const {res, body} = await test.request(app)

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 503)
      })

      it("should render error", function() {
        assert.equal(this.body.toString(), '{"error":"Service unavailable","message":"Please retry the request"}')
      })
    })

    describe("with fast request", function() {
      before(async function() {
        const app = test.createStack(write(), rescue(), shutdown(0.02), async function() {
          app.stop()
          await new Promise(resolve => setTimeout(resolve, 1))
          this.body = "ok"
        })

        const {res, body} = await test.request(app)

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should not render error", function() {
        assert.equal(this.body.toString(), "ok")
      })
    })
  })
})
