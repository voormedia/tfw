import net from "net"
import http from "http"

import {write, requireHost} from "src/middleware"

describe("require host", function() {
  describe("without allowed hosts", function() {
    describe("with any host", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireHost(), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
            headers: {host: "example.com"},
          }
        )

        this.res = res
        this.body = body
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Not found","message":"Endpoint does not exist"}')
      })

      it("should return http not found", function() {
        assert.equal(this.res.statusCode, 404)
      })
    })
  })

  describe("with single allowed host", function() {
    describe("without host", function() {
      before(async function() {
        const app = test.createStack(write(), requireHost(), function() {
          this.body = "ok"
          this.status = 201
        })

        const body = await new Promise((resolve, reject) => {
          const server = app.dispatch ? http.createServer(::app.dispatch).listen(app.port) : null

          const options = {port: app.port}
          const body = []
          const socket = net.connect(options)
          socket.on("error", reject)
          socket.on("data", ::body.push)
          socket.on("end", () => {
            if (server) server.close()
            resolve(Buffer.concat(body))
          })
          socket.end("POST /foo/bar HTTP/1.0\r\n\r\n")
        })

        this.body = body
      })

      it("should render error", function() {
        assert.equal(this.body.toString().split("\r\n\r\n")[1], '{"error":"Not found","message":"Endpoint does not exist"}')
      })

      it("should return http not found", function() {
        assert.equal(this.body.toString().split("\r\n")[0], "HTTP/1.1 404 Not Found")
      })
    })

    describe("with good host", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireHost("example.com"), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
            headers: {host: "example.com"},
          }
        )

        this.res = res
        this.body = body
      })

      it("should render body", function() {
        assert.equal(this.body, "ok")
      })

      it("should return http created", function() {
        assert.equal(this.res.statusCode, 201)
      })
    })

    describe("with bad host", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireHost("example.com"), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
            headers: {host: "example.org"},
          }
        )

        this.res = res
        this.body = body
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Not found","message":"Endpoint does not exist"}')
      })

      it("should return http forbidden", function() {
        assert.equal(this.res.statusCode, 404)
      })
    })
  })

  describe("with multiple allowed hosts", function() {
    describe("without host", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireHost(), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
          }
        )

        this.res = res
        this.body = body
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Not found","message":"Endpoint does not exist"}')
      })

      it("should return http not found", function() {
        assert.equal(this.res.statusCode, 404)
      })
    })

    describe("with good host", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireHost("example.net", "example.com"), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
            headers: {host: "example.com"},
          }
        )

        this.res = res
        this.body = body
      })

      it("should render body", function() {
        assert.equal(this.body, "ok")
      })

      it("should return http created", function() {
        assert.equal(this.res.statusCode, 201)
      })
    })

    describe("with bad host", function() {
      before(async function() {
        const {res, body} = await test.request(
          test.createStack(write(), requireHost("example.net", "example.com"), function() {
            this.body = "ok"
            this.status = 201
          }), {
            method: "POST",
            path: "/foo/bar?baz=qux",
            body: "foobar",
            headers: {host: "example.org"},
          }
        )

        this.res = res
        this.body = body
      })

      it("should render error", function() {
        assert.equal(this.body, '{"error":"Not found","message":"Endpoint does not exist"}')
      })

      it("should return http forbidden", function() {
        assert.equal(this.res.statusCode, 404)
      })
    })
  })
})
