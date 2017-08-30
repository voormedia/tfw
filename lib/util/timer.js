"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
let Timer = exports.Timer = class Timer {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3RpbWVyLmpzIl0sIm5hbWVzIjpbIlRpbWVyIiwiY29uc3RydWN0b3IiLCJ0aW1lIiwic2xlZXAiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRpbWVyIiwic2V0VGltZW91dCIsImNsZWFyIiwiY2xlYXJUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7OztJQUNhQSxLLFdBQUFBLEssR0FBTixNQUFNQSxLQUFOLENBQVk7O0FBSWpCQyxjQUFZQyxJQUFaLEVBQTBCO0FBQ3hCLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNEOztBQUVEQyxVQUFRO0FBQ04sV0FBTyxJQUFJQyxPQUFKLENBQVlDLFdBQVc7QUFDNUIsV0FBS0MsS0FBTCxHQUFhQyxXQUFXRixPQUFYLEVBQW9CLEtBQUtILElBQXpCLENBQWI7QUFDRCxLQUZNLENBQVA7QUFHRDs7QUFFRE0sVUFBUTtBQUNOQyxpQkFBYSxLQUFLSCxLQUFsQjtBQUNEO0FBaEJnQixDO2tCQW1CSk4sSyIsImZpbGUiOiJ0aW1lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5leHBvcnQgY2xhc3MgVGltZXIge1xuICB0aW1lOiBudW1iZXJcbiAgdGltZXI6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKHRpbWU6IG51bWJlcikge1xuICAgIHRoaXMudGltZSA9IHRpbWVcbiAgfVxuXG4gIHNsZWVwKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMudGltZSlcbiAgICB9KVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZXJcbiJdfQ==