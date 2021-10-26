import {write, rescue, bufferBody} from "src/middleware"

describe("buffer body", function() {
  describe("with body", function() {
    before(async function() {
      let ctx
      await test.request(
        test.createStack(write(), rescue(), bufferBody(), function() {
          ctx = this
        }), {
          method: "POST",
          body: 'hello'
        }
      )

      this.ctx = ctx
    })

    it("should assign body as buffer", function() {
      assert.deepEqual(this.ctx.data.body, Buffer.from("hello"))
    })
  })

  describe("without body", function() {
    before(async function() {
      let ctx
      await test.request(
        test.createStack(write(), rescue(), bufferBody(), function() {
          ctx = this
        }), {
          method: "POST",
        }
      )

      this.ctx = ctx
    })

    it("should have undefined body", function() {
      assert.equal(this.ctx.data.body, undefined)
    })
  })
})
