import timekeeper from "timekeeper"

import {write, rescue, parseSession} from "src/middleware"

describe("parse session", function() {
  before(function() {
    timekeeper.freeze(new Date(1330688329321))
  })

  // describe("with cookie", function() {
  //   before(async function() {
  //     let ctx
  //     await test.request(
  //       test.createStack(write(), rescue(), parseSession(), function() {
  //         ctx = this
  //       }), {
  //         headers: {
  //           "Cookie": "foo=bar; baz=qux"
  //         },
  //         method: "GET",
  //       }
  //     )
  //
  //     this.ctx = ctx
  //   })
  //
  //   it("should assign cookie value", function() {
  //     assert.deepEqual(this.ctx.data.cookies.get("foo"), "bar")
  //   })
  // })

  describe("without session cookie", function() {
    before(async function() {
      let session
      const keys = ["my key"]
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseSession({keys}), function() {
          session = this.data.session
        }), {
          method: "GET",
        }
      )

      this.session = session
      this.res = res
    })

    it("should not assign session value", function() {
      assert.deepEqual(this.session, {})
    })

    it("should not set session cookie", function() {
      assert.equal(this.res.headers["set-cookie"], undefined)
    })
  })

  describe("with session cookie", function() {
    before(async function() {
      let session
      const keys = ["my key"]
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseSession({keys}), function() {
          session = this.data.session
        }), {
          headers: {
            "Cookie": "sess.sig=RN-_bfr22HC3kdjfgsKC3Pqilkc; sess=eyJmb28iOiJiYXIiLCJiYXoiOiJxdXgifQ=="
          },
          method: "GET",
        }
      )

      this.session = session
      this.res = res
    })

    it("should assign session value", function() {
      assert.deepEqual(this.session, {foo: "bar", baz: "qux"})
    })

    it("should not set session cookie", function() {
      assert.equal(this.res.headers["set-cookie"], undefined)
    })
  })

  describe("with invalid session cookie", function() {
    before(async function() {
      let session
      const keys = ["my key"]
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseSession({keys}), function() {
          session = this.data.session
        }), {
          headers: {
            "Cookie": "sess.sig=t3AX-zV9S7ucKtODR5drx9p9GyA; sess=XXXXX"
          },
          method: "GET",
        }
      )

      this.session = session
      this.res = res
    })

    it("should assign blank session", function() {
      assert.deepEqual(this.session, {})
    })

    it("should clear session", function() {
      assert.equal(this.res.headers["set-cookie"][0], "sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
    })

    it("should clear session signature", function() {
      // assert.equal(this.res.headers["set-cookie"][1], "sess.sig=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
    })
  })

  describe("with invalid session signature", function() {
    before(async function() {
      let session
      const keys = ["my key"]
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseSession({keys}), function() {
          session = this.data.session
        }), {
          headers: {
            "Cookie": "sess.sig=XXXXX; sess=eyJmb28iOiJiYXIiLCJiYXoiOiJxdXgifQ=="
          },
          method: "GET",
        }
      )

      this.session = session
      this.res = res
    })

    it("should assign blank session", function() {
      assert.deepEqual(this.session, {})
    })

    it("should clear session signature", function() {
      assert.equal(this.res.headers["set-cookie"][0], "sess.sig=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
    })

    it("should clear session", function() {
      // assert.equal(this.res.headers["set-cookie"][1], "sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
    })
  })

  describe("with assigned session", function() {
    before(async function() {
      const keys = ["my key"]
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseSession({keys}), function() {
          this.data.session.foo = "bar"
          this.data.session.baz = "qux"
        }), {
          method: "GET",
        }
      )

      this.res = res
    })

    it("should set session cookie", function() {
      assert.equal(this.res.headers["set-cookie"][0], "sess=eyJmb28iOiJiYXIiLCJiYXoiOiJxdXgifQ==; path=/; expires=Thu, 31 May 2012 11:38:49 GMT; httponly")
    })

    it("should set session signature cookie", function() {
      assert.equal(this.res.headers["set-cookie"][1], "sess.sig=RN-_bfr22HC3kdjfgsKC3Pqilkc; path=/; expires=Thu, 31 May 2012 11:38:49 GMT; httponly")
    })
  })

  describe("with removed session", function() {
    before(async function() {
      let session
      const keys = ["my key"]
      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseSession({keys}), function() {
          this.data.session = null
        }), {
          headers: {
            "Cookie": "sess.sig=RN-_bfr22HC3kdjfgsKC3Pqilkc; sess=eyJmb28iOiJiYXIiLCJiYXoiOiJxdXgifQ=="
          },
          method: "GET",
        }
      )

      this.session = session
      this.res = res
    })

    it("should unset session cookie", function() {
      assert.equal(this.res.headers["set-cookie"][0], "sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
    })
  })
})
