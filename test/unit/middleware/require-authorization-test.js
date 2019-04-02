import {write, rescue, parseAuthorization, requireAuthorization} from "src/middleware"

describe("require authorization", function() {
  describe("with correct username and password", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
          requireAuthorization("test realm", {Aladdin: "OpenSesame"}), function() {exec = true}), {
          headers: {
            "Authorization": "Basic QWxhZGRpbjpPcGVuU2VzYW1l"
          }
        }
      )

      this.res = res
      this.exec = exec
    })

    it("should grant access", function() {
      assert.equal(this.res.statusCode, 200)
    })

    it("should execute handler", function() {
      assert.equal(this.exec, true)
    })
  })

  describe("with incorrect password", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
          requireAuthorization("test realm", {Aladdin: "SesameOpen"}), function() {exec = true}), {
          headers: {
            "Authorization": "Basic QWxhZGRpbjpPcGVuU2VzYW1l"
          }
        }
      )

      this.res = res
      this.exec = exec
    })

    it("should return http unauthorized", function() {
      assert.equal(this.res.statusCode, 401)
    })

    it("should challenge with realm", function() {
      assert.equal(this.res.headers["www-authenticate"], "Basic realm=\"test realm\"")
    })

    it("should not execute handler", function() {
      assert.equal(this.exec, false)
    })
  })

  describe("with blank password", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
          requireAuthorization("test realm", {Aladdin: "OpenSesame"}), function() {exec = true}), {
          headers: {
            "Authorization": "Basic QWxhZGRpbg=="
          }
        }
      )

      this.res = res
      this.exec = exec
    })

    it("should return http unauthorized", function() {
      assert.equal(this.res.statusCode, 401)
    })

    it("should challenge with realm", function() {
      assert.equal(this.res.headers["www-authenticate"], "Basic realm=\"test realm\"")
    })

    it("should not execute handler", function() {
      assert.equal(this.exec, false)
    })
  })

  describe("with blank username", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
        requireAuthorization("test realm", {Aladdin: "OpenSesame"}), function() {exec = true}), {
          headers: {
            "Authorization": "Basic Ok9wZW5TZXNhbWU="
          }
        }
      )

      this.res = res
      this.exec = exec
    })

    it("should return http unauthorized", function() {
      assert.equal(this.res.statusCode, 401)
    })

    it("should challenge with realm", function() {
      assert.equal(this.res.headers["www-authenticate"], "Basic realm=\"test realm\"")
    })

    it("should not execute handler", function() {
      assert.equal(this.exec, false)
    })
  })

  describe("without header", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
        requireAuthorization("test realm", {Aladdin: "OpenSesame"}), function() {exec = true})
      )

      this.res = res
      this.exec = exec
    })

    it("should return http unauthorized", function() {
      assert.equal(this.res.statusCode, 401)
    })

    it("should not execute handler", function() {
      assert.equal(this.exec, false)
    })
  })

  describe("with blank header", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
        requireAuthorization("test realm", {Aladdin: "OpenSesame"}), function() {exec = true}), {
          headers: {
            "Authorization": "Basic"
          }
        }
      )

      this.res = res
      this.exec = exec
    })

    it("should return http unauthorized", function() {
      assert.equal(this.res.statusCode, 401)
    })

    it("should challenge with realm", function() {
      assert.equal(this.res.headers["www-authenticate"], "Basic realm=\"test realm\"")
    })

    it("should not execute handler", function() {
      assert.equal(this.exec, false)
    })
  })

  describe("with non basic authorization", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
        requireAuthorization("test realm", {Aladdin: "OpenSesame"}), function() {exec = true}), {
          headers: {
            "Authorization": "Bearer cn389ncoiwuencr"
          }
        }
      )

      this.res = res
      this.exec = exec
    })

    it("should return http unauthorized", function() {
      assert.equal(this.res.statusCode, 401)
    })

    it("should challenge with realm", function() {
      assert.equal(this.res.headers["www-authenticate"], "Basic realm=\"test realm\"")
    })

    it("should not execute handler", function() {
      assert.equal(this.exec, false)
    })
  })

  describe("with null byte in credentials", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
        requireAuthorization("test realm", {Aladdin: "OpenSesame"})), {
          headers: {
            "Authorization": "Basic AEE6AEE"
          }
        }
      )

      this.res = res
      this.exec = exec
      this.body = body
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"invalid_authorization","message":"Invalid authorization header."}')
    })

    it("should return http unsupported media type", function() {
      assert.equal(this.res.statusCode, 400)
    })
  })

  describe("with control byte in credentials", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseAuthorization(),
        requireAuthorization("test realm", {Aladdin: "OpenSesame"})), {
          headers: {
            "Authorization": "Basic B0E6ATVB"
          }
        }
      )

      this.res = res
      this.exec = exec
      this.body = body
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"invalid_authorization","message":"Invalid authorization header."}')
    })

    it("should return http unsupported media type", function() {
      assert.equal(this.res.statusCode, 400)
    })
  })
})
