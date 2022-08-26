import {inspect} from "util"
import Context from "src/app/context"

describe("context", function() {
  before(function() {
    this.context = new Context([], {}, {})
  })

  describe("trace id", function() {
    it("should return request id if present", function() {
      this.context = new Context([], {
        headers: {
          "x-request-id": "f0000000000000000000000000000000",
          "x-cloud-trace-context": "a0000000000000000000000000000000/12345;o=1",
        },
      }, {})

      assert.equal(this.context.traceId, "f0000000000000000000000000000000")
    })

    it("should return trace id if present and request id is absent", function() {
      this.context = new Context([], {
        headers: {
          "x-cloud-trace-context": "a0000000000000000000000000000000/12345;o=1",
        },
      }, {})

      assert.equal(this.context.traceId, "a0000000000000000000000000000000")
    })

    it("should generate and store id if absent", function() {
      const id = this.context.traceId
      assert.match(id, /^[0-9a-f]{32}$/)
      assert.equal(this.context.traceId, id)
    })
  })

  describe("inspect", function() {
    it("should include relevant details", function() {
      assert.typeOf(inspect(this.context), "string")
    })
  })
})
