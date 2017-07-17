"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
let Timer = class Timer {

  constructor(time) {
    this.time = time;
  }

  sleep() {
    return new Promise(resolve => {
      this.timer = setTimeout(resolve, this.time);
    });
  }

  clear() {
    clearTimeout(this.timer);
  }
};
exports.default = Timer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3RpbWVyLmpzIl0sIm5hbWVzIjpbIlRpbWVyIiwiY29uc3RydWN0b3IiLCJ0aW1lIiwic2xlZXAiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRpbWVyIiwic2V0VGltZW91dCIsImNsZWFyIiwiY2xlYXJUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7OztJQUNxQkEsSyxHQUFOLE1BQU1BLEtBQU4sQ0FBWTs7QUFJekJDLGNBQVlDLElBQVosRUFBMEI7QUFDeEIsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7O0FBRURDLFVBQVE7QUFDTixXQUFPLElBQUlDLE9BQUosQ0FBWUMsV0FBVztBQUM1QixXQUFLQyxLQUFMLEdBQWFDLFdBQVdGLE9BQVgsRUFBb0IsS0FBS0gsSUFBekIsQ0FBYjtBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVETSxVQUFRO0FBQ05DLGlCQUFhLEtBQUtILEtBQWxCO0FBQ0Q7QUFoQndCLEM7a0JBQU5OLEsiLCJmaWxlIjoidGltZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZXIge1xuICB0aW1lOiBudW1iZXJcbiAgdGltZXI6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKHRpbWU6IG51bWJlcikge1xuICAgIHRoaXMudGltZSA9IHRpbWVcbiAgfVxuXG4gIHNsZWVwKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMudGltZSlcbiAgICB9KVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG4gIH1cbn1cbiJdfQ==