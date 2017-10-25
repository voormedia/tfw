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
/* eslint-disable no-console */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taWRkbGV3YXJlL2Nvbm5lY3QuanMiXSwibmFtZXMiOlsiY29ubmVjdCIsImZuIiwibmV4dCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxdWVzdCIsInJlc3BvbnNlIiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFRd0JBLE87QUFBVCxTQUFTQSxPQUFULENBQWlCQyxFQUFqQixFQUFvRDtBQUNqRSxTQUFPLFNBQVNELE9BQVQsQ0FBaUJFLElBQWpCLEVBQTZCO0FBQ2pDLFFBQUQ7O0FBRUEsV0FBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3RDSixTQUFHLEtBQUtLLE9BQVIsRUFBaUIsS0FBS0MsUUFBdEIsRUFBZ0MsTUFBTUMsR0FBTixJQUFhO0FBQzNDLFlBQUlBLEdBQUosRUFBUztBQUNQLGlCQUFPSCxPQUFPRyxHQUFQLENBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJO0FBQ0Ysa0JBQU1OLE1BQU47QUFDQUU7QUFDRCxXQUhELENBR0UsT0FBT0ksR0FBUCxFQUFZO0FBQ1pILG1CQUFPRyxHQUFQO0FBQ0Q7QUFDRjtBQUNGLE9BWEQ7QUFZRCxLQWJNLENBQVA7QUFjRCxHQWpCRDtBQWtCRDtBQTFCRDtBQUNBIiwiZmlsZSI6ImNvbm5lY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgdHlwZSB7Q29udGV4dCwgTmV4dCwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL21pZGRsZXdhcmVcIlxuaW1wb3J0IHR5cGUge1JlcXVlc3QsIFJlc3BvbnNlfSBmcm9tIFwiLi4vYXBwL2NvbnRleHRcIlxuXG50eXBlIENvbm5lY3RNaWRkbGV3YXJlID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogRnVuY3Rpb24pID0+IHZvaWRcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29ubmVjdChmbjogQ29ubmVjdE1pZGRsZXdhcmUpOiBNaWRkbGV3YXJlIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbm5lY3QobmV4dDogTmV4dCkge1xuICAgICh0aGlzOiBDb250ZXh0KVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGZuKHRoaXMucmVxdWVzdCwgdGhpcy5yZXNwb25zZSwgYXN5bmMgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBuZXh0KClcbiAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuIl19