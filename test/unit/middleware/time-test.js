// import timekeeper from "timekeeper"
//
// import {time, write} from "src/middleware"
//
// describe("time", function() {
//   function recordTime(value) {
//     return async function (next) {
//       const hrtime = process.hrtime
//       const first = true
//
//       process.hrtime = () => {
//         if (first) {
//           first = false
//           return []
//         } else {
//           process.hrtime = hrtime
//           return value
//         }
//       }
//
//       try { await next() } catch (err) {}
//       this.body = this.data.timer.elapsed.toString()
//     }
//   }
//
//   describe("with success in microseconds", function() {
//     before(async function() {
//       const {res, body} = await test.request(
//         test.createStack(write(), recordTime([0, 123700000]), time(), () => {})
//       )
//
//       this.res = res
//       this.body = body
//     })
//
//     it("should time request", function() {
//       assert.equal(this.body, "124")
//     })
//   })
//
//   describe("with success in seconds", function() {
//     before(async function() {
//       const {res, body} = await test.request(
//         test.createStack(write(), recordTime([4, 123700000]), time(), () => {})
//       )
//
//       this.res = res
//       this.body = body
//     })
//
//     it("should time request", function() {
//       assert.equal(this.body, "4124")
//     })
//   })
//
//   describe("with failure in microseconds", function() {
//     before(async function() {
//       const {res, body} = await test.request(
//         test.createStack(write(), recordTime([0, 123700000]), time(), () => {
//           throw new Error
//         })
//       )
//
//       this.res = res
//       this.body = body
//     })
//
//     it("should time request", function() {
//       assert.equal(this.body, "124")
//     })
//   })
//
//   describe("with failure in seconds", function() {
//     before(async function() {
//       const {res, body} = await test.request(
//         test.createStack(write(), recordTime([4, 123700000]), time(), () => {
//           throw new Error
//         })
//       )
//
//       this.res = res
//       this.body = body
//     })
//
//     it("should time request", function() {
//       assert.equal(this.body, "4124")
//     })
//   })
// })
