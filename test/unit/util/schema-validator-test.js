import {createSimpleValidator} from "src/util/schema-validator"

describe("schema validator", function() {
  describe("type", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {type: ["object", "array"]},
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createSimpleValidator(this.schema)({foo: 1})
        assert.deepEqual(errors, ["'foo' should be an object"])
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
        const errors = createSimpleValidator(this.schema)({foo: {"baz": 1}})
        assert.deepEqual(errors, ["'foo' requires key 'bar'"])
      })
    })

    describe("failing multiple", function() {
      it("should report error", function() {
        const errors = createSimpleValidator(this.schema)({foo: {}})
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
        const errors = createSimpleValidator(this.schema)({foo: {"bar": 1}})
        assert.deepEqual(errors, ["'foo' has unknown key 'bar'"])
      })
    })

    describe("failing multiple", function() {
      it("should report error", function() {
        const errors = createSimpleValidator(this.schema)({foo: {"bar": 1, "baz": 2}})
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
        const errors = createSimpleValidator(this.schema)({foo: "x", "bar": "baz"})
        assert.deepEqual(errors, ["'foo' should be one of 'bar', 'baz', 'qux'"])
      })
    })

    describe("failing multiple", function() {
      it("should report error", function() {
        const errors = createSimpleValidator(this.schema)({foo: "baz", "bar": "x"})
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
        const errors = createSimpleValidator(this.schema)({foo: "//example.com/foo/bar", bar: "y"})
        assert.deepEqual(errors, ["'foo' should be formatted as url", "'bar' should be formatted as email address"])
      })

      it("should not exhaust resources", function() {
        const errors = createSimpleValidator(this.schema)({foo: "https://google-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", bar: "john+doe@foo.example.com"})
        assert.deepEqual(errors, ["'foo' should be formatted as url"])
      })
    })

    describe("succeeding", function() {
      it("should not report error", function() {
        const errors = createSimpleValidator(this.schema)({foo: "https://example.com/foo/bar", bar: "john+doe@foo.example.com"})
        assert.deepEqual(errors, [])
      })
    })
  })

  describe("format for rfc 2822 date", function() {
    before(function() {
      this.schema = {
        properties: {
          date: {format: "rfc2822-datetime"},
        },
      }
    })

    it("should report error for invalid dates", function() {
      const validate = createSimpleValidator(this.schema)

      assert.deepEqual(
        validate({date: "foo bar"}),
        ["'date' should be formatted as rfc 2822 date-time"],
      )

      assert.deepEqual(
        validate({date: "Tue. 01 Nov 2016 01:23:45 GMT"}),
        ["'date' should be formatted as rfc 2822 date-time"],
      )
    })

    it("should not report error for valid dates", function() {
      const validate = createSimpleValidator(this.schema)

      assert.deepEqual(validate({date: "Tue, 01 Nov 2016 01:23:45 UT"}), [])
      assert.deepEqual(validate({date: "Tue 01 Nov 2016 02:23:45 GMT"}), [])
      assert.deepEqual(validate({date: "Tue, 01 Nov 2016 03:23 +0000"}), [])
      assert.deepEqual(validate({date: "Tue, 01 Nov 16 04:23:45 Z"}), [])
      assert.deepEqual(validate({date: "01 Nov 2016 05:23:45 Z"}), [])
      assert.deepEqual(validate({date: "Tue, 1 Nov 2016 06:23:45 GMT"}), [])
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
        const errors = createSimpleValidator(this.schema)({foo: 0, bar: 0})
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
        const errors = createSimpleValidator(this.schema)({foo: 10, bar: 10})
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
        const errors = createSimpleValidator(this.schema)({foo: "ab"})
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
        const errors = createSimpleValidator(this.schema)({foo: "abcd"})
        assert.deepEqual(errors, ["'foo' should be at most 3 characters"])
      })
    })
  })

  describe("if then else", function() {
    before(function() {
      this.schema = {
        properties: {
          foo: {enum: ["bar", "baz"]},
          bar: {},
          baz: {},
        },
        if: {properties: {foo: {const: "bar"}}},
        then: {
          required: ["bar"],
        },
        else: {
          if: {properties: {foo: {const: "baz"}}},
          then: {
            required: ["baz"],
          },
        },
      }
    })

    describe("failing", function() {
      it("should report error", function() {
        const errors = createSimpleValidator(this.schema)({foo: "bar"})
        assert.deepEqual(errors, ["request body requires key 'bar'"])
      })
    })
  })
})
