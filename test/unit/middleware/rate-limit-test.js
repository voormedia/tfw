import {write, rescue, rateLimit} from "src/middleware"

describe("rate limit", function() {
  describe("when ok", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(
          write(),
          rescue(),
          rateLimit({consume: () => true, message: "No soup for you!"}),
          function() {exec = true},
        )
      )

      this.res = res
      this.body = body
      this.exec = exec
    })

    it("should render body", function() {
      assert.equal(this.body.toString(), '')
    })

    it("should execute handler", function() {
      assert.equal(this.exec, true)
    })
  })

  describe("when not ok", function() {
    before(async function() {
      let exec = false
      const {res, body} = await test.request(
        test.createStack(
          write(),
          rescue(),
          rateLimit({consume: () => false, message: "No soup for you!"}),
          function() {exec = true},
        )
      )

      this.res = res
      this.body = body
      this.exec = exec
    })

    it("should render error", function() {
      assert.equal(this.body.toString(), '{"error":"too_many_requests","message":"No soup for you!"}')
    })

    it("should return http bad request", function() {
      assert.equal(this.res.statusCode, 429)
    })

    it("should not execute handler", function() {
      assert.equal(this.exec, false)
    })
  })
})
