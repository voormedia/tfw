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
"use strict";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb3NlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb21wb3NlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IENvbnRleHQgZnJvbSBcIi4vY29udGV4dFwiXG4vL1xuLy8gaW1wb3J0IHR5cGUge05leHQsIFN0YWNrfSBmcm9tIFwiLi9taWRkbGV3YXJlXCJcbi8vXG4vLyBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wb3NlKHN0YWNrOiBTdGFjayk6IE5leHQge1xuLy8gICBjb25zdCBpdGVyYXRvciA9IHN0YWNrLnZhbHVlcygpXG4vLyAgIGNvbnN0XG4vL1xuLy8gICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbi8vICAgICBjb25zdCBoYW5kbGVyID0gaXRlcmF0b3IubmV4dCgpLnZhbHVlXG4vL1xuLy8gICAgIC8qIENoZWNrIGlmIGEgaGFuZGxlciBpcyBwcmVzZW50IGFuZCB2YWxpZC4gKi9cbi8vICAgICBpZiAoIWhhbmRsZXIpIHtcbi8vICAgICAgIHRocm93IG5ldyBOb3RGb3VuZChcIkVuZHBvaW50IGRvZXMgbm90IGV4aXN0XCIpXG4vLyAgICAgfVxuLy9cbi8vICAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09IFwiZnVuY3Rpb25cIikge1xuLy8gICAgICAgdGhyb3cgbmV3IEludGVybmFsU2VydmVyRXJyb3IoXCJCYWQgaGFuZGxlclwiKVxuLy8gICAgIH1cbi8vXG4vLyAgICAgLy8gRVM3OiByZXR1cm4gY29udGV4dDo6aGFuZGxlcihuZXh0KVxuLy8gICAgIHJldHVybiBoYW5kbGVyLmNhbGwoY29udGV4dCwgbmV4dClcbi8vICAgfVxuLy8gfVxuIl19