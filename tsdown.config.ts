import { readFileSync } from "node:fs";

import { defineConfig } from "tsdown";

type PackageJson = {
  dependencies?: Record<string, string>;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const dependencyPattern = (dependencies: string[]): RegExp => {
  return new RegExp(`^(${dependencies.map(escapeRegExp).join("|")})(/.*)?$`);
};

const extensionHostExternalDependencies = ["vscode"];
const packageJson = JSON.parse(readFileSync(new URL("package.json", import.meta.url), "utf8")) as PackageJson;
const extensionRuntimeDependencyPattern = dependencyPattern(Object.keys(packageJson.dependencies ?? {}));

export default defineConfig({
  entry: {
    extension: "src/extension/activate.ts",
  },
  outDir: "dist",
  clean: true,
  dts: false,
  deps: {
    alwaysBundle: [extensionRuntimeDependencyPattern],
    neverBundle: extensionHostExternalDependencies,
    onlyBundle: [extensionRuntimeDependencyPattern],
  },
  outExtensions: () => ({ js: ".js" }),
  format: "esm",
  platform: "node",
  sourcemap: false,
  target: "esnext",
  onSuccess: "bun scripts/build/artifacts.ts",
});
