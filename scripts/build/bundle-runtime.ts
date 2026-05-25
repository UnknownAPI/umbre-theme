import { distDir, rootDir } from "@scripts/build/paths.ts";
import { build } from "esbuild";

export const bundleRuntime = async (): Promise<void> => {
  await build({
    bundle: true,
    entryPoints: [new URL("src/extension/activate.ts", rootDir).pathname],
    external: ["vscode"],
    format: "esm",
    outfile: new URL("extension.js", distDir).pathname,
    platform: "node",
    sourcemap: false,
    target: "esnext",
  });
};
