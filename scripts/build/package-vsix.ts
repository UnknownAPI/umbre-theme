import { access } from "node:fs/promises";

import { removeFile } from "@/utils/fs.ts";
import { runCommand } from "@/utils/process.ts";
import { distDir, vsixPath } from "@scripts/build/paths.ts";

export const packageVsix = async (): Promise<URL> => {
  await requireBuiltExtension();
  await removeFile(vsixPath);
  await runCommand("bun", ["x", "vsce", "package", "--no-dependencies", "--out", vsixPath.pathname], {
    cwd: distDir.pathname,
  });
  return vsixPath;
};

const requireBuiltExtension = async (): Promise<void> => {
  try {
    await access(new URL("package.json", distDir));
    await access(new URL("extension.js", distDir));
  } catch {
    throw new Error("dist/ is not built. Run `bun run build` before `bun run package`.");
  }
};
