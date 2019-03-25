import Router from "lib/router"

describe("router", function() {
  describe("define", function() {
    it("should add root", function() {
      const router = new Router
      router.define("get", "/", {})

      assert.sameDeepMembers(router.routes.map(route => route.toString()), [
        "GET /",
      ])
    })

    it("should add routes", function() {
      const router = new Router
      router.define("get", "foo/bar", {})
      router.define("get", "foo/baz", {})
      router.define("get", "foo/qux", {})

      assert.sameDeepMembers(router.routes.map(route => route.toString()), [
        "GET /foo/bar",
        "GET /foo/baz",
        "GET /foo/qux",
      ])
    })

    it("should add routes with leading slash", function() {
      const router = new Router
      router.define("get", "/foo/bar", {})
      router.define("get", "/foo/baz", {})
      router.define("get", "/foo/qux", {})

      assert.sameDeepMembers(router.routes.map(route => route.toString()), [
        "GET /foo/bar",
        "GET /foo/baz",
        "GET /foo/qux",
      ])
    })

    it("should add routes with param", function() {
      const router = new Router
      router.define("get", "foo/{id}", {})
      router.define("get", "foo/{id}/qux", {})

      assert.sameDeepMembers(router.routes.map(route => route.toString()), [
        "GET /foo/{id}",
        "GET /foo/{id}/qux",
      ])
    })

    it("should complain about duplicate routes", function() {
      const router = new Router
      router.define("get", "foo/bar", {})

      assert.throws(() => {
        router.define("get", "foo/bar", {})
      }, "Route 'GET /foo/bar' already exists")
    })

    it("should complain about duplicate params", function() {
      const router = new Router

      assert.throws(() => {
        router.define("get", "foo/{id}/bar/{id}", {})
      }, "Pattern 'foo/{id}/bar/{id}' has duplicate param {id}")
    })

    it("should complain about conflicting params", function() {
      const router = new Router

      router.define("get", "foo/{id}", {})
      assert.throws(() => {
        router.define("get", "foo/{name}/baz", {})
      }, "Route 'GET /foo/{name}/baz' redefines existing parameter {id} as {name}")
    })
  })

  describe("mount", function() {
    it("should mount other router", function() {
      const router2 = new Router
      router2.define("get", "/", {})
      router2.define("get", "/baz", {})
      router2.define("get", "/qux", {})

      const router1 = new Router
      router1.define("get", "/foo/bar", {})
      router1.mount("/foo", router2)

      assert.sameDeepMembers(router1.routes.map(route => route.toString()), [
        "GET /foo",
        "GET /foo/bar",
        "GET /foo/baz",
        "GET /foo/qux",
      ])
    })

    it("should complain about duplicate routes", function() {
      const router2 = new Router
      router2.define("get", "/bar", {})
      router2.define("get", "/qux", {})

      const router1 = new Router
      router1.define("get", "/foo/bar", {})

      assert.throws(() => {
        router1.mount("/foo", router2)
      }, "Route 'GET /foo/bar' already exists")
    })
  })

  describe("match", function() {
    it("should find root", function() {
      const router = new Router
      router.define("get", "/", 1)

      const {handler} = router.match("get", "/")
      assert.equal(handler, 1)
    })

    it("should find route", function() {
      const router = new Router
      router.define("get", "foo/bar", 1)
      router.define("get", "foo/baz", 2)
      router.define("get", "foo/qux", 3)
      router.define("get", "foo/bazaar", 4)

      const {handler} = router.match("get", "/foo/baz")
      assert.equal(handler, 2)
    })

    it("should find mounted route", function() {
      const router2 = new Router
      router2.define("get", "/bar", 1)
      router2.define("get", "/qux", 2)

      const router1 = new Router
      router1.mount("/foo", router2)

      const {handler} = router1.match("get", "/foo/bar")
      assert.equal(handler, 1)
    })

    it("should find route with param", function() {
      const router = new Router
      router.define("get", "foo/bar", 1)
      router.define("get", "foo/{id}", 2)

      const {handler, params} = router.match("get", "/foo/baz")
      assert.equal(handler, 2)
      assert.deepEqual(params, {id: "baz"})
    })

    it("should find route with multiple params", function() {
      const router = new Router
      router.define("get", "foo/bar/baz", 1)
      router.define("get", "foo/{foo_id}/bar/{bar_id}/baz/{baz_id}", 2)

      const {handler, params} = router.match("get", "/foo/foo/bar/bar/baz/baz")
      assert.equal(handler, 2)
      assert.deepEqual(params, {foo_id: "foo", bar_id: "bar", baz_id: "baz"})
    })

    it("should find route ignoring query strings", function() {
      const router = new Router
      router.define("get", "foo/bar", 1)
      router.define("get", "foo/{id}", 2)

      const {handler, params} = router.match("get", "/foo/baz?qux=quux")
      assert.equal(handler, 2)
      assert.deepEqual(params, {id: "baz"})
    })

    it("should not find partial route", function() {
      const router = new Router
      router.define("get", "foo/bar", 1)
      router.define("get", "foo/baz", 2)
      router.define("get", "foo/qux", 3)
      router.define("get", "foo/bazaar", 4)

      assert.deepEqual(router.match("get", "/foo"), {})
    })

    it("should not find missing route", function() {
      const router = new Router
      router.define("get", "foo/bar", 1)
      router.define("get", "foo/baz", 2)
      router.define("get", "foo/qux", 3)
      router.define("get", "foo/bazaar", 4)

      assert.deepEqual(router.match("get", "/foo/bazaa"), {})
    })

    it("should not find route with missing method", function() {
      const router = new Router
      router.define("get", "foo/bar", 1)
      router.define("get", "foo/baz", 2)

      assert.deepEqual(router.match("post", "/foo/baz"), {})
    })
  })

  describe("routes", function() {
    it("should return routes", function() {
      const router = new Router
      router.define("get", "foo/bar", {})
      router.define("delete", "foo/baz", {})
      router.define("patch", "foo/qux", {})

      assert.deepEqual(router.routes.map(route => route.toString()), [
        "PATCH /foo/qux",
        "DELETE /foo/baz",
        "GET /foo/bar",
      ])
    })
  })

  describe("handlers", function() {
    it("should return handlers", function() {
      const router = new Router
      router.define("get", "foo/bar", 1)
      router.define("delete", "foo/baz", 2)
      router.define("patch", "foo/qux", 3)

      assert.deepEqual(router.handlers, [3, 2, 1])
    })
  })

  describe("inspect", function() {
    it("should list routes", function() {
      const router = new Router
      router.define("get", "foo/bar", {})
      router.define("delete", "foo/baz", {})
      router.define("patch", "foo/qux", {})

      assert.equal(router.inspect(), [
        "[ PATCH /foo/qux,",
        "  DELETE /foo/baz,",
        "  GET /foo/bar ]",
      ].join("\n"))
    })
  })
})
