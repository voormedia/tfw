import Application from "src/application"
import Logger from "src/util/logger"
import {route, write} from "src/middleware"
import {start, GET} from "src/decorate"

import http from "http"

describe("start", function() {
  before(async function() {
    const port = test.nextPort

    @start({port})
    class app {
      @GET("/")
      handle() {
        this.status = 200
        this.body += "ok"
      }
    }

    await new Promise(resolve => process.nextTick(resolve))
    const {res, body} = await test.request({port}, {path: "/"})

    this.res = res
    this.body = body
  })

  it("should run app", function() {
    assert.equal(this.body, "ok")
  })
})
