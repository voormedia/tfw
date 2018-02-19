import Router from "src/router"
import {route, write} from "src/middleware"

describe("route", function() {
  describe("without handler", function() {
    before(async function() {
      const {res, body} = await test.request(
        test.createStack(write(), route(new Router), function() {
          this.body = "next"
        })
      )

      this.res = res
      this.body = body
    })

    it("should call next handler", function() {
      assert.equal(this.body.toString(), "next")
    })
  })

  describe("with get handler", function() {
    describe("with get request", function() {
      before(async function() {
        const router = new Router
        router.define("GET", "/foo/bar", function() {
          this.body = "handler"
        })

        const {res, body} = await test.request(
          test.createStack(write(), route(router)),
          {path: "/foo/bar"}
        )

        this.res = res
        this.body = body
      })

      it("should render body", function() {
        assert.equal(this.body.toString(), "handler")
      })

      it("should return status", function() {
        assert.equal(this.res.statusCode, 200)
      })
    })

    describe("with head request", function() {
      before(async function() {
        const router = new Router
        router.define("GET", "/foo/bar", function() {
          this.body = "handler"
        })

        const {res, body} = await test.request(
          test.createStack(write(), route(router)),
          {path: "/foo/bar", method: "HEAD"}
        )

        this.res = res
        this.body = body
      })

      it("should not render body", function() {
        assert.equal(this.body.toString(), "")
      })

      it("should return status", function() {
        assert.equal(this.res.statusCode, 200)
      })
    })
  })

  describe("with stacked get handler", function() {
    before(async function() {
      const router = new Router

      function wrap1(next) {
        this.body += "wrap1 "
        next()
      }

      function wrap2(next) {
        this.body += "wrap2 "
        next()
      }

      function handler() {
        this.body += "handler"
      }

      Object.defineProperty(handler, "stack", {value: [wrap1, wrap2]})
      router.define("GET", "/foo/bar", handler)

      const {res, body} = await test.request(
        test.createStack(write(), route(router)),
        {path: "/foo/bar"}
      )

      this.res = res
      this.body = body
    })

    it("should render body", function() {
      assert.equal(this.body.toString(), "wrap1 wrap2 handler")
    })

    it("should return status", function() {
      assert.equal(this.res.statusCode, 200)
    })
  })
})
