import fs from "fs"

import {write} from "src/middleware"

import {PaymentRequired} from "src/errors"

let exitCode = 0
const exitHandler = process.exit
const nullHandler = (code) => {exitCode = code}

describe("write", function() {
  before(function() {
    process.exit = nullHandler
    process.env.NODE_ENV = "production"
  })

  after(function() {
    process.exit = exitHandler
    process.env.NODE_ENV = "test"
  })

  describe("string", function() {
    describe("with get request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), function() {
            this.body = "øk"
            this.status = 429
            this.set("Foo", "bar")
          })
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 429)
      })

      it("should write headers", function() {
        assert.equal(this.res.headers["foo"], "bar")
      })

      it("should write body", function() {
        assert.equal(this.body, "øk")
      })

      it("should set content length", function() {
        assert.equal(this.res.headers["content-length"], 3)
      })
    })

    describe("with head request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), function() {
            this.body = "øk"
            this.set("Foo", "bar")
          }),
          {method: "head"}
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should write headers", function() {
        assert.equal(this.res.headers["foo"], "bar")
      })

      it("should not write body", function() {
        assert.equal(this.body, "")
      })

      it.skip("should set content length", function() {
        assert.equal(this.res.headers["content-length"], 3)
      })
    })
  })

  describe("buffer", function() {
    describe("with get request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), function() {
            this.body = Buffer.from([0x00, 0x01, 0xfe, 0xff])
            this.status = 429
            this.set("Foo", "bar")
          })
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 429)
      })

      it("should write headers", function() {
        assert.equal(this.res.headers["foo"], "bar")
      })

      it("should write body", function() {
        assert.deepEqual(this.body, Buffer.from([0x00, 0x01, 0xfe, 0xff]))
      })

      it("should set content length", function() {
        assert.equal(this.res.headers["content-length"], 4)
      })
    })

    describe("with head request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), function() {
            this.body = Buffer.from([0x00, 0x01, 0xfe, 0xff])
            this.set("Foo", "bar")
          }),
          {method: "head"}
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should write headers", function() {
        assert.equal(this.res.headers["foo"], "bar")
      })

      it("should not write body", function() {
        assert.equal(this.body, "")
      })

      it.skip("should set content length", function() {
        assert.equal(this.res.headers["content-length"], 4)
      })
    })
  })

  describe("stream", function() {
    describe("with get request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), function() {
            this.status = 429
            this.set("Foo", "bar")
            this.body = fs.createReadStream("package.json")
          })
        )

        this.res = res
        this.body = body
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
    })

    describe("with head request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), function() {
            this.set("Foo", "bar")
            this.body = fs.createReadStream("package.json")
          }),
          {method: "head"}
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should write headers", function() {
        assert.equal(this.res.headers["foo"], "bar")
      })

      it("should not write body", function() {
        assert.equal(this.body, "")
      })

      it("should not set content length", function() {
        assert.equal(this.res.headers["content-length"], undefined)
      })

      it("should not set transfer encoding", function() {
        assert.equal(this.res.headers["transfer-encoding"], undefined)
      })
    })

    describe("with early error", function() {
      before(async function() {
        let ctx
        const {res, body} = await test.request(
          test.createStack(write(), function() {
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
        assert.equal(this.body, '{"error":"Internal server error","message":"Internal server error"}')
      })

      it("should save error", function() {
        assert.equal(this.ctx.data.error.constructor, Error)
      })
    })

    describe("with late error", function() {
      before(async function() {
        let ctx
        const {res, body} = await test.request(
          test.createStack(write(), function() {
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

  describe("json", function() {
    describe("with get request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), function() {
            this.body = {result: "ok"}
            this.status = 429
            this.set("Foo", "bar")
          })
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 429)
      })

      it("should write headers", function() {
        assert.equal(this.res.headers["foo"], "bar")
      })

      it("should write body", function() {
        assert.equal(this.body, '{"result":"ok"}')
      })

      it("should set content length", function() {
        assert.equal(this.res.headers["content-length"], 15)
      })
    })

    describe("with head request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), function() {
            this.body = {result: "ok"}
            this.set("Foo", "bar")
          }),
          {method: "head"}
        )

        this.res = res
        this.body = body
      })

      it("should write status", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should write headers", function() {
        assert.equal(this.res.headers["foo"], "bar")
      })

      it("should not write body", function() {
        assert.equal(this.body, "")
      })

      it.skip("should set content length", function() {
        assert.equal(this.res.headers["content-length"], 15)
      })
    })
  })

  describe("with exposable error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), function() {
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
      assert.equal(this.body, '{"foo":"bar"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })

  describe("with service error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), function() {
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
      assert.equal(this.body, '{"error":"Payment required","message":"Payment required"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, PaymentRequired)
    })
  })

  describe("with unexpected error", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), function() {
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
      assert.equal(this.body, '{"error":"Internal server error","message":"Internal server error"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, Error)
    })
  })

  describe("with bad header", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), function() {
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
      assert.equal(this.body, '{"error":"Internal server error","message":"Internal server error"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, TypeError)
    })
  })

  describe("with bad status code", function() {
    before(async function() {
      let ctx
      const {res, body} = await test.request(
        test.createStack(write(), function() {
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
      assert.equal(this.body, '{"error":"Internal server error","message":"Internal server error"}')
    })

    it("should save error", function() {
      assert.equal(this.ctx.data.error.constructor, RangeError)
    })
  })
})
