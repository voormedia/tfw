"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _node = require("./node");

var _node2 = _interopRequireDefault(_node);

var _route = require("./route");

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Tree = class Tree {

  constructor() {
    this.root = new _node2.default();

    Object.freeze(this);
  }

  match(parts) {
    /* Create object without prototype. */
    const params = Object.create(null);

    let node = this.root;
    for (const part of parts) {
      node = node.find(part);
      if (!node) break;
      if (node.pattern) params[node.name] = part;
    }

    if (!node || !node.leaf) return {};
    return { node, params };
  }

  insert(route) {
    let node = this.root;
    for (const part of route.parts) {
      node = node.insert(part.clone());
      if (node.name !== part.name) {
        throw new _route.RouteError(route, `redefines existing parameter {${node.name}} as {${part.name}}`);
      }
    }

    return node;
  }

  *traverse() {
    const stack = [[this.root]];

    while (stack.length) {
      const path = stack.pop();
      const node = path[path.length - 1];

      const children = [...Array.from(node.children.values()), ...Array.from(node.patterns.values())];

      for (const node of children) {
        stack.push(path.concat([node]));
      }

      if (node.leaf) yield [node, path.slice(1)];
    }
  }
};
exports.default = Tree;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXIvdHJlZS5qcyJdLCJuYW1lcyI6WyJUcmVlIiwiY29uc3RydWN0b3IiLCJyb290IiwiTm9kZSIsIk9iamVjdCIsImZyZWV6ZSIsIm1hdGNoIiwicGFydHMiLCJwYXJhbXMiLCJjcmVhdGUiLCJub2RlIiwicGFydCIsImZpbmQiLCJwYXR0ZXJuIiwibmFtZSIsImxlYWYiLCJpbnNlcnQiLCJyb3V0ZSIsImNsb25lIiwiUm91dGVFcnJvciIsInRyYXZlcnNlIiwic3RhY2siLCJsZW5ndGgiLCJwYXRoIiwicG9wIiwiY2hpbGRyZW4iLCJBcnJheSIsImZyb20iLCJ2YWx1ZXMiLCJwYXR0ZXJucyIsInB1c2giLCJjb25jYXQiLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVxQkEsSSxHQUFOLE1BQU1BLElBQU4sQ0FBVzs7QUFHeEJDLGdCQUFjO0FBQUEsU0FGZEMsSUFFYyxHQUZELElBQUlDLGNBQUosRUFFQzs7QUFDWkMsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFREMsUUFBTUMsS0FBTixFQUF1RDtBQUNyRDtBQUNBLFVBQU1DLFNBQVNKLE9BQU9LLE1BQVAsQ0FBYyxJQUFkLENBQWY7O0FBRUEsUUFBSUMsT0FBTyxLQUFLUixJQUFoQjtBQUNBLFNBQUssTUFBTVMsSUFBWCxJQUFtQkosS0FBbkIsRUFBMEI7QUFDeEJHLGFBQU9BLEtBQUtFLElBQUwsQ0FBVUQsSUFBVixDQUFQO0FBQ0EsVUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDWCxVQUFJQSxLQUFLRyxPQUFULEVBQWtCTCxPQUFPRSxLQUFLSSxJQUFaLElBQW9CSCxJQUFwQjtBQUNuQjs7QUFFRCxRQUFJLENBQUNELElBQUQsSUFBUyxDQUFDQSxLQUFLSyxJQUFuQixFQUF5QixPQUFPLEVBQVA7QUFDekIsV0FBTyxFQUFDTCxJQUFELEVBQU9GLE1BQVAsRUFBUDtBQUNEOztBQUVEUSxTQUFPQyxLQUFQLEVBQTJCO0FBQ3pCLFFBQUlQLE9BQU8sS0FBS1IsSUFBaEI7QUFDQSxTQUFLLE1BQU1TLElBQVgsSUFBbUJNLE1BQU1WLEtBQXpCLEVBQWdDO0FBQzlCRyxhQUFPQSxLQUFLTSxNQUFMLENBQVlMLEtBQUtPLEtBQUwsRUFBWixDQUFQO0FBQ0EsVUFBSVIsS0FBS0ksSUFBTCxLQUFjSCxLQUFLRyxJQUF2QixFQUE2QjtBQUMzQixjQUFNLElBQUlLLGlCQUFKLENBQWVGLEtBQWYsRUFBdUIsaUNBQWdDUCxLQUFLSSxJQUFLLFNBQVFILEtBQUtHLElBQUssR0FBbkYsQ0FBTjtBQUNEO0FBQ0Y7O0FBRUQsV0FBT0osSUFBUDtBQUNEOztBQUVELEdBQUNVLFFBQUQsR0FBc0M7QUFDcEMsVUFBTUMsUUFBUSxDQUFDLENBQUMsS0FBS25CLElBQU4sQ0FBRCxDQUFkOztBQUVBLFdBQU9tQixNQUFNQyxNQUFiLEVBQXFCO0FBQ25CLFlBQU1DLE9BQU9GLE1BQU1HLEdBQU4sRUFBYjtBQUNBLFlBQU1kLE9BQU9hLEtBQUtBLEtBQUtELE1BQUwsR0FBYyxDQUFuQixDQUFiOztBQUVBLFlBQU1HLFdBQVcsQ0FDZixHQUFHQyxNQUFNQyxJQUFOLENBQVdqQixLQUFLZSxRQUFMLENBQWNHLE1BQWQsRUFBWCxDQURZLEVBRWYsR0FBR0YsTUFBTUMsSUFBTixDQUFXakIsS0FBS21CLFFBQUwsQ0FBY0QsTUFBZCxFQUFYLENBRlksQ0FBakI7O0FBS0EsV0FBSyxNQUFNbEIsSUFBWCxJQUFtQmUsUUFBbkIsRUFBNkI7QUFDM0JKLGNBQU1TLElBQU4sQ0FBV1AsS0FBS1EsTUFBTCxDQUFZLENBQUNyQixJQUFELENBQVosQ0FBWDtBQUNEOztBQUVELFVBQUlBLEtBQUtLLElBQVQsRUFBZSxNQUFNLENBQUNMLElBQUQsRUFBT2EsS0FBS1MsS0FBTCxDQUFXLENBQVgsQ0FBUCxDQUFOO0FBQ2hCO0FBQ0Y7QUFwRHVCLEM7a0JBQUxoQyxJIiwiZmlsZSI6InRyZWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZVwiXG5pbXBvcnQgUm91dGUsIHtSb3V0ZUVycm9yfSBmcm9tIFwiLi9yb3V0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyZWUge1xuICByb290OiBOb2RlID0gbmV3IE5vZGVcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG4gIH1cblxuICBtYXRjaChwYXJ0czogc3RyaW5nW10pOiB7bm9kZT86IE5vZGUsIHBhcmFtcz86IE9iamVjdH0ge1xuICAgIC8qIENyZWF0ZSBvYmplY3Qgd2l0aG91dCBwcm90b3R5cGUuICovXG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICAgbGV0IG5vZGUgPSB0aGlzLnJvb3RcbiAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgIG5vZGUgPSBub2RlLmZpbmQocGFydClcbiAgICAgIGlmICghbm9kZSkgYnJlYWtcbiAgICAgIGlmIChub2RlLnBhdHRlcm4pIHBhcmFtc1tub2RlLm5hbWVdID0gcGFydFxuICAgIH1cblxuICAgIGlmICghbm9kZSB8fCAhbm9kZS5sZWFmKSByZXR1cm4ge31cbiAgICByZXR1cm4ge25vZGUsIHBhcmFtc31cbiAgfVxuXG4gIGluc2VydChyb3V0ZTogUm91dGUpOiBOb2RlIHtcbiAgICBsZXQgbm9kZSA9IHRoaXMucm9vdFxuICAgIGZvciAoY29uc3QgcGFydCBvZiByb3V0ZS5wYXJ0cykge1xuICAgICAgbm9kZSA9IG5vZGUuaW5zZXJ0KHBhcnQuY2xvbmUoKSlcbiAgICAgIGlmIChub2RlLm5hbWUgIT09IHBhcnQubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgUm91dGVFcnJvcihyb3V0ZSwgYHJlZGVmaW5lcyBleGlzdGluZyBwYXJhbWV0ZXIgeyR7bm9kZS5uYW1lfX0gYXMgeyR7cGFydC5uYW1lfX1gKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICAqdHJhdmVyc2UoKTogSXRlcmFibGU8W05vZGUsIE5vZGVbXV0+IHtcbiAgICBjb25zdCBzdGFjayA9IFtbdGhpcy5yb290XV1cblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhdGggPSBzdGFjay5wb3AoKVxuICAgICAgY29uc3Qgbm9kZSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXVxuXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgICAgLi4uQXJyYXkuZnJvbShub2RlLmNoaWxkcmVuLnZhbHVlcygpKSxcbiAgICAgICAgLi4uQXJyYXkuZnJvbShub2RlLnBhdHRlcm5zLnZhbHVlcygpKSxcbiAgICAgIF1cblxuICAgICAgZm9yIChjb25zdCBub2RlIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgIHN0YWNrLnB1c2gocGF0aC5jb25jYXQoW25vZGVdKSlcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUubGVhZikgeWllbGQgW25vZGUsIHBhdGguc2xpY2UoMSldXG4gICAgfVxuICB9XG59XG4iXX0=