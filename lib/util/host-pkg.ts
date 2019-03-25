import * as fs from "fs"
import * as path from "path"

function determinePkg() {
  let pkg
  let mod: NodeModule | null = module
  do {
    mod = mod.parent
    if (!mod) throw new Error("No root module found!")
  } while (mod.id !== ".")

  let dir = mod.filename
  do {
    dir = path.dirname(dir)
    if (dir === "/") throw new Error("No package.json found!")

    pkg = path.join(dir, "package.json")
  } while (!fs.existsSync(pkg))

  return require(pkg)
}

const pkg = determinePkg()
export default pkg
