import { createExtensionManifest } from "@/extension/manifest.ts";
import { copyFile, ensureDir, remove } from "@/utils/fs.ts";
import { writeJson } from "@/utils/json.ts";
import { bundleRuntime } from "@scripts/build/bundle-runtime.ts";
import { distDir, licensePath, readmePath, themesDir } from "@scripts/build/paths.ts";
import { createThemes, type BuiltThemeFile } from "@scripts/build/themes.ts";

export const buildExtension = async (): Promise<void> => {
  const themes = createThemes();

  await resetDist();
  await bundleRuntime();
  await writeThemeFiles(themes, themesDir);
  await writeJson(
    new URL("package.json", distDir),
    createExtensionManifest(themes.map((theme) => theme.contribution)),
  );
  await copyFile(readmePath, new URL("README.md", distDir));
  await copyFile(licensePath, new URL("LICENSE", distDir));

  console.log(`Built ${themes.length} Umbra themes in ${distDir.pathname}`);
};

const resetDist = async (): Promise<void> => {
  await remove(distDir);
  await ensureDir(themesDir);
};

const writeThemeFiles = async (themes: readonly BuiltThemeFile[], directory: URL): Promise<void> => {
  await Promise.all(
    themes.map((theme) => {
      return writeJson(new URL(theme.fileName, directory), theme.document);
    }),
  );
};
