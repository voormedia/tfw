// import Context from "./context"
//
// import type {Next, Stack} from "./middleware"
//
// export default function compose(stack: Stack): Next {
//   const iterator = stack.values()
//   const
//
//   return function next() {
//     const handler = iterator.next().value
//
//     /* Check if a handler is present and valid. */
//     if (!handler) {
//       throw new NotFound("Endpoint does not exist")
//     }
//
//     if (typeof handler !== "function") {
//       throw new InternalServerError("Bad handler")
//     }
//
//     // ES7: return context::handler(next)
//     return handler.call(context, next)
//   }
// }
