import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["eslint", "typescript", "import", "unicorn", "oxc"],
  env: {
    builtin: true,
    node: true,
  },
  ignorePatterns: ["dist/**", "node_modules/**", "*.vsix", "test/**"],
  rules: {
    "eslint/func-style": ["error", "expression", { allowArrowFunctions: true }],
    "eslint/prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
    "eslint/no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["./*", "../*"],
            message: "Use the @/* alias for internal imports.",
          },
        ],
      },
    ],
  },
});
