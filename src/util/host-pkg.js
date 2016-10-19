/* @flow */
import fs from "fs"
import path from "path"

const pkg = function() {
  let pkg
  let mod = module
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
}()

export default pkg
