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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXIvdHJlZS5qcyJdLCJuYW1lcyI6WyJUcmVlIiwiY29uc3RydWN0b3IiLCJyb290IiwiT2JqZWN0IiwiZnJlZXplIiwibWF0Y2giLCJwYXJ0cyIsInBhcmFtcyIsImNyZWF0ZSIsIm5vZGUiLCJwYXJ0IiwiZmluZCIsInBhdHRlcm4iLCJuYW1lIiwibGVhZiIsImluc2VydCIsInJvdXRlIiwiY2xvbmUiLCJ0cmF2ZXJzZSIsInN0YWNrIiwibGVuZ3RoIiwicGF0aCIsInBvcCIsImNoaWxkcmVuIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwicGF0dGVybnMiLCJwdXNoIiwiY29uY2F0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFcUJBLEksR0FBTixNQUFNQSxJQUFOLENBQVc7O0FBR3hCQyxnQkFBYztBQUFBLFNBRmRDLElBRWMsR0FGRCxvQkFFQzs7QUFDWkMsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFREMsUUFBTUMsS0FBTixFQUF1RDtBQUNyRCxVQUFNQyxTQUFTSixPQUFPSyxNQUFQLENBQWMsSUFBZCxDQUFmOztBQUVBLFFBQUlDLE9BQU8sS0FBS1AsSUFBaEI7QUFDQSxTQUFLLE1BQU1RLElBQVgsSUFBbUJKLEtBQW5CLEVBQTBCO0FBQ3hCRyxhQUFPQSxLQUFLRSxJQUFMLENBQVVELElBQVYsQ0FBUDtBQUNBLFVBQUksQ0FBQ0QsSUFBTCxFQUFXO0FBQ1gsVUFBSUEsS0FBS0csT0FBVCxFQUFrQkwsT0FBT0UsS0FBS0ksSUFBWixJQUFvQkgsSUFBcEI7QUFDbkI7O0FBRUQsUUFBSSxDQUFDRCxJQUFELElBQVMsQ0FBQ0EsS0FBS0ssSUFBbkIsRUFBeUIsT0FBTyxFQUFQO0FBQ3pCLFdBQU8sRUFBQ0wsSUFBRCxFQUFPRixNQUFQLEVBQVA7QUFDRDs7QUFFRFEsU0FBT0MsS0FBUCxFQUEyQjtBQUN6QixRQUFJUCxPQUFPLEtBQUtQLElBQWhCO0FBQ0EsU0FBSyxNQUFNUSxJQUFYLElBQW1CTSxNQUFNVixLQUF6QixFQUFnQztBQUM5QkcsYUFBT0EsS0FBS00sTUFBTCxDQUFZTCxLQUFLTyxLQUFMLEVBQVosQ0FBUDtBQUNEOztBQUVELFdBQU9SLElBQVA7QUFDRDs7QUFFRCxHQUFDUyxRQUFELEdBQXNDO0FBQ3BDLFVBQU1DLFFBQVEsQ0FBQyxDQUFDLEtBQUtqQixJQUFOLENBQUQsQ0FBZDs7QUFFQSxXQUFPaUIsTUFBTUMsTUFBYixFQUFxQjtBQUNuQixZQUFNQyxPQUFPRixNQUFNRyxHQUFOLEVBQWI7QUFDQSxZQUFNYixPQUFPWSxLQUFLQSxLQUFLRCxNQUFMLEdBQWMsQ0FBbkIsQ0FBYjs7QUFFQSxZQUFNRyxXQUFXLENBQ2YsR0FBR0MsTUFBTUMsSUFBTixDQUFXaEIsS0FBS2MsUUFBTCxDQUFjRyxNQUFkLEVBQVgsQ0FEWSxFQUVmLEdBQUdGLE1BQU1DLElBQU4sQ0FBV2hCLEtBQUtrQixRQUFMLENBQWNELE1BQWQsRUFBWCxDQUZZLENBQWpCOztBQUtBLFdBQUssTUFBTWpCLElBQVgsSUFBbUJjLFFBQW5CLEVBQTZCO0FBQzNCSixjQUFNUyxJQUFOLENBQVdQLEtBQUtRLE1BQUwsQ0FBWSxDQUFDcEIsSUFBRCxDQUFaLENBQVg7QUFDRDs7QUFFRCxVQUFJQSxLQUFLSyxJQUFULEVBQWUsTUFBTSxDQUFDTCxJQUFELEVBQU9ZLEtBQUtTLEtBQUwsQ0FBVyxDQUFYLENBQVAsQ0FBTjtBQUNoQjtBQUNGO0FBaER1QixDO2tCQUFMOUIsSSIsImZpbGUiOiJ0cmVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBOb2RlIGZyb20gXCIuL25vZGVcIlxuaW1wb3J0IFJvdXRlIGZyb20gXCIuL3JvdXRlXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJlZSB7XG4gIHJvb3Q6IE5vZGUgPSBuZXcgTm9kZVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIE9iamVjdC5mcmVlemUodGhpcylcbiAgfVxuXG4gIG1hdGNoKHBhcnRzOiBzdHJpbmdbXSk6IHtub2RlPzogTm9kZSwgcGFyYW1zPzogT2JqZWN0fSB7XG4gICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICAgbGV0IG5vZGUgPSB0aGlzLnJvb3RcbiAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgIG5vZGUgPSBub2RlLmZpbmQocGFydClcbiAgICAgIGlmICghbm9kZSkgYnJlYWtcbiAgICAgIGlmIChub2RlLnBhdHRlcm4pIHBhcmFtc1tub2RlLm5hbWVdID0gcGFydFxuICAgIH1cblxuICAgIGlmICghbm9kZSB8fCAhbm9kZS5sZWFmKSByZXR1cm4ge31cbiAgICByZXR1cm4ge25vZGUsIHBhcmFtc31cbiAgfVxuXG4gIGluc2VydChyb3V0ZTogUm91dGUpOiBOb2RlIHtcbiAgICBsZXQgbm9kZSA9IHRoaXMucm9vdFxuICAgIGZvciAoY29uc3QgcGFydCBvZiByb3V0ZS5wYXJ0cykge1xuICAgICAgbm9kZSA9IG5vZGUuaW5zZXJ0KHBhcnQuY2xvbmUoKSlcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgKnRyYXZlcnNlKCk6IEl0ZXJhYmxlPFtOb2RlLCBOb2RlW11dPiB7XG4gICAgY29uc3Qgc3RhY2sgPSBbW3RoaXMucm9vdF1dXG5cbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXRoID0gc3RhY2sucG9wKClcbiAgICAgIGNvbnN0IG5vZGUgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cblxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXG4gICAgICAgIC4uLkFycmF5LmZyb20obm9kZS5jaGlsZHJlbi52YWx1ZXMoKSksXG4gICAgICAgIC4uLkFycmF5LmZyb20obm9kZS5wYXR0ZXJucy52YWx1ZXMoKSksXG4gICAgICBdXG5cbiAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBjaGlsZHJlbikge1xuICAgICAgICBzdGFjay5wdXNoKHBhdGguY29uY2F0KFtub2RlXSkpXG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLmxlYWYpIHlpZWxkIFtub2RlLCBwYXRoLnNsaWNlKDEpXVxuICAgIH1cbiAgfVxufVxuIl19