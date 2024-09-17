import {write, rescue, bufferBody, parseBody} from "src/middleware"

describe("parse body", function() {
  describe("with json content type", function() {
    describe("with json content", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), bufferBody(), parseBody(), function() {
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
          test.createStack(write(), rescue(), bufferBody(), parseBody(), function() {
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
          test.createStack(write(), rescue(), bufferBody(), parseBody(), function() {
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
          test.createStack(write(), rescue(), bufferBody(), parseBody(), function() {
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

    describe("with binary content", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), bufferBody(), parseBody()), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: Buffer.from([0x40, 0x50, 0x60, 0x10, 0x20])
          }
        )

        this.res = res
        this.body = body
      })

      it("should render error", function() {
        assert.equal(this.body.toString(), '{"error":"invalid_request","message":"Request body of type \'application/x-www-form-urlencoded\' contains invalid byte 0x10."}')
      })

      it("should return http bad request", function() {
        assert.equal(this.res.statusCode, 400)
      })
    })

    describe("with large binary content", function() {
      before(async function() {
        const buf = Buffer.alloc(100000, 0x20)
        buf[buf.length - 1] = 0

        const {res, body} = await test.request(
          test.createStack(write(), rescue(), bufferBody(), parseBody()), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: buf
          }
        )

        this.res = res
        this.body = body
      })

      it("should render error", function() {
        assert.equal(this.body.toString(), '{"error":"invalid_request","message":"Request body of type \'application/x-www-form-urlencoded\' contains invalid byte 0x0."}')
      })

      it("should return http bad request", function() {
        assert.equal(this.res.statusCode, 400)
      })
    })
  })

  describe("with bad content type", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), bufferBody(), parseBody()), {
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
        test.createStack(write(), rescue(), bufferBody(), parseBody()), {
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
        test.createStack(write(), rescue(), bufferBody(), parseBody()), {
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
      assert.equal(this.body.toString(), '{"error":"invalid_request","message":"Expected property name or \'}\' in JSON at position 1."}')
    })

    it("should return http bad request", function() {
      assert.equal(this.res.statusCode, 400)
    })
  })

  describe("with too large body", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), bufferBody(), parseBody()), {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: Buffer.alloc(100100)
        }
      )

      this.res = res
      this.body = body
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"request_entity_too_large","message":"Request body of type \'application/json\' cannot be longer than 100 KB."}')
    })

    it("should return http request entity too large", function() {
      assert.equal(this.res.statusCode, 413)
    })
  })
})
