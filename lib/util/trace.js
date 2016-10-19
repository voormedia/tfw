// /*  */
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
"use strict";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3RyYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidHJhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAvKiBAZmxvdyAqL1xuLy8gaW1wb3J0IGZzIGZyb20gXCJmc1wiXG4vLyBpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXG4vLyBpbXBvcnQgc291cmNlTWFwIGZyb20gXCJzb3VyY2UtbWFwLXN1cHBvcnRcIlxuLy9cbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNlIHtcbi8vICAgZnJhbWVzOiBDYWxsU2l0ZVtdXG4vL1xuLy8gICBzdGF0aWMgY2FwdHVyZShzY3J1Yjogc3RyaW5nID0gXCJcIikge1xuLy8gICAgIGxldCBkZWZhdWx0UHJlcGFyZSA9IEVycm9yLnByZXBhcmVTdGFja1RyYWNlXG4vLyAgICAgbGV0IGRlZmF1bHRMaW1pdCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdFxuLy9cbi8vICAgICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSA1XG4vLyAgICAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSAoZXJyb3IsIHN0YWNrKSA9PiBzdGFja1xuLy8gICAgIGxldCBvYmogPSB7fVxuLy8gICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKG9iaiwgVHJhY2UuY2FwdHVyZSlcbi8vICAgICBsZXQge3N0YWNrfSA9IG9ialxuLy8gICAgIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZGVmYXVsdFByZXBhcmVcbi8vICAgICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSBkZWZhdWx0TGltaXRcbi8vXG4vLyAgICAgc3RhY2sgPSBzdGFjay5maWx0ZXIoZnJhbWUgPT4gZnJhbWUuZ2V0RmlsZU5hbWUoKSAhPT0gc2NydWIpXG4vLyAgICAgcmV0dXJuIG5ldyBUcmFjZShzdGFjaylcbi8vICAgfVxuLy9cbi8vICAgY29uc3RydWN0b3IoZnJhbWVzOiBDYWxsU2l0ZVtdKSB7XG4vLyAgICAgbGV0IHJvb3QgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwiLi5cIikpXG4vL1xuLy8gICAgIHRoaXMuZnJhbWVzID0gZnJhbWVzLm1hcCgoZnJhbWU6IENhbGxTaXRlKSA9PiB7XG4vLyAgICAgICBsZXQgZmlsZSA9IGZyYW1lLmdldEZpbGVOYW1lKClcbi8vICAgICAgIGlmIChmaWxlKSB7XG4vLyAgICAgICAgIGZpbGUgPSBwYXRoLnJlbGF0aXZlKHByb2Nlc3MuY3dkKCksIGZpbGUpXG4vLyAgICAgICAgIGZyYW1lID0gc291cmNlTWFwLndyYXBDYWxsU2l0ZShmcmFtZSlcbi8vICAgICAgICAgaWYgKCFmcmFtZS5pc05hdGl2ZSgpKSB7XG4vLyAgICAgICAgICAgZnJhbWUuZ2V0U2NyaXB0TmFtZU9yU291cmNlVVJMID0gZnJhbWUuZ2V0RmlsZU5hbWUgPSAoKSA9PiBmaWxlXG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiBmcmFtZVxuLy8gICAgIH0pXG4vL1xuLy8gICAgIE9iamVjdC5mcmVlemUodGhpcylcbi8vICAgfVxuLy9cbi8vICAgZ2V0IHRvcCgpOiBDYWxsU2l0ZSB7XG4vLyAgICAgcmV0dXJuIHRoaXMuZ2V0KDApXG4vLyAgIH1cbi8vXG4vLyAgIGdldChpbmRleDogbnVtYmVyKSB7XG4vLyAgICAgcmV0dXJuIHRoaXMuZnJhbWVzW2luZGV4XVxuLy8gICB9XG4vLyB9XG4iXX0=