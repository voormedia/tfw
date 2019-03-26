import {write, rescue, parseBody} from "src/middleware"

describe("parse body", function() {
  describe("with json content type", function() {
    describe("with json content", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), parseBody(), function() {
            ctx = this
          }), {
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
            body: '{"foo": "bar"}'
          }
        )

        this.ctx = ctx
      })

      it("should assign body as json", function() {
        assert.deepEqual(this.ctx.data.body, {foo: "bar"})
      })
    })

    describe("with png content", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), parseBody(), function() {
            ctx = this
          }), {
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            method: "POST",
            body: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00])
          }
        )

        this.ctx = ctx
      })

      it("should assign unparsed body", function() {
        assert.deepEqual(this.ctx.data.body, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]))
      })
    })
  })

  describe("with urlencoded content type", function() {
    describe("with json content", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), parseBody(), function() {
            ctx = this
          }), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            },
            method: "POST",
            body: 'foo=bar'
          }
        )

        this.ctx = ctx
      })

      it("should assign body as json", function() {
        assert.deepEqual(this.ctx.data.body, {foo: "bar"})
      })
    })

    describe("with png content", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), parseBody(), function() {
            ctx = this
          }), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            },
            method: "POST",
            body: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00])
          }
        )

        this.ctx = ctx
      })

      it("should assign unparsed body", function() {
        assert.deepEqual(this.ctx.data.body, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]))
      })
    })
  })

  describe("with bad content type", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseBody()), {
          headers: {
            "Content-Type": "some strange header; foo; bar; baz"
          },
          method: "POST",
          body: 'foo=bar'
        }
      )

      this.res = res
      this.body = body
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"invalid_request","message":"Invalid Content-Type header."}')
    })

    it("should return http bad request", function() {
      assert.equal(this.res.statusCode, 400)
    })
  })

  describe("with bad charset", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseBody()), {
          headers: {
            "Content-Type": "application/json; charset=utf-16"
          },
          method: "POST",
          body: 'foo=bar'
        }
      )

      this.res = res
      this.body = body
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"unsupported_media_type","message":"Character set \'utf-16\' is not supported."}')
    })

    it("should return http unsupported media type", function() {
      assert.equal(this.res.statusCode, 415)
    })
  })

  describe("with bad json", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseBody()), {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: '{foo=bar}'
        }
      )

      this.res = res
      this.body = body
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"invalid_request","message":"Unexpected token f in JSON at position 1."}')
    })

    it("should return http bad request", function() {
      assert.equal(this.res.statusCode, 400)
    })
  })
})
