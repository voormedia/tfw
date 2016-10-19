import {route, write} from "src/middleware"
import {resource} from "src/decorate"

describe("resource", function() {
  describe("with plural", function() {
    before(async function() {
      @resource()
      class app {
        index() {}
        show() {}
        create() {}
        update() {}
        destroy() {}
      }

      this.routes = app.prototype.router
    })

    it("should render body for resources", function() {
      assert.sameMembers(
        this.routes.handlers.map(fn => fn.name),
        ["index", "show", "create", "update", "destroy"]
      )
    })
  })

  describe("with singular", function() {
    before(async function() {
      @resource({singular: true})
      class app {
        index() {}
        show() {}
        create() {}
        update() {}
        destroy() {}
      }

      this.routes = app.prototype.router
    })

    it("should render body for methods", function() {
      assert.sameMembers(
        this.routes.handlers.map(fn => fn.name),
        ["show", "create", "update", "destroy"]
      )
    })
  })
})
