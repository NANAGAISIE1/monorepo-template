import { generator as electron } from "./electron/generator"
import type { PlopTypes } from "@turbo/gen"

export default function generators(plop: PlopTypes.NodePlopAPI) {
    electron(plop)
}
