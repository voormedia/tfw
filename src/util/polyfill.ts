Object.defineProperty(Array.prototype, "values", {
  value: Array.prototype[Symbol.iterator],
})
