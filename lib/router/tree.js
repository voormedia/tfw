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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXIvdHJlZS5qcyJdLCJuYW1lcyI6WyJUcmVlIiwiY29uc3RydWN0b3IiLCJyb290IiwiT2JqZWN0IiwiZnJlZXplIiwibWF0Y2giLCJwYXJ0cyIsInBhcmFtcyIsImNyZWF0ZSIsIm5vZGUiLCJwYXJ0IiwiZmluZCIsInBhdHRlcm4iLCJuYW1lIiwibGVhZiIsImluc2VydCIsInJvdXRlIiwiY2xvbmUiLCJ0cmF2ZXJzZSIsInN0YWNrIiwibGVuZ3RoIiwicGF0aCIsInBvcCIsImNoaWxkcmVuIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwicGF0dGVybnMiLCJwdXNoIiwiY29uY2F0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFcUJBLEksR0FBTixNQUFNQSxJQUFOLENBQVc7O0FBR3hCQyxnQkFBYztBQUFBLFNBRmRDLElBRWMsR0FGRCxvQkFFQzs7QUFDWkMsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFREMsUUFBTUMsS0FBTixFQUF1RDtBQUNyRCxVQUFNQyxTQUFTSixPQUFPSyxNQUFQLENBQWMsSUFBZCxDQUFmOztBQUVBLFFBQUlDLE9BQU8sS0FBS1AsSUFBaEI7QUFDQSxTQUFLLE1BQU1RLElBQVgsSUFBbUJKLEtBQW5CLEVBQTBCO0FBQ3hCRyxhQUFPQSxLQUFLRSxJQUFMLENBQVVELElBQVYsQ0FBUDtBQUNBLFVBQUksQ0FBQ0QsSUFBTCxFQUFXO0FBQ1gsVUFBSUEsS0FBS0csT0FBVCxFQUFrQkwsT0FBT0UsS0FBS0ksSUFBWixJQUFvQkgsSUFBcEI7QUFDbkI7O0FBRUQsUUFBSSxDQUFDRCxJQUFELElBQVMsQ0FBQ0EsS0FBS0ssSUFBbkIsRUFBeUIsT0FBTyxFQUFQO0FBQ3pCLFdBQU8sRUFBQ0wsSUFBRCxFQUFPRixNQUFQLEVBQVA7QUFDRDs7QUFFRFEsU0FBT0MsS0FBUCxFQUEyQjtBQUN6QixRQUFJUCxPQUFPLEtBQUtQLElBQWhCO0FBQ0EsU0FBSyxNQUFNUSxJQUFYLElBQW1CTSxNQUFNVixLQUF6QixFQUFnQztBQUM5QkcsYUFBT0EsS0FBS00sTUFBTCxDQUFZTCxLQUFLTyxLQUFMLEVBQVosQ0FBUDtBQUNEOztBQUVELFdBQU9SLElBQVA7QUFDRDs7QUFFRCxHQUFDUyxRQUFELEdBQXNDO0FBQ3BDLFVBQU1DLFFBQVEsQ0FBQyxDQUFDLEtBQUtqQixJQUFOLENBQUQsQ0FBZDs7QUFFQSxXQUFPaUIsTUFBTUMsTUFBYixFQUFxQjtBQUNuQixZQUFNQyxPQUFPRixNQUFNRyxHQUFOLEVBQWI7QUFDQSxZQUFNYixPQUFPWSxLQUFLQSxLQUFLRCxNQUFMLEdBQWMsQ0FBbkIsQ0FBYjs7QUFFQSxZQUFNRyxXQUFXLENBQUMsR0FBR0MsTUFBTUMsSUFBTixDQUFXaEIsS0FBS2MsUUFBTCxDQUFjRyxNQUFkLEVBQVgsQ0FBSixFQUF3QyxHQUFHRixNQUFNQyxJQUFOLENBQVdoQixLQUFLa0IsUUFBTCxDQUFjRCxNQUFkLEVBQVgsQ0FBM0MsQ0FBakI7QUFDQSxXQUFLLE1BQU1qQixJQUFYLElBQW1CYyxRQUFuQixFQUE2QjtBQUMzQkosY0FBTVMsSUFBTixDQUFXUCxLQUFLUSxNQUFMLENBQVksQ0FBQ3BCLElBQUQsQ0FBWixDQUFYO0FBQ0Q7O0FBRUQsVUFBSUEsS0FBS0ssSUFBVCxFQUFlLE1BQU0sQ0FBQ0wsSUFBRCxFQUFPWSxLQUFLUyxLQUFMLENBQVcsQ0FBWCxDQUFQLENBQU47QUFDaEI7QUFDRjtBQTVDdUIsQztrQkFBTDlCLEkiLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgTm9kZSBmcm9tIFwiLi9ub2RlXCJcbmltcG9ydCBSb3V0ZSBmcm9tIFwiLi9yb3V0ZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyZWUge1xuICByb290OiBOb2RlID0gbmV3IE5vZGVcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBPYmplY3QuZnJlZXplKHRoaXMpXG4gIH1cblxuICBtYXRjaChwYXJ0czogc3RyaW5nW10pOiB7bm9kZT86IE5vZGUsIHBhcmFtcz86IE9iamVjdH0ge1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAgIGxldCBub2RlID0gdGhpcy5yb290XG4gICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICBub2RlID0gbm9kZS5maW5kKHBhcnQpXG4gICAgICBpZiAoIW5vZGUpIGJyZWFrXG4gICAgICBpZiAobm9kZS5wYXR0ZXJuKSBwYXJhbXNbbm9kZS5uYW1lXSA9IHBhcnRcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUubGVhZikgcmV0dXJuIHt9XG4gICAgcmV0dXJuIHtub2RlLCBwYXJhbXN9XG4gIH1cblxuICBpbnNlcnQocm91dGU6IFJvdXRlKTogTm9kZSB7XG4gICAgbGV0IG5vZGUgPSB0aGlzLnJvb3RcbiAgICBmb3IgKGNvbnN0IHBhcnQgb2Ygcm91dGUucGFydHMpIHtcbiAgICAgIG5vZGUgPSBub2RlLmluc2VydChwYXJ0LmNsb25lKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gICp0cmF2ZXJzZSgpOiBJdGVyYWJsZTxbTm9kZSwgTm9kZVtdXT4ge1xuICAgIGNvbnN0IHN0YWNrID0gW1t0aGlzLnJvb3RdXVxuXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGF0aCA9IHN0YWNrLnBvcCgpXG4gICAgICBjb25zdCBub2RlID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG5cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gWy4uLkFycmF5LmZyb20obm9kZS5jaGlsZHJlbi52YWx1ZXMoKSksIC4uLkFycmF5LmZyb20obm9kZS5wYXR0ZXJucy52YWx1ZXMoKSldXG4gICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgc3RhY2sucHVzaChwYXRoLmNvbmNhdChbbm9kZV0pKVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5sZWFmKSB5aWVsZCBbbm9kZSwgcGF0aC5zbGljZSgxKV1cbiAgICB9XG4gIH1cbn1cbiJdfQ==