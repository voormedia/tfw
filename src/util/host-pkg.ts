import * as fs from "fs"
import * as path from "path"

interface Pkg {
  name: string
  [key: string]: any
}

function determinePkg(): Pkg {
  const mod = require.main
  if (!mod) return {name: "<unknown>"}

  let pkg
  let dir = mod.filename
  do {
    dir = path.dirname(dir)
    if (dir === "/") return {name: "<unknown>"}

    pkg = path.join(dir, "package.json")
  } while (!fs.existsSync(pkg))

  return require(pkg)
}

const pkg = determinePkg()
export default pkg
