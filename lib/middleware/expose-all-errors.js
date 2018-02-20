"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exposeAllErrors;

var _errors = require("../errors");

/* eslint-disable no-unused-expressions */
function exposeAllErrors() {
  return async function exposeAllErrors(next) {
    this;

    try {
      await next();
    } catch (err) {
      if (err instanceof Error) {
        /* Add specific JSON serialization to the error and make it exposable. */
        if (!err.toJSON) err.toJSON = toJSON;
        err.expose = true;
        throw err;
      } else {
        /* Wrap anything that's not an Error but that pretends to be one. */
        throw new _errors.InternalServerError(err.message || err.Message || err);
      }
    }
  };
}

const { error } = new _errors.InternalServerError();
function toJSON() {
  this;

  /* TODO: Include stack? {stack: this.stack.split(/\n\s+/)} */
  return { error, message: this.message };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2V4cG9zZS1hbGwtZXJyb3JzLmpzIl0sIm5hbWVzIjpbImV4cG9zZUFsbEVycm9ycyIsIm5leHQiLCJlcnIiLCJFcnJvciIsInRvSlNPTiIsImV4cG9zZSIsIm1lc3NhZ2UiLCJNZXNzYWdlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU13QkEsZTs7QUFGeEI7O0FBSEE7QUFLZSxTQUFTQSxlQUFULEdBQXVDO0FBQ3BELFNBQU8sZUFBZUEsZUFBZixDQUErQkMsSUFBL0IsRUFBMkM7QUFDL0MsUUFBRDs7QUFFQSxRQUFJO0FBQ0YsWUFBTUEsTUFBTjtBQUNELEtBRkQsQ0FFRSxPQUFPQyxHQUFQLEVBQVk7QUFDWixVQUFJQSxlQUFlQyxLQUFuQixFQUEwQjtBQUN4QjtBQUNBLFlBQUksQ0FBQ0QsSUFBSUUsTUFBVCxFQUFpQkYsSUFBSUUsTUFBSixHQUFhQSxNQUFiO0FBQ2pCRixZQUFJRyxNQUFKLEdBQWEsSUFBYjtBQUNBLGNBQU1ILEdBQU47QUFDRCxPQUxELE1BS087QUFDTDtBQUNBLGNBQU0sZ0NBQXdCQSxJQUFJSSxPQUFKLElBQWVKLElBQUlLLE9BQW5CLElBQThCTCxHQUF0RCxDQUFOO0FBQ0Q7QUFDRjtBQUNGLEdBaEJEO0FBaUJEOztBQUVELE1BQU0sRUFBQ00sS0FBRCxLQUFVLGlDQUFoQjtBQUNBLFNBQVNKLE1BQVQsR0FBa0I7QUFDZixNQUFEOztBQUVBO0FBQ0EsU0FBTyxFQUFDSSxLQUFELEVBQVFGLFNBQVMsS0FBS0EsT0FBdEIsRUFBUDtBQUNEIiwiZmlsZSI6ImV4cG9zZS1hbGwtZXJyb3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuaW1wb3J0IHtJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXhwb3NlQWxsRXJyb3JzKCk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gZXhwb3NlQWxsRXJyb3JzKG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAvKiBBZGQgc3BlY2lmaWMgSlNPTiBzZXJpYWxpemF0aW9uIHRvIHRoZSBlcnJvciBhbmQgbWFrZSBpdCBleHBvc2FibGUuICovXG4gICAgICAgIGlmICghZXJyLnRvSlNPTikgZXJyLnRvSlNPTiA9IHRvSlNPTlxuICAgICAgICBlcnIuZXhwb3NlID0gdHJ1ZVxuICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIFdyYXAgYW55dGhpbmcgdGhhdCdzIG5vdCBhbiBFcnJvciBidXQgdGhhdCBwcmV0ZW5kcyB0byBiZSBvbmUuICovXG4gICAgICAgIHRocm93IG5ldyBJbnRlcm5hbFNlcnZlckVycm9yKGVyci5tZXNzYWdlIHx8IGVyci5NZXNzYWdlIHx8IGVycilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3Qge2Vycm9yfSA9IG5ldyBJbnRlcm5hbFNlcnZlckVycm9yKClcbmZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgKHRoaXM6IEVycm9yKVxuXG4gIC8qIFRPRE86IEluY2x1ZGUgc3RhY2s/IHtzdGFjazogdGhpcy5zdGFjay5zcGxpdCgvXFxuXFxzKy8pfSAqL1xuICByZXR1cm4ge2Vycm9yLCBtZXNzYWdlOiB0aGlzLm1lc3NhZ2V9XG59XG4iXX0=