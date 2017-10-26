"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseQuery;

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseQuery() {
  return function parseQuery(next) {
    this;

    const search = this.url.split("?", 2)[1];
    const params = _querystring2.default.parse(search);

    if (this.data.params) {
      Object.assign(this.data.params, params);
    } else {
      this.data.params = params;
    }

    return next();
  };
}
/* eslint-disable no-unused-expressions */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL3BhcnNlLXF1ZXJ5LmpzIl0sIm5hbWVzIjpbInBhcnNlUXVlcnkiLCJuZXh0Iiwic2VhcmNoIiwidXJsIiwic3BsaXQiLCJwYXJhbXMiLCJwYXJzZSIsImRhdGEiLCJPYmplY3QiLCJhc3NpZ24iXSwibWFwcGluZ3MiOiI7Ozs7O2tCQU13QkEsVTs7QUFKeEI7Ozs7OztBQUllLFNBQVNBLFVBQVQsR0FBa0M7QUFDL0MsU0FBTyxTQUFTQSxVQUFULENBQW9CQyxJQUFwQixFQUFnQztBQUNwQyxRQUFEOztBQUVBLFVBQU1DLFNBQVMsS0FBS0MsR0FBTCxDQUFTQyxLQUFULENBQWUsR0FBZixFQUFvQixDQUFwQixFQUF1QixDQUF2QixDQUFmO0FBQ0EsVUFBTUMsU0FBUyxzQkFBWUMsS0FBWixDQUFrQkosTUFBbEIsQ0FBZjs7QUFFQSxRQUFJLEtBQUtLLElBQUwsQ0FBVUYsTUFBZCxFQUFzQjtBQUNwQkcsYUFBT0MsTUFBUCxDQUFjLEtBQUtGLElBQUwsQ0FBVUYsTUFBeEIsRUFBZ0NBLE1BQWhDO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS0UsSUFBTCxDQUFVRixNQUFWLEdBQW1CQSxNQUFuQjtBQUNEOztBQUVELFdBQU9KLE1BQVA7QUFDRCxHQWJEO0FBY0Q7QUFwQkQiLCJmaWxlIjoicGFyc2UtcXVlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG5pbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSBcInF1ZXJ5c3RyaW5nXCJcblxuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VRdWVyeSgpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHBhcnNlUXVlcnkobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgY29uc3Qgc2VhcmNoID0gdGhpcy51cmwuc3BsaXQoXCI/XCIsIDIpWzFdXG4gICAgY29uc3QgcGFyYW1zID0gcXVlcnlzdHJpbmcucGFyc2Uoc2VhcmNoKVxuXG4gICAgaWYgKHRoaXMuZGF0YS5wYXJhbXMpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5kYXRhLnBhcmFtcywgcGFyYW1zKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGEucGFyYW1zID0gcGFyYW1zXG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQoKVxuICB9XG59XG4iXX0=