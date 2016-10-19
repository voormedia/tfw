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

  describe("without non basic authorization", function() {
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
})
