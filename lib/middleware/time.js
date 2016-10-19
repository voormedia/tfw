// /*  */
// import type {Context, Next, Middleware} from "../middleware"
//
// export default function time(scale: number = 1e-3): Middleware {
//   return async function time(next: Next) {
//     const ctx: Context = this
//
//     let start = process.hrtime()
//     try {
//       return await next()
//     } finally {
//       let [sec, nano] = process.hrtime(start)
//       let elapsed = Math.round((sec + 1e-9 * nano) / scale)
//       ctx.data.timer = {elapsed}
//     }
//   }
// }
"use strict";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3RpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ0aW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLyogQGZsb3cgKi9cbi8vIGltcG9ydCB0eXBlIHtDb250ZXh0LCBOZXh0LCBNaWRkbGV3YXJlfSBmcm9tIFwiLi4vbWlkZGxld2FyZVwiXG4vL1xuLy8gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGltZShzY2FsZTogbnVtYmVyID0gMWUtMyk6IE1pZGRsZXdhcmUge1xuLy8gICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gdGltZShuZXh0OiBOZXh0KSB7XG4vLyAgICAgY29uc3QgY3R4OiBDb250ZXh0ID0gdGhpc1xuLy9cbi8vICAgICBsZXQgc3RhcnQgPSBwcm9jZXNzLmhydGltZSgpXG4vLyAgICAgdHJ5IHtcbi8vICAgICAgIHJldHVybiBhd2FpdCBuZXh0KClcbi8vICAgICB9IGZpbmFsbHkge1xuLy8gICAgICAgbGV0IFtzZWMsIG5hbm9dID0gcHJvY2Vzcy5ocnRpbWUoc3RhcnQpXG4vLyAgICAgICBsZXQgZWxhcHNlZCA9IE1hdGgucm91bmQoKHNlYyArIDFlLTkgKiBuYW5vKSAvIHNjYWxlKVxuLy8gICAgICAgY3R4LmRhdGEudGltZXIgPSB7ZWxhcHNlZH1cbi8vICAgICB9XG4vLyAgIH1cbi8vIH1cbiJdfQ==