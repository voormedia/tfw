import {write, rescue, parseBody, validateBody} from "src/middleware"

describe("validate body", function() {
  describe("with schema", function() {
    before(async function() {
      const options = {
        schema: {
          type: "object",
          properties: {
            foo: { type: "string" },
            bar: { type: "integer" },
          },
          required: ["foo", "bar"],
        },
      }


      this.app = test.createStack(
        write(),
        rescue(),
        parseBody(),
        validateBody(options),
        function() {},
      )
    })

    it("should return error on validation failure", async function() {
      const {res, body} = await test.request(this.app, {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        method: "POST",
        body: '{"foo": 2}',
      })

      assert.deepEqual(body.toString(), JSON.stringify({
        error: "Bad request",
        message: "Request is invalid: 'foo' should be string; request body requires key 'bar'"
      }))
    })

    it("should return error if body is missing", async function() {
      const {res, body} = await test.request(this.app, {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        method: "POST",
      })

      assert.deepEqual(body.toString(), JSON.stringify({
        error: "Bad request",
        message: "Request is invalid: request body requires keys 'foo', 'bar'"
      }))
    })
  })

  describe("with schema without details", function() {
    before(async function() {
      const options = {
        details: false,
        schema: {
          type: "object",
          properties: {
            foo: { type: "string" },
            bar: { type: "integer" },
          },
          required: ["foo", "bar"],
        },
      }

      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseBody(), validateBody(options), function() {}), {
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          method: "POST",
          body: '{"foo": 2}'
        }
      )

      this.res = res
      this.body = body
    })

    it("should return error on validation failure", function() {
      assert.deepEqual(this.body.toString(), JSON.stringify({
        error: "Bad request",
        message: "Request is invalid"
      }))
    })
  })

  describe("with optional schema", function() {
    before(async function() {
      const options = {
        optional: true,
        schema: {
          type: "object",
          properties: {
            foo: { type: "string" },
            bar: { type: "integer", minimum: 1 },
          },
          required: ["foo", "bar"],
        },
      }

      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseBody(), validateBody(options), function() {}), {
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          method: "POST",
          body: '{"foo": 2, "bar": 0}'
        }
      )

      this.res = res
      this.body = body
    })

    it("should return error on validation failure", function() {
      assert.deepEqual(this.body.toString(), JSON.stringify({
        error: "Bad request",
        message: "Request is invalid: 'foo' should be string; 'bar' should be at least 1"
      }))
    })
  })

  describe("with optional schema and null body", function() {
    before(async function() {
      const options = {
        optional: true,
        schema: {
          type: "object",
          properties: {
            foo: { type: "string" },
            bar: { type: "integer", minimum: 1 },
          },
          required: ["foo", "bar"],
        },
      }

      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseBody(), validateBody(options), function() {}), {
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          method: "POST",
          body: 'null'
        }
      )

      this.res = res
      this.body = body
    })

    it("should return error on validation failure", function() {
      assert.deepEqual(this.body.toString(), JSON.stringify({
        error: "Bad request",
        message: "Request is invalid: request body should be object"
      }))
    })
  })
})
