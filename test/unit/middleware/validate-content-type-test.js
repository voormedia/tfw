import {write, validateContentType} from "src/middleware"

describe("validate content type", function() {
  describe("without body", function() {
    describe("with correct content type", function() {
      before(async function() {
        let ctx
        const {res, body} = await test.request(
          test.createStack(write(), validateContentType("foo/bar"), function() {}), {
            method: "GET",
            headers: {
              "Content-Type": "foo/bar; charset=utf-8"
            },
          }
        )

        this.res = res
        this.body = body
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })
    })

    describe("without content type", function() {
      before(async function() {
        let ctx
        const {res, body} = await test.request(
          test.createStack(write(), validateContentType("foo/bar"), function() {}), {
            method: "GET",
          }
        )

        this.res = res
        this.body = body
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })
    })

    describe("with incorrect content type", function() {
      before(async function() {
        let ctx
        const {res, body} = await test.request(
          test.createStack(write(), validateContentType("foo/bar"), function() {}), {
            method: "GET",
            headers: {
              "Content-Type": "foo/qux; charset=utf-8"
            },
          }
        )

        this.res = res
        this.body = body
      })

      it("should return http ok", function() {
        /* This is a workaround for broken HTTP clients that send a content type
           even though there is no body. Previously we'd accept such requests. */
        assert.equal(this.res.statusCode, 200)
      })
    })
  })

  describe("with body", function() {
    describe("with correct content type", function() {
      before(async function() {
        let ctx
        const {res, body} = await test.request(
          test.createStack(write(), validateContentType("foo/bar"), function() {}), {
            method: "POST",
            body: "foobar",
            headers: {
              "Content-Type": "foo/bar; charset=utf-8"
            },
          }
        )

        this.res = res
        this.body = body
      })

      it("should return http ok", function() {
        assert.equal(this.res.statusCode, 200)
      })
    })

    describe("without content type", function() {
      before(async function() {
        let ctx
        const {res, body} = await test.request(
          test.createStack(write(), validateContentType("foo/bar"), function() {}), {
            method: "POST",
            body: "foobar",
          }
        )

        this.res = res
        this.body = body
      })

      it("should render error", function() {
        assert.deepEqual(this.body.toString(), JSON.stringify({
          error: "Unsupported media type",
          message: "Please use foo/bar content type"
        }))
      })

      it("should return http unsupported media type", function() {
        assert.equal(this.res.statusCode, 415)
      })
    })

    describe("with incorrect content type", function() {
      before(async function() {
        let ctx
        const {res, body} = await test.request(
          test.createStack(write(), validateContentType("foo/bar"), function() {}), {
            method: "POST",
            body: "foobar",
            headers: {
              "Content-Type": "foo/qux; charset=utf-8"
            },
          }
        )

        this.res = res
        this.body = body
      })

      it("should render error", function() {
        assert.deepEqual(this.body.toString(), JSON.stringify({
          error: "Unsupported media type",
          message: "Please use foo/bar content type"
        }))
      })

      it("should return http unsupported media type", function() {
        assert.equal(this.res.statusCode, 415)
      })
    })
  })
})
