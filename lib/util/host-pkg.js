"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function determinePkg() {
    const mod = require.main;
    if (!mod)
        return { name: "<unknown>" };
    let pkg;
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