import {write, rescue, allowCors} from "src/middleware"

const methods = [
  "OPTIONS",
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]

describe("allow cors", function() {
  describe("with catch all and defaults", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), allowCors({origin: "*"}), function () {
          this.body = "ok"
          this.status = 200
        }
      ))

      this.res = res
    })

    it("should return 200", function() {
      assert.equal(this.res.statusCode, 200)
    })

    it("should return access control allowed orgins", function() {
      assert.equal(this.res.headers["access-control-allow-origin"], "*")
    })

    it("should return access control allowed methods", function() {
      assert.equal(this.res.headers["access-control-allow-methods"],
        "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    })

    it("should return no access control allowed headers", function() {
      assert.equal(this.res.headers["access-control-allow-headers"], undefined)
    })

    it("should return no access control exposed headers", function() {
      assert.equal(this.res.headers["access-control-expose-headers"], undefined)
    })

    it("should return no access control max age", function() {
      assert.equal(this.res.headers["access-control-max-age"], undefined)
    })
  })

  describe("with specific hosts and settings", function() {
    before(async function() {
      const options = {
        origin: ["https://example.com", "http://example.org"],
        methods: ["GET", "POST", "DELETE"],
        requestHeaders: ["Content-Length"],
        responseHeaders: ["Content-Length", "Range"],
        maxAge: 150,
      }

      const {res, body} = await test.request(
        test.createStack(write(), rescue(), allowCors(options), function () {
          this.body = "ok"
          this.status = 200
        }
      ))

      this.res = res
    })

    it("should return 200", function() {
      assert.equal(this.res.statusCode, 200)
    })

    it("should return access control allowed orgins", function() {
      assert.equal(this.res.headers["access-control-allow-origin"],
        "https://example.com, http://example.org")
    })

    it("should return access control allowed methods", function() {
      assert.equal(this.res.headers["access-control-allow-methods"],
        "GET, POST, DELETE")
    })

    it("should return access control allowed headers", function() {
      assert.equal(this.res.headers["access-control-allow-headers"],
        "Content-Length")
    })

    it("should return access control exposed headers", function() {
      assert.equal(this.res.headers["access-control-expose-headers"],
        "Content-Length, Range")
    })

    it("should return access control max age", function() {
      assert.equal(this.res.headers["access-control-max-age"], "150")
    })
  })
})
