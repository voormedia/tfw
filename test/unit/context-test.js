import Context from "src/context"

describe("context", function() {
  before(function() {
    this.context = new Context(null, [], {}, {})
  })

  describe("inspect", function() {
    it("should include relevant details", function() {
      assert.equal(JSON.stringify(this.context.inspect()),
        '{"stack":[],"data":{},"app":"<app>","req":"<node req>","res":"<node res>"}')
    })
  })
})
