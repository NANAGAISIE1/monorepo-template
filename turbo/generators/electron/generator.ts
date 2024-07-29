import type { PlopTypes } from "@turbo/gen"
import { electronPrompts } from "./prompts"
import { setupWorkspace } from "./action"

export function generator(plop: PlopTypes.NodePlopAPI): void {
    // create a generator
    plop.setGenerator("electron-app", {
        description:
            "Create a new workspace with Electron app and local packages",
        prompts: electronPrompts,
        actions: (answers) => {
            const actions: PlopTypes.ActionType[] = []

            if (answers?.overwriteExisting === false) {
                actions.push((answers) => {
                    throw new Error(
                        "Operation cancelled. Please choose a different name or location."
                    )
                })
            } else {
                actions.push(setupWorkspace)
            }

            return actions
        },
    })
}
