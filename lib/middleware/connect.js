"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connect;
function connect(fn) {
  return function connect(next) {
    this;

    return new Promise((resolve, reject) => {
      fn(this.request, this.response, async err => {
        if (err) {
          return reject(err);
        } else {
          try {
            await next();
            resolve();
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  };
}
/* eslint-disable no-unused-expressions */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2Nvbm5lY3QuanMiXSwibmFtZXMiOlsiY29ubmVjdCIsImZuIiwibmV4dCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFPd0JBLE87QUFBVCxTQUFTQSxPQUFULENBQWlCQyxFQUFqQixFQUFvRDtBQUNqRSxTQUFPLFNBQVNELE9BQVQsQ0FBaUJFLElBQWpCLEVBQTZCO0FBQ2pDLFFBQUQ7O0FBRUEsV0FBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3RDSixTQUFHLEtBQUtLLE9BQVIsRUFBaUIsS0FBS0MsUUFBdEIsRUFBZ0MsTUFBTUMsR0FBTixJQUFhO0FBQzNDLFlBQUlBLEdBQUosRUFBUztBQUNQLGlCQUFPSCxPQUFPRyxHQUFQLENBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJO0FBQ0Ysa0JBQU1OLE1BQU47QUFDQUU7QUFDRCxXQUhELENBR0UsT0FBT0ksR0FBUCxFQUFZO0FBQ1pILG1CQUFPRyxHQUFQO0FBQ0Q7QUFDRjtBQUNGLE9BWEQ7QUFZRCxLQWJNLENBQVA7QUFjRCxHQWpCRDtBQWtCRDtBQXpCRCIsImZpbGUiOiJjb25uZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuaW1wb3J0IHR5cGUge0NvbnRleHQsIE5leHQsIE1pZGRsZXdhcmV9IGZyb20gXCIuLi9taWRkbGV3YXJlXCJcbmltcG9ydCB0eXBlIHtSZXF1ZXN0LCBSZXNwb25zZX0gZnJvbSBcIi4uL2FwcC9jb250ZXh0XCJcblxudHlwZSBDb25uZWN0TWlkZGxld2FyZSA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IEZ1bmN0aW9uKSA9PiB2b2lkXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbm5lY3QoZm46IENvbm5lY3RNaWRkbGV3YXJlKTogTWlkZGxld2FyZSB7XG4gIHJldHVybiBmdW5jdGlvbiBjb25uZWN0KG5leHQ6IE5leHQpIHtcbiAgICAodGhpczogQ29udGV4dClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmbih0aGlzLnJlcXVlc3QsIHRoaXMucmVzcG9uc2UsIGFzeW5jIGVyciA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgbmV4dCgpXG4gICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==