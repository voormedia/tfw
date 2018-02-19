import {write, rescue, connect} from "src/middleware"

describe("connect", function() {
  describe("with connect middleware", function() {
    before(async function() {
      let called = false
      const mw = (req, res, next) => {
        called = true
        next()
      }

      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), connect(mw), function() {
          ctx = this
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
      this.called = called
    })

    it("should render body", function() {
      assert.equal(this.body.toString(), "")
    })

    it("should continue through stack", function() {
      assert.equal(this.ctx.constructor.name, "Context")
    })

    it("should execute middleware", function() {
      assert.equal(this.called, true)
    })
  })

  describe("with connect middleware on error", function() {
    before(async function() {
      let called = false
      const mw = (req, res, next) => {
        called = true
        next()
      }

      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), connect(mw), function() {
          ctx = this

          const error = new Error
          error.expose = true
          error.toJSON = () => ({foo: "bar"})
          throw error
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
      this.called = called
    })

    it("should execute middleware", function() {
      assert.equal(this.called, true)
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"foo":"bar"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })

  describe("with throwing connect middleware", function() {
    before(async function() {
      let called = false
      const mw = (req, res, next) => {
        called = true

        const error = new Error
        error.expose = true
        error.toJSON = () => ({foo: "bar"})
        next(error)
      }

      let ctx
      function saveCtx(next) {
        ctx = this
        return next()
      }

      const {res, body} = await test.request(
        test.createStack(write(), rescue(), saveCtx, connect(mw), function() {
          throw Error("should not reach")
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
      this.called = called
    })

    it("should execute middleware", function() {
      assert.equal(this.called, true)
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"foo":"bar"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })
})
