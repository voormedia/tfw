import {write, rescue, exposeAllErrors} from "src/middleware"

import {PaymentRequired, InternalServerError} from "src/errors"

const exitHandler = process.exit
const nullHandler = (code) => {exitCode = code}

describe("expose all errors", function() {
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
        test.createStack(write(), rescue(), exposeAllErrors(), function() {
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
        test.createStack(write(), rescue(), exposeAllErrors(), function() {
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
      assert.equal(this.body.toString(), '{"error":"payment_required","message":"Payment required."}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, PaymentRequired)
    })
  })

  describe("with unexpected error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), exposeAllErrors(), function() {
          ctx = this
          ctx.set("Foo", "bar")
          throw new Error("Oh no!")
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
      assert.equal(this.body.toString(), '{"error":"internal_error","message":"Oh no!"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })

  describe("with unexpected error with json serialization", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), exposeAllErrors(), function() {
          ctx = this
          ctx.set("Foo", "bar")

          const error = new Error
          error.expose = false
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

  describe("with unexpected string thrown", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), exposeAllErrors(), function() {
          ctx = this
          ctx.set("Foo", "bar")
          throw "Oh no!"
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
      assert.equal(this.body.toString(), '{"error":"internal_error","message":"Oh no!"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, InternalServerError)
    })
  })

  describe("with unexpected object thrown", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), exposeAllErrors(), function() {
          ctx = this
          ctx.set("Foo", "bar")
          throw {Message: "Oh no!", Code: 123}
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
      assert.equal(this.body.toString(), '{"error":"internal_error","message":"Oh no!"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, InternalServerError)
    })
  })
})
