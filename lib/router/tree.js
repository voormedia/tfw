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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXIvdHJlZS5qcyJdLCJuYW1lcyI6WyJUcmVlIiwiY29uc3RydWN0b3IiLCJyb290IiwiT2JqZWN0IiwiZnJlZXplIiwibWF0Y2giLCJwYXJ0cyIsInBhcmFtcyIsImNyZWF0ZSIsIm5vZGUiLCJwYXJ0IiwiZmluZCIsInBhdHRlcm4iLCJuYW1lIiwibGVhZiIsImluc2VydCIsInJvdXRlIiwiY2xvbmUiLCJ0cmF2ZXJzZSIsInN0YWNrIiwibGVuZ3RoIiwicGF0aCIsInBvcCIsImNoaWxkcmVuIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwicGF0dGVybnMiLCJwdXNoIiwiY29uY2F0Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFcUJBLEksR0FBTixNQUFNQSxJQUFOLENBQVc7O0FBR3hCQyxnQkFBYztBQUFBLFNBRmRDLElBRWMsR0FGRCxvQkFFQzs7QUFDWkMsV0FBT0MsTUFBUCxDQUFjLElBQWQ7QUFDRDs7QUFFREMsUUFBTUMsS0FBTixFQUF1RDtBQUNyRDtBQUNBLFVBQU1DLFNBQVNKLE9BQU9LLE1BQVAsQ0FBYyxJQUFkLENBQWY7O0FBRUEsUUFBSUMsT0FBTyxLQUFLUCxJQUFoQjtBQUNBLFNBQUssTUFBTVEsSUFBWCxJQUFtQkosS0FBbkIsRUFBMEI7QUFDeEJHLGFBQU9BLEtBQUtFLElBQUwsQ0FBVUQsSUFBVixDQUFQO0FBQ0EsVUFBSSxDQUFDRCxJQUFMLEVBQVc7QUFDWCxVQUFJQSxLQUFLRyxPQUFULEVBQWtCTCxPQUFPRSxLQUFLSSxJQUFaLElBQW9CSCxJQUFwQjtBQUNuQjs7QUFFRCxRQUFJLENBQUNELElBQUQsSUFBUyxDQUFDQSxLQUFLSyxJQUFuQixFQUF5QixPQUFPLEVBQVA7QUFDekIsV0FBTyxFQUFDTCxJQUFELEVBQU9GLE1BQVAsRUFBUDtBQUNEOztBQUVEUSxTQUFPQyxLQUFQLEVBQTJCO0FBQ3pCLFFBQUlQLE9BQU8sS0FBS1AsSUFBaEI7QUFDQSxTQUFLLE1BQU1RLElBQVgsSUFBbUJNLE1BQU1WLEtBQXpCLEVBQWdDO0FBQzlCRyxhQUFPQSxLQUFLTSxNQUFMLENBQVlMLEtBQUtPLEtBQUwsRUFBWixDQUFQO0FBQ0EsVUFBSVIsS0FBS0ksSUFBTCxLQUFjSCxLQUFLRyxJQUF2QixFQUE2QjtBQUMzQixjQUFNLHNCQUFlRyxLQUFmLEVBQXVCLGlDQUFnQ1AsS0FBS0ksSUFBSyxTQUFRSCxLQUFLRyxJQUFLLEdBQW5GLENBQU47QUFDRDtBQUNGOztBQUVELFdBQU9KLElBQVA7QUFDRDs7QUFFRCxHQUFDUyxRQUFELEdBQXNDO0FBQ3BDLFVBQU1DLFFBQVEsQ0FBQyxDQUFDLEtBQUtqQixJQUFOLENBQUQsQ0FBZDs7QUFFQSxXQUFPaUIsTUFBTUMsTUFBYixFQUFxQjtBQUNuQixZQUFNQyxPQUFPRixNQUFNRyxHQUFOLEVBQWI7QUFDQSxZQUFNYixPQUFPWSxLQUFLQSxLQUFLRCxNQUFMLEdBQWMsQ0FBbkIsQ0FBYjs7QUFFQSxZQUFNRyxXQUFXLENBQ2YsR0FBR0MsTUFBTUMsSUFBTixDQUFXaEIsS0FBS2MsUUFBTCxDQUFjRyxNQUFkLEVBQVgsQ0FEWSxFQUVmLEdBQUdGLE1BQU1DLElBQU4sQ0FBV2hCLEtBQUtrQixRQUFMLENBQWNELE1BQWQsRUFBWCxDQUZZLENBQWpCOztBQUtBLFdBQUssTUFBTWpCLElBQVgsSUFBbUJjLFFBQW5CLEVBQTZCO0FBQzNCSixjQUFNUyxJQUFOLENBQVdQLEtBQUtRLE1BQUwsQ0FBWSxDQUFDcEIsSUFBRCxDQUFaLENBQVg7QUFDRDs7QUFFRCxVQUFJQSxLQUFLSyxJQUFULEVBQWUsTUFBTSxDQUFDTCxJQUFELEVBQU9ZLEtBQUtTLEtBQUwsQ0FBVyxDQUFYLENBQVAsQ0FBTjtBQUNoQjtBQUNGO0FBcER1QixDO2tCQUFMOUIsSSIsImZpbGUiOiJ0cmVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBOb2RlIGZyb20gXCIuL25vZGVcIlxuaW1wb3J0IFJvdXRlLCB7Um91dGVFcnJvcn0gZnJvbSBcIi4vcm91dGVcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmVlIHtcbiAgcm9vdDogTm9kZSA9IG5ldyBOb2RlXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKVxuICB9XG5cbiAgbWF0Y2gocGFydHM6IHN0cmluZ1tdKToge25vZGU/OiBOb2RlLCBwYXJhbXM/OiBPYmplY3R9IHtcbiAgICAvKiBDcmVhdGUgb2JqZWN0IHdpdGhvdXQgcHJvdG90eXBlLiAqL1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuICAgIGxldCBub2RlID0gdGhpcy5yb290XG4gICAgZm9yIChjb25zdCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICBub2RlID0gbm9kZS5maW5kKHBhcnQpXG4gICAgICBpZiAoIW5vZGUpIGJyZWFrXG4gICAgICBpZiAobm9kZS5wYXR0ZXJuKSBwYXJhbXNbbm9kZS5uYW1lXSA9IHBhcnRcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUubGVhZikgcmV0dXJuIHt9XG4gICAgcmV0dXJuIHtub2RlLCBwYXJhbXN9XG4gIH1cblxuICBpbnNlcnQocm91dGU6IFJvdXRlKTogTm9kZSB7XG4gICAgbGV0IG5vZGUgPSB0aGlzLnJvb3RcbiAgICBmb3IgKGNvbnN0IHBhcnQgb2Ygcm91dGUucGFydHMpIHtcbiAgICAgIG5vZGUgPSBub2RlLmluc2VydChwYXJ0LmNsb25lKCkpXG4gICAgICBpZiAobm9kZS5uYW1lICE9PSBwYXJ0Lm5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJvdXRlRXJyb3Iocm91dGUsIGByZWRlZmluZXMgZXhpc3RpbmcgcGFyYW1ldGVyIHske25vZGUubmFtZX19IGFzIHske3BhcnQubmFtZX19YClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgKnRyYXZlcnNlKCk6IEl0ZXJhYmxlPFtOb2RlLCBOb2RlW11dPiB7XG4gICAgY29uc3Qgc3RhY2sgPSBbW3RoaXMucm9vdF1dXG5cbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXRoID0gc3RhY2sucG9wKClcbiAgICAgIGNvbnN0IG5vZGUgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cblxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXG4gICAgICAgIC4uLkFycmF5LmZyb20obm9kZS5jaGlsZHJlbi52YWx1ZXMoKSksXG4gICAgICAgIC4uLkFycmF5LmZyb20obm9kZS5wYXR0ZXJucy52YWx1ZXMoKSksXG4gICAgICBdXG5cbiAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBjaGlsZHJlbikge1xuICAgICAgICBzdGFjay5wdXNoKHBhdGguY29uY2F0KFtub2RlXSkpXG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLmxlYWYpIHlpZWxkIFtub2RlLCBwYXRoLnNsaWNlKDEpXVxuICAgIH1cbiAgfVxufVxuIl19