/* eslint-disable no-extend-native */
Object.defineProperty(Array.prototype, "values", {
  value: Array.prototype[Symbol.iterator],
})
