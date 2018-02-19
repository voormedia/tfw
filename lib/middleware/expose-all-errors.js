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
      if (!err.toJSON) {
        err.toJSON = toJSON;
      }

      err.expose = true;
      throw err;
    }
  };
}

const { error } = new _errors.InternalServerError();
function toJSON() {
  this;

  /* TODO: Include stack? {stack: this.stack.split(/\n\s+/)} */
  return { error, message: this.message };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2V4cG9zZS1hbGwtZXJyb3JzLmpzIl0sIm5hbWVzIjpbImV4cG9zZUFsbEVycm9ycyIsIm5leHQiLCJlcnIiLCJ0b0pTT04iLCJleHBvc2UiLCJlcnJvciIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU13QkEsZTs7QUFGeEI7O0FBSEE7QUFLZSxTQUFTQSxlQUFULEdBQXVDO0FBQ3BELFNBQU8sZUFBZUEsZUFBZixDQUErQkMsSUFBL0IsRUFBMkM7QUFDL0MsUUFBRDs7QUFFQSxRQUFJO0FBQ0YsWUFBTUEsTUFBTjtBQUNELEtBRkQsQ0FFRSxPQUFPQyxHQUFQLEVBQVk7QUFDWixVQUFJLENBQUNBLElBQUlDLE1BQVQsRUFBaUI7QUFDZkQsWUFBSUMsTUFBSixHQUFhQSxNQUFiO0FBQ0Q7O0FBRURELFVBQUlFLE1BQUosR0FBYSxJQUFiO0FBQ0EsWUFBTUYsR0FBTjtBQUNEO0FBQ0YsR0FiRDtBQWNEOztBQUVELE1BQU0sRUFBQ0csS0FBRCxLQUFVLGlDQUFoQjtBQUNBLFNBQVNGLE1BQVQsR0FBa0I7QUFDZixNQUFEOztBQUVBO0FBQ0EsU0FBTyxFQUFDRSxLQUFELEVBQVFDLFNBQVMsS0FBS0EsT0FBdEIsRUFBUDtBQUNEIiwiZmlsZSI6ImV4cG9zZS1hbGwtZXJyb3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuaW1wb3J0IHtJbnRlcm5hbFNlcnZlckVycm9yfSBmcm9tIFwiLi4vZXJyb3JzXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXhwb3NlQWxsRXJyb3JzKCk6IE1pZGRsZXdhcmUge1xuICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gZXhwb3NlQWxsRXJyb3JzKG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICghZXJyLnRvSlNPTikge1xuICAgICAgICBlcnIudG9KU09OID0gdG9KU09OXG4gICAgICB9XG5cbiAgICAgIGVyci5leHBvc2UgPSB0cnVlXG4gICAgICB0aHJvdyBlcnJcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qge2Vycm9yfSA9IG5ldyBJbnRlcm5hbFNlcnZlckVycm9yKClcbmZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgKHRoaXM6IEVycm9yKVxuXG4gIC8qIFRPRE86IEluY2x1ZGUgc3RhY2s/IHtzdGFjazogdGhpcy5zdGFjay5zcGxpdCgvXFxuXFxzKy8pfSAqL1xuICByZXR1cm4ge2Vycm9yLCBtZXNzYWdlOiB0aGlzLm1lc3NhZ2V9XG59XG4iXX0=