export type DependencyType =
    | "dependencies"
    | "devDependencies"
    | "peerDependencies"
    | "optionalDependencies"

export type Answers = {
    workspaceType: "app" | "package"
    appName: string
    appLocation: string
    addWorkspaceDependencies: boolean
    dependencyTypesToModify: DependencyType[]
    dependencies?: string[]
    devDependencies?: string[]
    peerDependencies?: string[]
    optionalDependencies?: string[]
    overwriteExisting?: boolean
}
