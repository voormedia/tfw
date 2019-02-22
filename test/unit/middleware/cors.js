import {write, rescue, cors} from "src/middleware"

const methods = [
  "OPTIONS",
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]

describe("cors", function() {
  methods.forEach((method) => {
    describe(`with ${method} request`, function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), rescue(), cors(), function () {
            this.body = "ok"
            this.status = 200
          }, {
            method,
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

      it("should return access control allowed headers", function() {
        assert.equal(this.res.headers["access-control-allow-headers"],
          "DNT, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Range")
      })

      it("should return access control exposed headers", function() {
        assert.equal(this.res.headers["access-control-expose-headers"],
          "Content-Length, Content-Range")
      })
    })
  })
})
