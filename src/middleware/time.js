// /* @flow */
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
