import {write, parseAuthorization} from "src/middleware"

describe("parse authorization", function() {
  describe("with username and password", function() {
    before(async function() {
      let ctx
      await test.request(
        test.createStack(write(), parseAuthorization(), function() {
          ctx = this
        }), {
          headers: {
            "Authorization": "Basic QWxhZGRpbjpPcGVuU2VzYW1l"
          }
        }
      )

      this.ctx = ctx
    })

    it("should assign username", function() {
      assert.equal(this.ctx.data.username, "Aladdin")
    })

    it("should assign password", function() {
      assert.equal(this.ctx.data.password, "OpenSesame")
    })
  })

  describe("with username", function() {
    before(async function() {
      let ctx
      await test.request(
        test.createStack(write(), parseAuthorization(), function() {
          ctx = this
        }), {
          headers: {
            "Authorization": "Basic QWxhZGRpbg=="
          }
        }
      )

      this.ctx = ctx
    })

    it("should assign username", function() {
      assert.equal(this.ctx.data.username, "Aladdin")
    })

    it("should assign blank password", function() {
      assert.equal(this.ctx.data.password, "")
    })
  })

  describe("with password", function() {
    before(async function() {
      let ctx
      await test.request(
        test.createStack(write(), parseAuthorization(), function() {
          ctx = this
        }), {
          headers: {
            "Authorization": "Basic Ok9wZW5TZXNhbWU="
          }
        }
      )

      this.ctx = ctx
    })

    it("should assign blank username", function() {
      assert.equal(this.ctx.data.username, "")
    })

    it("should assign password", function() {
      assert.equal(this.ctx.data.password, "OpenSesame")
    })
  })

  describe("without header", function() {
    before(async function() {
      let ctx
      await test.request(
        test.createStack(write(), parseAuthorization(), function() {
          ctx = this
        })
      )

      this.ctx = ctx
    })

    it("should not assign username", function() {
      assert.equal(this.ctx.data.username, undefined)
    })

    it("should not assign password", function() {
      assert.equal(this.ctx.data.password, undefined)
    })
  })

  describe("with blank header", function() {
    before(async function() {
      let ctx
      await test.request(
        test.createStack(write(), parseAuthorization(), function() {
          ctx = this
        }), {
          headers: {
            "Authorization": "Basic"
          }
        }
      )

      this.ctx = ctx
    })

    it("should not assign username", function() {
      assert.equal(this.ctx.data.username, undefined)
    })

    it("should not assign password", function() {
      assert.equal(this.ctx.data.password, undefined)
    })
  })

  describe("with non basic authorization", function() {
    before(async function() {
      let ctx
      await test.request(
        test.createStack(write(), parseAuthorization(), function() {
          ctx = this
        }), {
          headers: {
            "Authorization": "Bearer cn389ncoiwuencr"
          }
        }
      )

      this.ctx = ctx
    })

    it("should not assign username", function() {
      assert.equal(this.ctx.data.username, undefined)
    })

    it("should not assign password", function() {
      assert.equal(this.ctx.data.password, undefined)
    })
  })

  describe("with null byte in credentials", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), parseAuthorization()), {
          headers: {
            "Authorization": "Basic AEE6AEE"
          }
        }
      )

      this.res = res
      this.body = body
    })

    it("should render error", function() {
      assert.equal(this.body, '{"error":"Bad request","message":"Bad authorization header"}')
    })

    it("should return http unsupported media type", function() {
      assert.equal(this.res.statusCode, 400)
    })
  })

  describe("with control byte in credentials", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), parseAuthorization()), {
          headers: {
            "Authorization": "Basic B0E6ATVB"
          }
        }
      )

      this.res = res
      this.body = body
    })

    it("should render error", function() {
      assert.equal(this.body, '{"error":"Bad request","message":"Bad authorization header"}')
    })

    it("should return http unsupported media type", function() {
      assert.equal(this.res.statusCode, 400)
    })
  })
})
