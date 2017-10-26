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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXIvdHJlZS5qcyJdLCJuYW1lcyI6WyJUcmVlIiwiY29uc3RydWN0b3IiLCJyb290IiwiT2JqZWN0IiwiZnJlZXplIiwibWF0Y2giLCJwYXJ0cyIsInBhcmFtcyIsImNyZWF0ZSIsIm5vZGUiLCJwYXJ0IiwiZmluZCIsInBhdHRlcm4iLCJuYW1lIiwibGVhZiIsImluc2VydCIsInJvdXRlIiwiY2xvbmUiLCJ0cmF2ZXJzZSIsInN0YWNrIiwibGVuZ3RoIiwicGF0aCIsInBvcCIsImNoaWxkcmVuIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwicGF0dGVybnMiLCJwdXNoIiwiY29uY2F0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFcUJBLEksR0FBTixNQUFNQSxJQUFOLENBQVc7O0FBR3hCQyxnQkFBYztBQUFBLFNBRmRDLElBRWMsR0FGRCxvQkFFQzs7QUFDWkMsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFREMsUUFBTUMsS0FBTixFQUF1RDtBQUNyRDtBQUNBLFVBQU1DLFNBQVNKLE9BQU9LLE1BQVAsQ0FBYyxJQUFkLENBQWY7O0FBRUEsUUFBSUMsT0FBTyxLQUFLUCxJQUFoQjtBQUNBLFNBQUssTUFBTVEsSUFBWCxJQUFtQkosS0FBbkIsRUFBMEI7QUFDeEJHLGFBQU9BLEtBQUtFLElBQUwsQ0FBVUQsSUFBVixDQUFQO0FBQ0EsVUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDWCxVQUFJQSxLQUFLRyxPQUFULEVBQWtCTCxPQUFPRSxLQUFLSSxJQUFaLElBQW9CSCxJQUFwQjtBQUNuQjs7QUFFRCxRQUFJLENBQUNELElBQUQsSUFBUyxDQUFDQSxLQUFLSyxJQUFuQixFQUF5QixPQUFPLEVBQVA7QUFDekIsV0FBTyxFQUFDTCxJQUFELEVBQU9GLE1BQVAsRUFBUDtBQUNEOztBQUVEUSxTQUFPQyxLQUFQLEVBQTJCO0FBQ3pCLFFBQUlQLE9BQU8sS0FBS1AsSUFBaEI7QUFDQSxTQUFLLE1BQU1RLElBQVgsSUFBbUJNLE1BQU1WLEtBQXpCLEVBQWdDO0FBQzlCRyxhQUFPQSxLQUFLTSxNQUFMLENBQVlMLEtBQUtPLEtBQUwsRUFBWixDQUFQO0FBQ0Q7O0FBRUQsV0FBT1IsSUFBUDtBQUNEOztBQUVELEdBQUNTLFFBQUQsR0FBc0M7QUFDcEMsVUFBTUMsUUFBUSxDQUFDLENBQUMsS0FBS2pCLElBQU4sQ0FBRCxDQUFkOztBQUVBLFdBQU9pQixNQUFNQyxNQUFiLEVBQXFCO0FBQ25CLFlBQU1DLE9BQU9GLE1BQU1HLEdBQU4sRUFBYjtBQUNBLFlBQU1iLE9BQU9ZLEtBQUtBLEtBQUtELE1BQUwsR0FBYyxDQUFuQixDQUFiOztBQUVBLFlBQU1HLFdBQVcsQ0FDZixHQUFHQyxNQUFNQyxJQUFOLENBQVdoQixLQUFLYyxRQUFMLENBQWNHLE1BQWQsRUFBWCxDQURZLEVBRWYsR0FBR0YsTUFBTUMsSUFBTixDQUFXaEIsS0FBS2tCLFFBQUwsQ0FBY0QsTUFBZCxFQUFYLENBRlksQ0FBakI7O0FBS0EsV0FBSyxNQUFNakIsSUFBWCxJQUFtQmMsUUFBbkIsRUFBNkI7QUFDM0JKLGNBQU1TLElBQU4sQ0FBV1AsS0FBS1EsTUFBTCxDQUFZLENBQUNwQixJQUFELENBQVosQ0FBWDtBQUNEOztBQUVELFVBQUlBLEtBQUtLLElBQVQsRUFBZSxNQUFNLENBQUNMLElBQUQsRUFBT1ksS0FBS1MsS0FBTCxDQUFXLENBQVgsQ0FBUCxDQUFOO0FBQ2hCO0FBQ0Y7QUFqRHVCLEM7a0JBQUw5QixJIiwiZmlsZSI6InRyZWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IE5vZGUgZnJvbSBcIi4vbm9kZVwiXG5pbXBvcnQgUm91dGUgZnJvbSBcIi4vcm91dGVcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmVlIHtcbiAgcm9vdDogTm9kZSA9IG5ldyBOb2RlXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgbWF0Y2gocGFydHM6IHN0cmluZ1tdKToge25vZGU/OiBOb2RlLCBwYXJhbXM/OiBPYmplY3R9IHtcbiAgICAvKiBDcmVhdGUgb2JqZWN0IHdpdGhvdXQgcHJvdG90eXBlLiAqL1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAgIGxldCBub2RlID0gdGhpcy5yb290XG4gICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICBub2RlID0gbm9kZS5maW5kKHBhcnQpXG4gICAgICBpZiAoIW5vZGUpIGJyZWFrXG4gICAgICBpZiAobm9kZS5wYXR0ZXJuKSBwYXJhbXNbbm9kZS5uYW1lXSA9IHBhcnRcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUubGVhZikgcmV0dXJuIHt9XG4gICAgcmV0dXJuIHtub2RlLCBwYXJhbXN9XG4gIH1cblxuICBpbnNlcnQocm91dGU6IFJvdXRlKTogTm9kZSB7XG4gICAgbGV0IG5vZGUgPSB0aGlzLnJvb3RcbiAgICBmb3IgKGNvbnN0IHBhcnQgb2Ygcm91dGUucGFydHMpIHtcbiAgICAgIG5vZGUgPSBub2RlLmluc2VydChwYXJ0LmNsb25lKCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gICp0cmF2ZXJzZSgpOiBJdGVyYWJsZTxbTm9kZSwgTm9kZVtdXT4ge1xuICAgIGNvbnN0IHN0YWNrID0gW1t0aGlzLnJvb3RdXVxuXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGF0aCA9IHN0YWNrLnBvcCgpXG4gICAgICBjb25zdCBub2RlID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG5cbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW1xuICAgICAgICAuLi5BcnJheS5mcm9tKG5vZGUuY2hpbGRyZW4udmFsdWVzKCkpLFxuICAgICAgICAuLi5BcnJheS5mcm9tKG5vZGUucGF0dGVybnMudmFsdWVzKCkpLFxuICAgICAgXVxuXG4gICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgc3RhY2sucHVzaChwYXRoLmNvbmNhdChbbm9kZV0pKVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5sZWFmKSB5aWVsZCBbbm9kZSwgcGF0aC5zbGljZSgxKV1cbiAgICB9XG4gIH1cbn1cbiJdfQ==