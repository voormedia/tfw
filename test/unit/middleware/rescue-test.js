import {PaymentRequired} from "src/errors"
import {rescue, write} from "src/middleware"

let exitCode = 0
const exitHandler = process.exit
const nullHandler = (code) => {exitCode = code}

describe("rescue", function() {
  before(function() {
    process.exit = nullHandler
  })

  after(function() {
    process.exit = exitHandler
  })

  describe("with service error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
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

    it("should render error", function() {
      assert.equal(this.body, '{"error":"Payment required","message":"Payment required"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, PaymentRequired)
    })
  })

  describe("with unexpected error", function() {
    before(async function() {
      process.env.NODE_ENV = "production"

      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), function() {
          ctx = this
          throw new Error
        })
      )

      this.res = res
      this.body = body
      this.ctx = ctx
    })

    after(function() {
      process.env.NODE_ENV = "test"
    })

    it("should write status", function() {
      assert.equal(this.res.statusCode, 500)
    })

    it("should render error", function() {
      assert.equal(this.body, '{"error":"Internal server error","message":"Internal server error"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })

  describe("with closing server", function() {
    describe("with slow request", function() {
      before(async function() {
       const {res, body} = await test.request(
          test.createStack(write(), rescue({terminationGrace: 0.02}), async function() {
            this.app.stop()
            await new Promise(resolve => setTimeout(resolve, 5000))
            this.body = "ok"
          })
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 503)
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Service unavailable","message":"Please retry the request"}')
      })
    })

    describe("with fast request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue({terminationGrace: 0.02}), async function() {
            this.app.stop()
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

      it("should render error", function() {
        assert.equal(this.body, "ok")
      })
    })
  })
})
