import fs from "fs"

import {write, rescue} from "src/middleware"

import {PaymentRequired} from "src/errors"

let exitCode = 0
const exitHandler = process.exit
const nullHandler = (code) => {exitCode = code}

describe("rescue", function() {
  before(function() {
    process.exit = nullHandler
    process.env.NODE_ENV = "production"
  })

  after(function() {
    process.exit = exitHandler
    process.env.NODE_ENV = "test"
  })

  describe("with exposable error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
          ctx.set("Foo", "bar")

          const error = new Error
          error.expose = true
          error.toJSON = () => ({foo: "bar"})
          throw error
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
    })

    it("should write status", function() {
      assert.equal(this.res.statusCode, 500)
    })

    it("should write headers", function() {
      assert.equal(this.res.headers["foo"], "bar")
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"foo":"bar"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })

  describe("with service error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
          ctx.set("Foo", "bar")
          throw new PaymentRequired
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
    })

    it("should write status", function() {
      assert.equal(this.res.statusCode, 402)
    })

    it("should write headers", function() {
      assert.equal(this.res.headers["foo"], "bar")
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"Payment required","message":"Payment required"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, PaymentRequired)
    })
  })

  describe("with unexpected error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
          ctx.set("Foo", "bar")
          throw new Error
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
    })

    it("should write status", function() {
      assert.equal(this.res.statusCode, 500)
    })

    it("should write headers", function() {
      assert.equal(this.res.headers["foo"], "bar")
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"Internal server error","message":"Internal server error"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })

  describe("with bad header", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
          ctx.set("Foo", "bar")
          ctx.set("Location", "\x00\x00")
          ctx.set("Foo", "never reached")
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
    })

    it("should write status", function() {
      assert.equal(this.res.statusCode, 500)
    })

    it("should write headers", function() {
      assert.equal(this.res.headers["foo"], "bar")
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"Internal server error","message":"Internal server error"}')
    })

    it("should save error", function() {
      assert.include(["TypeError", "NodeError"], this.ctx.data.error.constructor.name)
    })
  })

  describe("with bad status code", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
          ctx.set("Foo", "bar")
          ctx.status = 0
          ctx.set("Foo", "never reached")
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
    })

    it("should write status", function() {
      assert.equal(this.res.statusCode, 500)
    })

    it("should write headers", function() {
      assert.equal(this.res.headers["foo"], "bar")
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"Internal server error","message":"Internal server error"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, RangeError)
    })
  })

  describe("with early stream error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
          this.status = 429
          this.set("Foo", "bar")
          this.body = fs.createReadStream("doesnotexist")
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
    })

    it("should write status", function() {
      assert.equal(this.res.statusCode, 500)
    })

    it("should write headers", function() {
      assert.equal(this.res.headers["foo"], "bar")
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"Internal server error","message":"Internal server error"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })

  describe("with late stream error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
          this.status = 429
          this.set("Foo", "bar")
          this.body = fs.createReadStream("package.json")
          this.body.on("data", data => {
            process.nextTick(() => {
              this.body.emit("error", new Error)
            })
          })
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
    })

    it("should write status", function() {
      assert.equal(this.res.statusCode, 429)
    })

    it("should write headers", function() {
      assert.equal(this.res.headers["foo"], "bar")
    })

    it("should write body", function() {
      assert.deepEqual(this.body.toString().substr(0, 20), "{\n  \"private\": true,")
    })

    it("should not set content length", function() {
      assert.equal(this.res.headers["content-length"], undefined)
    })

    it("should set transfer encoding", function() {
      assert.equal(this.res.headers["transfer-encoding"], "chunked")
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })
})
