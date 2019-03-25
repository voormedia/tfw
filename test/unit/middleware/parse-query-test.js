import Router from "src/router"
import {write, rescue, route, parseQuery} from "src/middleware"

describe("parse query", function() {
  describe("with router", function() {
    const router = new Router
    router.define("GET", "/foo/{id}", function() {
      this.body = "handler"
    })

    describe("without search query", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), route(router), parseQuery(), function() {
            ctx = this
          }), {
            path: "/foo/bar"
          }
        )

        this.ctx = ctx
      })

      it("should assign params", function() {
        assert.deepEqual(this.ctx.data.params, {id: "bar"})
      })
    })

    describe("with empty search query", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), route(router), parseQuery(), function() {
            ctx = this
          }), {
            path: "/foo/bar?"
          }
        )

        this.ctx = ctx
      })

      it("should assign params", function() {
        assert.deepEqual(this.ctx.data.params, {id: "bar"})
      })
    })

    describe("with search query", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), route(router), parseQuery(), function() {
            ctx = this
          }), {
            path: "/foo/bar?foo=bar&baz=qux&id=quux"
          }
        )

        this.ctx = ctx
      })

      it("should assign params", function() {
        /* Query string takes precendence for now. We might want to change that! */
        assert.deepEqual(this.ctx.data.params, {foo: "bar", baz: "qux", id: "quux"})
      })
    })
  })

  describe("without router", function() {
    describe("without search query", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), parseQuery(), function() {
            ctx = this
          }), {
            path: "/foo/bar"
          }
        )

        this.ctx = ctx
      })

      it("should assign params", function() {
        assert.deepEqual(this.ctx.data.params, {})
      })
    })

    describe("with empty search query", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), parseQuery(), function() {
            ctx = this
          }), {
            path: "/foo/bar?"
          }
        )

        this.ctx = ctx
      })

      it("should assign params", function() {
        assert.deepEqual(this.ctx.data.params, {})
      })
    })

    describe("with search query", function() {
      before(async function() {
        let ctx
        await test.request(
          test.createStack(write(), rescue(), parseQuery(), function() {
            ctx = this
          }), {
            path: "/foo/bar?foo=bar&baz=qux"
          }
        )

        this.ctx = ctx
      })

      it("should assign params", function() {
        assert.deepEqual(this.ctx.data.params, {foo: "bar", baz: "qux"})
      })
    })
  })
})
