import { rootDir } from "../../utils"
import path from "path"
import { Answers } from "../types"
import type { PlopTypes } from "@turbo/gen"
import { api } from "@electron-forge/core"
import fs from "fs"
import { addDependenciesToPackageJson } from "../../utils/index"

export const setupWorkspace: PlopTypes.CustomActionFunction = async (
    answers
) => {
    const answerObject = answers as Answers
    const fullPath = path.join(
        rootDir,
        answerObject.appLocation,
        answerObject.appName
    )

    if (answerObject.workspaceType === "app") {
        try {
            if (fs.existsSync(fullPath)) {
                if (!answerObject.overwriteExisting) {
                    throw new Error(
                        "Directory already exists. Please choose a different name or location."
                    )
                }
                console.log("Overwriting existing directory...")
                fs.rmSync(fullPath, { recursive: true, force: true })
            }

            console.log(
                "Installing Electron Forge packages. This may take a few minutes..."
            )

            await api.init({
                dir: fullPath,
                template: "vite-typescript",
                interactive: false,
                copyCIFiles: false,
            })
            console.log("Electron Forge packages installed successfully!")
            console.log(
                "Install packages dependencies with your package manager"
            )
        } catch (error) {
            console.error("Failed to initialize Electron app:", error)
            throw new Error("Failed to initialize Electron app")
        }
    } else {
        // For package type, just create a basic directory structure
        fs.mkdirSync(fullPath, { recursive: true })
        fs.writeFileSync(
            path.join(fullPath, "package.json"),
            JSON.stringify(
                {
                    name: answerObject.appName,
                    version: "0.1.0",
                    main: "index.js",
                },
                null,
                2
            )
        )
    }

    if (answerObject.addWorkspaceDependencies) {
        const packageJsonPath = path.join(fullPath, "package.json")
        addDependenciesToPackageJson(packageJsonPath, {
            dependencies: answerObject.dependencies,
            devDependencies: answerObject.devDependencies,
            peerDependencies: answerObject.peerDependencies,
            optionalDependencies: answerObject.optionalDependencies,
        })
        console.log("Workspace dependencies added to package.json")
    }

    return `Workspace "${answerObject.appName}" created successfully`
}
