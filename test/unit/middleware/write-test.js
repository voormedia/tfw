import fs from "fs"

import {write} from "src/middleware"

describe("write", function() {
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
})
