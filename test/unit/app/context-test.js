import {inspect} from "util"
import Context from "src/app/context"

describe("context", function() {
  before(function() {
    this.context = new Context([], {}, {})
  })

  describe("inspect", function() {
    it("should include relevant details", function() {
      assert.typeOf(inspect(this.context), "string")
    })
  })
})
