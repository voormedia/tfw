import {route, write} from "src/middleware"
import {mount, GET, DELETE, PATCH, POST, PUT} from "src/decorate"

describe("route", function() {
  before(function() {
    this.methods = ["get", "delete", "patch", "post", "put"]
  })

  describe("with handler", function() {
    before(async function() {
      class app {
        @GET("/foo")
        @DELETE("/foo")
        @PATCH("/foo")
        @POST("/foo")
        @PUT("/foo")
        handle() {
          this.body = this.method
        }
      }

      this.res = {}
      this.body = {}
      for (const method of this.methods) {
        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo", method}
        )

        this.res[method] = res
        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], method.toUpperCase())
      }
    })
  })

  describe("with param handler", function() {
    before(async function() {
      class app {
        @GET("/{id}")
        @DELETE("/{id}")
        @PATCH("/{id}")
        @POST("/{id}")
        @PUT("/{id}")
        handle() {
          this.body = `${this.method} ${this.data.params.id}`
        }
      }

      this.res = {}
      this.body = {}
      for (const method of this.methods) {
        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foobar", method}
        )

        this.res[method] = res
        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], method.toUpperCase() + " foobar")
      }
    })
  })
})

describe("mount", function() {
  before(function() {
    this.methods = ["get", "delete", "patch", "post", "put"]
  })

  describe("with handler", function() {
    before(async function() {
      class controller1 {
        @GET("/foo")
        @DELETE("/foo")
        @PATCH("/foo")
        handle() {
          this.body = this.method
        }
      }

      class controller2 {
        @POST("/foo")
        @PUT("/foo")
        handle() {
          this.body = this.method
        }
      }

      @mount("/bar", controller1)
      @mount("/bar", controller2)
      class app {}

      this.res = {}
      this.body = {}
      for (const method of this.methods) {
        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/bar/foo", method}
        )

        this.res[method] = res
        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], method.toUpperCase())
      }
    })
  })
})
