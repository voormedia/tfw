import {write, rescue, parseBody, validateBody} from "src/middleware"

describe("validate body", function() {
  describe("with schema", function() {
    before(async function() {
      const options = {
        schema: {
          type: "object",
          properties: {
            foo: {type: "string"},
            bar: {type: "integer"},
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
        error: "invalid_request",
        message: "Request is invalid: 'foo' should be a string; request body requires key 'bar'.",
        details: [
          {path: "foo", error: "invalid_type", expected: "string"},
          {path: "bar", error: "required_field"},
        ],
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
        error: "invalid_request",
        message: "Request is invalid: request body requires keys 'foo', 'bar'.",
        details: [
          {path: "foo", error: "required_field"},
          {path: "bar", error: "required_field"},
        ],
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
            foo: {type: "string"},
            bar: {type: "integer"},
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
        error: "invalid_request",
        message: "Request is invalid."
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
        error: "invalid_request",
        message: "Request is invalid: 'foo' should be a string; 'bar' should be at least 1.",
        details: [
          {path: "foo", error: "invalid_type", expected: "string"},
          {path: "bar", error: "invalid_range", expected: {operator: ">=", limit: 1}},
        ],
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
        error: "invalid_request",
        message: "Request is invalid: request body should be an object.",
        details: [
          {error: "invalid_type", expected: "object"},
        ],
      }))
    })
  })

  describe("with insane number of errors", function() {
    before(async function() {
      const options = {
        schema: {
          type: "object",
          properties: {
            foo: { type: "string" },
          },
          required: ["foo"],
          additionalProperties: false,
        },
      }

      const data = {}
      for (let i = 0; i < 500; i++) {
        data[`k${i}`] = ""
      }

      const {res, body} = await test.request(
        test.createStack(write(), rescue(), parseBody(), validateBody(options), function() {}), {
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      )

      this.res = res
      this.body = body
    })

    it("should return error on validation failure", function() {
      assert.deepEqual(this.body.toString(), JSON.stringify({
        error: "invalid_request",
        message: "Request is invalid: too many errors, some have been omitted; request body has unknown keys 'k0', 'k1', 'k2', 'k3', 'k4', 'k5', 'k6', 'k7', 'k8', 'k9', 'k10', 'k11', 'k12', 'k13', 'k14', 'k15', 'k16', 'k17', 'k18', 'k19', 'k20', 'k21', 'k22', 'k23', 'k24', 'k25', 'k26', 'k27', 'k28', 'k29', 'k30', 'k31', 'k32', 'k33', 'k34', 'k35', 'k36', 'k37', 'k38', 'k39', 'k40', 'k41', 'k42', 'k43', 'k44', 'k45', 'k46', 'k47', 'k48', 'k49', 'k50'.",
        details: [
          {"path":"k0","error":"unknown_field"},
          {"path":"k1","error":"unknown_field"},
          {"path":"k2","error":"unknown_field"},
          {"path":"k3","error":"unknown_field"},
          {"path":"k4","error":"unknown_field"},
          {"path":"k5","error":"unknown_field"},
          {"path":"k6","error":"unknown_field"},
          {"path":"k7","error":"unknown_field"},
          {"path":"k8","error":"unknown_field"},
          {"path":"k9","error":"unknown_field"},
          {"path":"k10","error":"unknown_field"},
          {"path":"k11","error":"unknown_field"},
          {"path":"k12","error":"unknown_field"},
          {"path":"k13","error":"unknown_field"},
          {"path":"k14","error":"unknown_field"},
          {"path":"k15","error":"unknown_field"},
          {"path":"k16","error":"unknown_field"},
          {"path":"k17","error":"unknown_field"},
          {"path":"k18","error":"unknown_field"},
          {"path":"k19","error":"unknown_field"},
          {"path":"k20","error":"unknown_field"},
          {"path":"k21","error":"unknown_field"},
          {"path":"k22","error":"unknown_field"},
          {"path":"k23","error":"unknown_field"},
          {"path":"k24","error":"unknown_field"},
          {"path":"k25","error":"unknown_field"},
          {"path":"k26","error":"unknown_field"},
          {"path":"k27","error":"unknown_field"},
          {"path":"k28","error":"unknown_field"},
          {"path":"k29","error":"unknown_field"},
          {"path":"k30","error":"unknown_field"},
          {"path":"k31","error":"unknown_field"},
          {"path":"k32","error":"unknown_field"},
          {"path":"k33","error":"unknown_field"},
          {"path":"k34","error":"unknown_field"},
          {"path":"k35","error":"unknown_field"},
          {"path":"k36","error":"unknown_field"},
          {"path":"k37","error":"unknown_field"},
          {"path":"k38","error":"unknown_field"},
          {"path":"k39","error":"unknown_field"},
          {"path":"k40","error":"unknown_field"},
          {"path":"k41","error":"unknown_field"},
          {"path":"k42","error":"unknown_field"},
          {"path":"k43","error":"unknown_field"},
          {"path":"k44","error":"unknown_field"},
          {"path":"k45","error":"unknown_field"},
          {"path":"k46","error":"unknown_field"},
          {"path":"k47","error":"unknown_field"},
          {"path":"k48","error":"unknown_field"},
          {"path":"k49","error":"unknown_field"},
          {"path":"k50","error":"unknown_field"},
          {"error":"too_many_errors"},
        ],
      }))
    })
  })
})
