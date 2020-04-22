"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function determinePkg() {
    let pkg;
    let mod = module;
    do {
        mod = mod.parent;
        if (!mod)
            return { name: "<unknown>" };
    } while (mod.id !== ".");
    let dir = mod.filename;
    do {
        dir = path.dirname(dir);
        if (dir === "/")
            return { name: "<unknown>" };
        pkg = path.join(dir, "package.json");
    } while (!fs.existsSync(pkg));
    return require(pkg);
}
const pkg = determinePkg();
exports.default = pkg;
//# sourceMappingURL=host-pkg.js.map