import {write, rescue, allowCors} from "lib/middleware"

const methods = [
  "OPTIONS",
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]

describe("allow cors", function() {
  describe("with defaults", function() {
    describe("with regular request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), allowCors(), function () {
            this.body = "ok"
            this.status = 200
          })
        )

        this.res = res
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should return vary", function() {
        assert.equal(this.res.headers["vary"], "Origin")
      })

      it("should return no access control allowed orgins", function() {
        assert.equal(this.res.headers["access-control-allow-origin"], undefined)
      })

      it("should return no access control allowed methods", function() {
        assert.equal(this.res.headers["access-control-allow-methods"], undefined)
      })

      it("should return no access control allowed headers", function() {
        assert.equal(this.res.headers["access-control-allow-headers"], undefined)
      })

      it("should return no access control exposed headers", function() {
        assert.equal(this.res.headers["access-control-expose-headers"], undefined)
      })

      it("should return no access control allow credentials header", function() {
        assert.equal(this.res.headers["access-control-allow-credentials"], undefined)
      })

      it("should return no access control max age", function() {
        assert.equal(this.res.headers["access-control-max-age"], undefined)
      })
    })

    describe("with cors request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), allowCors(), function () {
            this.body = "ok"
            this.status = 200
          }), {
            headers: {
              Origin: "https://example.com",
            }
          }
        )

        this.res = res
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should return vary", function() {
        assert.equal(this.res.headers["vary"], "Origin")
      })

      it("should return access control allowed orgins", function() {
        assert.equal(this.res.headers["access-control-allow-origin"], "*")
      })

      it("should return access control allowed methods", function() {
        assert.equal(this.res.headers["access-control-allow-methods"],
          "GET, POST, PUT, PATCH, DELETE")
      })

      it("should return no access control allowed headers", function() {
        assert.equal(this.res.headers["access-control-allow-headers"], undefined)
      })

      it("should return no access control exposed headers", function() {
        assert.equal(this.res.headers["access-control-expose-headers"], undefined)
      })

      it("should return no access control allow credentials header", function() {
        assert.equal(this.res.headers["access-control-allow-credentials"], undefined)
      })

      it("should return no access control max age", function() {
        assert.equal(this.res.headers["access-control-max-age"], undefined)
      })
    })

    describe("with preflight request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), allowCors(), function () {
            throw new Error("oops")
          }), {
            method: "OPTIONS",
            headers: {
              "Origin": "https://example.com",
              "Access-Control-Request-Method": "POST",
            }
          }
        )

        this.res = res
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should return access control allowed orgins", function() {
        assert.equal(this.res.headers["access-control-allow-origin"], "*")
      })

      it("should return access control allowed methods", function() {
        assert.equal(this.res.headers["access-control-allow-methods"],
          "GET, POST, PUT, PATCH, DELETE")
      })

      it("should return no access control allowed headers", function() {
        assert.equal(this.res.headers["access-control-allow-headers"], undefined)
      })

      it("should return no access control exposed headers", function() {
        assert.equal(this.res.headers["access-control-expose-headers"], undefined)
      })

      it("should return no access control allow credentials header", function() {
        assert.equal(this.res.headers["access-control-allow-credentials"], undefined)
      })

      it("should return no access control max age", function() {
        assert.equal(this.res.headers["access-control-max-age"], undefined)
      })
    })
  })

  describe("with specific hosts and settings", function() {
    const options = {
      origins: ["https://example.com", "http://example.org"],
      methods: ["GET", "POST", "DELETE"],
      requestHeaders: ["Content-Length"],
      responseHeaders: ["Content-Length", "Range"],
      allowCredentials: true,
      maxAge: 150,
    }

    describe("with regular request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), allowCors(options), function () {
            this.body = "ok"
            this.status = 200
          })
        )

        this.res = res
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should return vary", function() {
        assert.equal(this.res.headers["vary"], "Origin")
      })

      it("should return no access control allowed orgins", function() {
        assert.equal(this.res.headers["access-control-allow-origin"], undefined)
      })

      it("should return no access control allowed methods", function() {
        assert.equal(this.res.headers["access-control-allow-methods"], undefined)
      })

      it("should return no access control allowed headers", function() {
        assert.equal(this.res.headers["access-control-allow-headers"], undefined)
      })

      it("should return no access control exposed headers", function() {
        assert.equal(this.res.headers["access-control-expose-headers"], undefined)
      })

      it("should return no access control allow credentials header", function() {
        assert.equal(this.res.headers["access-control-allow-credentials"], undefined)
      })

      it("should return no access control max age", function() {
        assert.equal(this.res.headers["access-control-max-age"], undefined)
      })
    })

    describe("with allowed cors request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), allowCors(options), function () {
            this.body = "ok"
            this.status = 200
          }), {
            headers: {
              Origin: "https://example.com",
            }
          }
        )

        this.res = res
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should return vary", function() {
        assert.equal(this.res.headers["vary"], "Origin")
      })

      it("should return access control allowed orgin", function() {
        assert.equal(this.res.headers["access-control-allow-origin"],
          "https://example.com")
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

      it("should return access control allow credentials header", function() {
        assert.equal(this.res.headers["access-control-allow-credentials"], "true")
      })

      it("should return access control max age", function() {
        assert.equal(this.res.headers["access-control-max-age"], "150")
      })
    })

    describe("with allowed preflight request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), allowCors(options), function () {
            throw new Error("oops")
          }), {
            method: "OPTIONS",
            headers: {
              "Origin": "https://example.com",
              "Access-Control-Request-Method": "POST",
            }
          }
        )

        this.res = res
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })

      it("should return access control allowed orgins", function() {
        assert.equal(this.res.headers["access-control-allow-origin"],
          "https://example.com")
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

      it("should return access control allow credentials header", function() {
        assert.equal(this.res.headers["access-control-allow-credentials"], "true")
      })

      it("should return access control max age", function() {
        assert.equal(this.res.headers["access-control-max-age"], "150")
      })
    })

    describe("with disallowed cors request", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), allowCors(options), function () {
            this.body = "ok"
            this.status = 200
          }), {
            headers: {
              Origin: "https://example.net",
            }
          }
        )

        this.res = res
      })

      it("should return http forbidden", function() {
        assert.equal(this.res.statusCode, 403)
      })

      it("should return vary", function() {
        assert.equal(this.res.headers["vary"], "Origin")
      })

      it("should return no access control allowed orgins", function() {
        assert.equal(this.res.headers["access-control-allow-origin"], undefined)
      })

      it("should return no access control allowed methods", function() {
        assert.equal(this.res.headers["access-control-allow-methods"], undefined)
      })

      it("should return no access control allowed headers", function() {
        assert.equal(this.res.headers["access-control-allow-headers"], undefined)
      })

      it("should return no access control exposed headers", function() {
        assert.equal(this.res.headers["access-control-expose-headers"], undefined)
      })

      it("should return no access control allow credentials header", function() {
        assert.equal(this.res.headers["access-control-allow-credentials"], undefined)
      })

      it("should return access control max age", function() {
        assert.equal(this.res.headers["access-control-max-age"], undefined)
      })
    })
  })
})
