import * as fs from "fs";
import * as path from "path";
async function determinePkg() {
    let pkgPath;
    let dir = process.argv[1];
    do {
        dir = path.dirname(dir);
        if (dir === "/")
            return { name: "<unknown>" };
        pkgPath = path.join(dir, "package.json");
    } while (!fs.existsSync(pkgPath));
    if (typeof require === "undefined") {
        const pkg = await import(pkgPath, { assert: { type: "json" } });
        return pkg.default;
    }
    else {
        return require(pkgPath);
    }
}
const pkg = await determinePkg();
export default pkg;
//# sourceMappingURL=host-pkg.js.map