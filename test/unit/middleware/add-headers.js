import {write, rescue, addHeaders} from "src/middleware"

describe("add headers", function () {
  before(async function () {
    const {res} = await test.request(
      test.createStack(
        write(),
        rescue(),
        addHeaders({string: "A", number: 1}),
        function () {
          this.body = "ok"
          this.status = 200
        },
      ),
    )

    this.res = res
  })

  it("should return http ok", function () {
    assert.equal(this.res.statusCode, 200)
  })

  it("should include headers", function () {
    assert.equal(this.res.headers["string"], "A")
    assert.equal(this.res.headers["number"], "1")
  })
})
