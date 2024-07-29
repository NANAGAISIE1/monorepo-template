import path from "path"
import fs from "fs"
import { DependencyType } from "../generators/types"

const currentDir = __dirname

export const rootDir = path.resolve(currentDir, "..", "..")
const packagesDir = path.join(rootDir, "packages")

// Get the list of local packages from the packages directory
export function getLocalPackages() {
    return fs
        .readdirSync(packagesDir)
        .filter((pkg) => fs.statSync(path.join(packagesDir, pkg)).isDirectory())
}

export function addDependenciesToPackageJson(
    packageJsonPath: string,
    dependencies: Partial<Record<DependencyType, string[]>>
) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

    Object.entries(dependencies).forEach(([type, packages]) => {
        if (packages && packages.length > 0) {
            if (!packageJson[type]) {
                packageJson[type] = {}
            }
            packages.forEach((pkg) => {
                const pkgJsonPath = path.join(packagesDir, pkg, "package.json")
                if (fs.existsSync(pkgJsonPath)) {
                    const pkgJson = JSON.parse(
                        fs.readFileSync(pkgJsonPath, "utf-8")
                    )
                    packageJson[type][pkgJson.name] = `workspace:*`
                } else {
                    console.warn(`Package.json not found for ${pkg}. Skipping.`)
                }
            })
        }
    })

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
}

// Get the list of folders in the root directory
export function getRootFolders() {
    return fs.readdirSync(rootDir).filter((item) => {
        const itemPath = path.join(rootDir, item)
        return (
            fs.statSync(itemPath).isDirectory() &&
            (item === "apps" || item === "packages")
        )
    })
}

// New function to check if a workspace name already exists
export function workspaceExists(location: string, name: string): boolean {
    const fullPath = path.join(rootDir, location, name)
    return fs.existsSync(fullPath)
}
