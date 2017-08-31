import Context from "src/app/context"

describe("context", function() {
  before(function() {
    this.context = new Context([], {}, {})
  })

  describe("inspect", function() {
    it("should include relevant details", function() {
      assert.equal(JSON.stringify(this.context.inspect()),
        '{"stack":[],"data":{},"req":"<node req>","res":"<node res>"}')
    })
  })
})
