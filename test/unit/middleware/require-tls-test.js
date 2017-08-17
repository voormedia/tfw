import {write, requireTLS} from "src/middleware"

describe("require tls", function() {
  describe("over https", function() {
    describe("without proxy", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireTLS(), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
            fakeEncrypted: true,
          }
        )

        this.res = res
        this.body = body
      })

      it("should render body", function() {
        assert.equal(this.body, "ok")
      })

      it("should return status", function() {
        assert.equal(this.res.statusCode, 201)
      })
    })

    describe("with proxy", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireTLS(), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
            headers: {
              "x-forwarded-proto": "https"
            },
          }
        )

        this.res = res
        this.body = body
      })

      it("should render body", function() {
        assert.equal(this.body, "ok")
      })

      it("should return status", function() {
        assert.equal(this.res.statusCode, 201)
      })
    })
  })

  describe("over http", function() {
    describe("without proxy", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireTLS(), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
          }
        )

        this.res = res
        this.body = body
      })

      it("should render body", function() {
        assert.equal(this.body, '{"error":"Forbidden","message":"TLS required"}')
      })

      it("should return http forbidden", function() {
        assert.equal(this.res.statusCode, 403)
      })
    })

    describe("without proxy", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireTLS(), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
            headers: {
              "x-forwarded-proto": "http"
            },
          }
        )

        this.res = res
        this.body = body
      })

      it("should render body", function() {
        assert.equal(this.body, '{"error":"Forbidden","message":"TLS required"}')
      })

      it("should return http forbidden", function() {
        assert.equal(this.res.statusCode, 403)
      })
    })
  })
})
