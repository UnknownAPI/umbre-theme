import { defineConfig } from "oxfmt";

export default defineConfig({
  arrowParens: "always",
  ignorePatterns: ["dist/**", "node_modules/**", "*.vsix"],
  printWidth: 110,
  semi: true,
  singleQuote: false,
  sortImports: {
    internalPattern: ["@/**"],
    groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "style", "unknown"],
  },
  trailingComma: "all",
});
