import timekeeper from "timekeeper"
import sleep from "lib/util/sleep"

describe("sleep", function() {
  it("should sleep", async function() {
    timekeeper.reset()
    const start = new Date().getTime()
    await sleep(10)
    assert.isAtLeast(new Date().getTime() - start, 10)
  })
})
