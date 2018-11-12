import {createValidator} from "src/util/schema-validator"

describe("schema validator", function() {
  describe("type", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {type: "object"},
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: 1})
        assert.deepEqual(errors, ["'foo' should be object"])
      })
    })
  })

  describe("required", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {
            properties: {
              "bar": {type: "string"},
              "baz": {type: "number"},
            },
            required: ["bar", "baz"],
          },
        },
      }
    })

    describe("failing single", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: {"baz": 1}})
        assert.deepEqual(errors, ["'foo' requires key 'bar'"])
      })
    })

    describe("failing multiple", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: {}})
        assert.deepEqual(errors, ["'foo' requires keys 'bar', 'baz'"])
      })
    })
  })

  describe("additional properties", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {
            additionalProperties: false,
          },
        },
      }
    })

    describe("failing single", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: {"bar": 1}})
        assert.deepEqual(errors, ["'foo' has unknown key 'bar'"])
      })
    })

    describe("failing multiple", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: {"bar": 1, "baz": 2}})
        assert.deepEqual(errors, ["'foo' has unknown keys 'bar', 'baz'"])
      })
    })
  })

  describe("enum", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {enum: ["bar", "baz", "qux"]},
          bar: {enum: ["baz"]},
        },
      }
    })

    describe("failing single", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: "x", "bar": "baz"})
        assert.deepEqual(errors, ["'foo' should be one of 'bar', 'baz', 'qux'"])
      })
    })

    describe("failing multiple", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: "baz", "bar": "x"})
        assert.deepEqual(errors, ["'bar' should be 'baz'"])
      })
    })
  })

  describe("format", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {format: "url"},
          bar: {format: "email"},
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: "//example.com/foo/bar", bar: "y"})
        assert.deepEqual(errors, ["'foo' should be formatted as url", "'bar' should be formatted as email address"])
      })
    })

    describe("succeeding", function() {
      it("should not report error", function() {
        const errors = createValidator(this.schema)({foo: "https://example.com/foo/bar", bar: "john+doe@foo.example.com"})
        assert.deepEqual(errors, [])
      })
    })
  })

  describe("minimum", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {exclusiveMinimum: 1},
          bar: {minimum: 1},
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: 0, bar: 0})
        assert.deepEqual(errors, ["'foo' should be more than 1", "'bar' should be at least 1"])
      })
    })
  })

  describe("maximum", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {exclusiveMaximum: 1},
          bar: {maximum: 1},
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: 10, bar: 10})
        assert.deepEqual(errors, ["'foo' should be less than 1", "'bar' should be at most 1"])
      })
    })
  })

  describe("min length", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {minLength: 3},
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: "ab"})
        assert.deepEqual(errors, ["'foo' should be at least 3 characters"])
      })
    })
  })

  describe("max length", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {maxLength: 3},
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: "abcd"})
        assert.deepEqual(errors, ["'foo' should be at most 3 characters"])
      })
    })
  })

  describe("switch", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {enum: ["bar", "baz"]},
          bar: {},
          baz: {},
        },
        switch: [
          {
            "if": {properties: {foo: {const: "bar"}}},
            "then": {required: ["bar"]},
          },
          {
            "if": {properties: {foo: {const: "baz"}}},
            "then": {required: ["baz"]},
          },
        ],
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: "bar"})
        assert.deepEqual(errors, ["request body requires key 'bar'"])
      })
    })
  })

  describe("select", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {enum: ["bar", "baz"]},
        },
        select: {$data: "/foo"},
        selectCases: {
          bar: {
            properties: {bar: {}},
            required: ["bar"],
          },
          baz: {
            properties: {baz: {}},
            required: ["baz"],
          }
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createValidator(this.schema)({foo: "bar"})
        assert.deepEqual(errors, ["request body requires key 'bar'"])
      })
    })
  })
})
