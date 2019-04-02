import {route, write} from "src/middleware"
import {use, mount, GET} from "src/decorate"

describe("use", function() {
  describe("single", function() {
    describe("with handler", function() {
      before(async function() {
        function middleware(next) {
          this.body += "middleware "
          return next()
        }

        class app {
          @GET("/foo")
          @use(middleware)
          handle() {
            this.body += "ok"
          }
        }

        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo"}
        )

        this.res = res
        this.body = body
      })

      it("should call middleware", function() {
        assert.equal(this.body.toString(), "middleware ok")
      })
    })

    describe("with router", function() {
      before(async function() {
        function middleware(next) {
          this.body += "middleware "
          return next()
        }

        class mounted {
          @GET("/foo")
          handle() {
            this.body += "ok"
          }
        }

        @use(middleware)
        @mount("/sub", mounted)
        class app {
          @GET("/foo")
          handle() {
            this.body += "ok"
          }
        }

        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/sub/foo"}
        )

        this.res = res
        this.body = body
      })

      it("should call middleware", function() {
        assert.equal(this.body.toString(), "middleware ok")
      })
    })
  })

  describe("multiple", function() {
    describe("with handler", function() {
      before(async function() {
        function middleware1(next) {
          this.body += "middleware1 "
          return next()
        }

        function middleware2(next) {
          this.body += "middleware2 "
          return next()
        }

        class app {
          @GET("/foo")
          @use(middleware1, middleware2)
          handle() {
            this.body += "ok"
          }
        }

        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/foo"}
        )

        this.res = res
        this.body = body
      })

      it("should call middleware", function() {
        assert.equal(this.body.toString(), "middleware1 middleware2 ok")
      })
    })

    describe("with router", function() {
      before(async function() {
        function middleware1(next) {
          this.body += "middleware1 "
          return next()
        }

        function middleware2(next) {
          this.body += "middleware2 "
          return next()
        }

        class mounted {
          @GET("/foo")
          handle() {
            this.body += "ok"
          }
        }

        @use(middleware1, middleware2)
        @mount("/sub", mounted)
        class app {
          @GET("/foo")
          handle() {
            this.body += "ok"
          }
        }

        const {res, body} = await test.request(
          test.createStack(write(), route(app.prototype.router)),
          {path: "/sub/foo"}
        )

        this.res = res
        this.body = body
      })

      it("should call middleware", function() {
        assert.equal(this.body.toString(), "middleware1 middleware2 ok")
      })
    })
  })

  describe("with bad handler", function() {
    it("should throw error if argument is not a function", function() {
      assert.throws(() => use(3), "Middleware must be function")
    })

    it("should throw error if function takes bad number of arguments", function() {
      assert.throws(() => use(() => {}), "Middleware must take exactly 1 argument")
    })
  })
})
