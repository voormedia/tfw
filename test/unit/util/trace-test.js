// import fs from "fs"
// import Trace from "src/util/trace"
//
// describe("trace", function() {
//   function makeTrace() {
//     const trace
//     const prepareStackTrace = Error.prepareStackTrace
//     Error.prepareStackTrace = (error, stack) => new Trace(stack)
//     try {
//       throw new Error
//     } catch (err) {
//       return err.stack
//     } finally {
//       Error.prepareStackTrace = prepareStackTrace
//     }
//   }
//
//   describe("with stack", function() {
//     before(function() {
//       this.trace = makeTrace()
//     })
//
//     it("should create trace with top", function() {
//       assert.equal(this.trace.top.toString(), "makeTrace (test/unit/util/trace-test.js:10:13)")
//     })
//   })
// })
