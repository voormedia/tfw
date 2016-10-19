// /* @flow */
// import fs from "fs"
// import path from "path"
// import sourceMap from "source-map-support"
//
// export default class Trace {
//   frames: CallSite[]
//
//   static capture(scrub: string = "") {
//     let defaultPrepare = Error.prepareStackTrace
//     let defaultLimit = Error.stackTraceLimit
//
//     Error.stackTraceLimit = 5
//     Error.prepareStackTrace = (error, stack) => stack
//     let obj = {}
//     Error.captureStackTrace(obj, Trace.capture)
//     let {stack} = obj
//     Error.prepareStackTrace = defaultPrepare
//     Error.stackTraceLimit = defaultLimit
//
//     stack = stack.filter(frame => frame.getFileName() !== scrub)
//     return new Trace(stack)
//   }
//
//   constructor(frames: CallSite[]) {
//     let root = path.normalize(path.join(__dirname, "..", ".."))
//
//     this.frames = frames.map((frame: CallSite) => {
//       let file = frame.getFileName()
//       if (file) {
//         file = path.relative(process.cwd(), file)
//         frame = sourceMap.wrapCallSite(frame)
//         if (!frame.isNative()) {
//           frame.getScriptNameOrSourceURL = frame.getFileName = () => file
//         }
//       }
//       return frame
//     })
//
//     Object.freeze(this)
//   }
//
//   get top(): CallSite {
//     return this.get(0)
//   }
//
//   get(index: number) {
//     return this.frames[index]
//   }
// }
