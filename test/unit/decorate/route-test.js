import http from "http"

import {route, write} from "src/middleware"
import {mount, proxy, GET, DELETE, PATCH, POST, PUT} from "src/decorate"

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

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo", method}
        )

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

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foobar", method}
        )

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

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/bar/foo", method}
        )

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

describe("proxy", function() {
  before(async function() {
    this.methods = ["get", "delete", "patch", "post", "put"]

    this.server = http.createServer((req, res) => {
      res.writeHead(200)
      res.end(`hello from ${req.method} ${req.url}`)
    })

    this.port = await new Promise(resolve => {
      this.server.listen(0, () => {
        resolve(this.server.address().port)
      })
    })
  })

  after(async function() {
    this.server.close()
  })

  describe("with base target and exact match", function() {
    before(async function() {
      @proxy("/foo", `http://localhost:${this.port}`)
      class app {}

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo", method}
        )

        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], `hello from ${method.toUpperCase()} /foo`)
      }
    })
  })

  describe("with base target and prefix match", function() {
    before(async function() {
      @proxy("/foo", `http://localhost:${this.port}`)
      class app {}

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo/bar/baz", method}
        )

        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], `hello from ${method.toUpperCase()} /foo/bar/baz`)
      }
    })
  })

  describe("with unprepended base target and prefix match", function() {
    before(async function() {
      @proxy("/foo", `http://localhost:${this.port}`, {prepend: false})
      class app {}

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo/bar/baz", method}
        )

        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], `hello from ${method.toUpperCase()} /bar/baz`)
      }
    })
  })

  describe("with deep target and exact match", function() {
    before(async function() {
      @proxy("/foo", `http://localhost:${this.port}/foo`)
      class app {}

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo", method}
        )

        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], `hello from ${method.toUpperCase()} /foo/foo`)
      }
    })
  })

  describe("with deep target and prefix match", function() {
    before(async function() {
      @proxy("/foo", `http://localhost:${this.port}/foo`)
      class app {}

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo/bar/baz", method}
        )

        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], `hello from ${method.toUpperCase()} /foo/foo/bar/baz`)
      }
    })
  })

  describe("with unprepended deep target and prefix match", function() {
    before(async function() {
      @proxy("/foo", `http://localhost:${this.port}/foo`, {prepend: false})
      class app {}

      this.body = {}
      for (const method of this.methods) {
        const {body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo/bar/baz", method}
        )

        this.body[method] = body
      }
    })

    it("should render body for methods", function() {
      for (const method of this.methods) {
        assert.equal(this.body[method], `hello from ${method.toUpperCase()} /foo/bar/baz`)
      }
    })
  })
})
