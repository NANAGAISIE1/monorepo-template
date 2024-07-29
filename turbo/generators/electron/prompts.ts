import { getLocalPackages } from "../../utils"
import type { PlopTypes } from "@turbo/gen"
import { Answers } from "../types"
import { rootDir } from "../../utils/index"
import path from "path"
import fs from "fs"

let appName = ""

export const electronPrompts: PlopTypes.Prompts = [
    {
        type: "list",
        name: "workspaceType",
        message: "What type of workspace should be added?",
        choices: [
            { name: "Application", value: "app" },
            { name: "Package", value: "package" },
        ],
    },
    {
        type: "input",
        name: "appName",
        message: "What is the name of the workspace?",
        validate: (input) => (input ? true : "Workspace name cannot be empty"),
    },
    {
        type: "input",
        name: "appLocation",
        message: "Where should the workspace be added?",
        default: (answers: Partial<Answers>) =>
            answers.workspaceType === "app" ? "apps" : "packages",
    },
    {
        type: "confirm",
        name: "overwriteExisting",
        message: "This directory already exists. Do you want to overwrite it?",
        default: false,
        when: (answers: Partial<Answers>) => {
            const fullPath = path.join(
                rootDir,
                answers.appLocation!,
                answers.appName!
            )
            return fs.existsSync(fullPath)
        },
    },
    {
        type: "confirm",
        name: "addWorkspaceDependencies",
        message: (answers: Partial<Answers>) =>
            `Add workspace dependencies to "${answers.appName}"?`,
        default: false,
    },
    {
        type: "checkbox",
        name: "dependencyTypesToModify",
        message: (answers: Partial<Answers>) =>
            `Select all dependency types to modify for "${answers.appName}":`,
        choices: [
            "dependencies",
            "devDependencies",
            "peerDependencies",
            "optionalDependencies",
        ],
        when: (answers: Partial<Answers>) => !!answers.addWorkspaceDependencies,
    },
    {
        type: "checkbox",
        name: "dependencies",
        message: (answers: Partial<Answers>) =>
            `Which packages should be added as dependencies to "${answers.appName}"?`,
        choices: getLocalPackages(),
        when: (answers: Partial<Answers>) =>
            !!answers.dependencyTypesToModify?.includes("dependencies"),
    },
    {
        type: "checkbox",
        name: "devDependencies",
        message: (answers: Partial<Answers>) =>
            `Which packages should be added as devDependencies to "${answers.appName}"?`,
        choices: getLocalPackages(),
        when: (answers: Partial<Answers>) =>
            !!answers.dependencyTypesToModify?.includes("devDependencies"),
    },
    {
        type: "checkbox",
        name: "peerDependencies",
        message: (answers: Partial<Answers>) =>
            `Which packages should be added as peerDependencies to "${answers.appName}"?`,
        choices: getLocalPackages(),
        when: (answers: Partial<Answers>) =>
            !!answers.dependencyTypesToModify?.includes("peerDependencies"),
    },
    {
        type: "checkbox",
        name: "optionalDependencies",
        message: (answers: Partial<Answers>) =>
            `Which packages should be added as optionalDependencies to "${answers.appName}"?`,
        choices: getLocalPackages,
        when: (answers: Partial<Answers>) =>
            !!answers.dependencyTypesToModify?.includes("optionalDependencies"),
    },
]
