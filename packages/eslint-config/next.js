const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "prettier",
        require.resolve("@vercel/style-guide/eslint/next"),
        "turbo",
        "plugin:import/recommended",
        "plugin:prettier/recommended",
    ],
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        node: true,
        browser: true,
    },
    plugins: ["only-warn"],
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        ".*.js",
        "node_modules/",
    ],
    overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
    rules: {
        "import/order": [
            "warn",
            {
                alphabetize: {
                    caseInsensitive: true,
                    order: "asc",
                },
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    ["parent", "sibling"],
                    "index",
                ],
                "newlines-between": "always",
                pathGroups: [
                    {
                        pattern: "@/**",
                        group: "internal",
                    },
                    {
                        pattern: "~/**",
                        group: "internal",
                    },
                ],
                pathGroupsExcludedImportTypes: ["builtin"],
            },
        ],
    },
}
