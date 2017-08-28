import {route, write} from "src/middleware"
import {resource} from "src/decorate"

describe("resource", function() {
  describe("with plural", function() {
    before(function() {
      this.paths = [
        ["GET", "/"],
        ["GET", "/foo"],
        ["POST", "/"],
        ["PUT", "/"],
        ["PATCH", "/foo"],
        ["DELETE", "/foo"],
      ]
    })

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

      this.res = {}
      this.body = {}
      for (const [method, path] of this.paths) {
        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path, method}
        )

        this.res[[method, path]] = res
        this.body[[method, path]] = body
      }
    })

    it("should register used methods", function() {
      assert.sameMembers(
        this.routes.handlers.map(fn => fn.name),
        ["index", "show", "create", "update", "destroy"]
      )
    })

    it("should render body for resources", function() {
      for (const [method, path] of this.paths) {
        assert.equal(this.body[[method, path]].toString(), "")
      }
    })
  })

  describe("with singular", function() {
    before(function() {
      this.paths = [
        ["GET", "/"],
        ["POST", "/"],
        ["PUT", "/"],
        ["PATCH", "/"],
        ["DELETE", "/"],
      ]
    })

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

      this.res = {}
      this.body = {}
      for (const [method, path] of this.paths) {
        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path, method}
        )

        this.res[[method, path]] = res
        this.body[[method, path]] = body
      }
    })

    it("should register used methods", function() {
      assert.sameMembers(
        this.routes.handlers.map(fn => fn.name),
        ["show", "create", "update", "destroy"]
      )
    })

    it("should render body for resources", function() {
      for (const [method, path] of this.paths) {
        assert.equal(this.body[[method, path]].toString(), "")
      }
    })
  })
})
