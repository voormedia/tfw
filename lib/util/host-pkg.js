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
            throw new Error("No root module found!");
    } while (mod.id !== ".");
    let dir = mod.filename;
    do {
        dir = path.dirname(dir);
        if (dir === "/")
            throw new Error("No package.json found!");
        pkg = path.join(dir, "package.json");
    } while (!fs.existsSync(pkg));
    return require(pkg);
}
const pkg = determinePkg();
exports.default = pkg;
//# sourceMappingURL=host-pkg.js.map