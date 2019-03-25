import Application from "lib/application"
import Logger from "lib/util/logger"
import {route, write} from "lib/middleware"
import {start, GET} from "lib/decorate"

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

    this.app = app

    await new Promise(resolve => process.nextTick(resolve))
    const {res, body} = await test.request({port}, {path: "/"})

    this.res = res
    this.body = body
  })

  it("should run app", function() {
    assert.equal(this.body.toString(), "ok")
  })

  it("should assign app instance", function() {
    assert.equal(this.app.instance.constructor, Application)
  })
})
