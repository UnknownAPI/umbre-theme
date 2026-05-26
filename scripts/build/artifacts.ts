import { readFile } from "node:fs/promises";

import { commandContributions, type CommandContribution } from "@/extension/contributions.ts";
import { commandIds, product } from "@/product.ts";
import type { ThemeContribution } from "@/theme/types.ts";
import { copyFile, ensureDir } from "@/utils/fs.ts";
import { writeJson } from "@/utils/json.ts";
import {
  distAssetsDir,
  distDir,
  licensePath,
  logoPath,
  readmePath,
  screenshotsPath,
  rootDir,
  themesDir,
} from "@scripts/build/paths.ts";
import { createThemes } from "@scripts/build/themes.ts";

type ExtensionPackageMetadata = {
  name: string;
  displayName: string;
  description: string;
  version: string;
  publisher: string;
  license: string;
  repository: {
    type: "git";
    url: string;
    directory?: string;
  };
};

type ExtensionManifest = ExtensionPackageMetadata & {
  type: "module";
  main: string;
  icon: string;
  activationEvents: string[];
  extensionPack: string[];
  files: string[];
  engines: {
    vscode: string;
  };
  categories: string[];
  keywords: string[];
  contributes: {
    commands: CommandContribution[];
    menus: {
      commandPalette: Array<{
        command: string;
        when?: string;
      }>;
    };
    themes: ThemeContribution[];
  };
};

const readPackageMetadata = async (): Promise<ExtensionPackageMetadata> => {
  const packageJson = JSON.parse(
    await readFile(new URL("package.json", rootDir), "utf8"),
  ) as Partial<ExtensionPackageMetadata>;

  return {
    name: readStringField(packageJson, "name"),
    displayName: readStringField(packageJson, "displayName"),
    description: readStringField(packageJson, "description"),
    version: process.env.UMBRE_VERSION ?? readStringField(packageJson, "version"),
    publisher: readStringField(packageJson, "publisher"),
    license: readStringField(packageJson, "license"),
    repository: readRepository(packageJson.repository),
  };
};

const createExtensionManifest = (
  packageMetadata: ExtensionPackageMetadata,
  themes: ThemeContribution[],
): ExtensionManifest => ({
  ...packageMetadata,
  type: "module",
  main: "./extension.js",
  icon: "assets/logo.png",
  activationEvents: [
    `onCommand:${commandIds.configure}`,
    `onCommand:${commandIds.toggleOpposite}`,
    "onStartupFinished",
  ],
  extensionPack: [product.recommendedExtensions.symbols.id],
  files: ["extension.js", "assets/**", "themes/**", "README.md", "LICENSE", "package.json"],
  engines: {
    vscode: "^1.100.0",
  },
  categories: ["Themes"],
  keywords: ["theme", "dark theme", "light theme", "black", "umbre"],
  contributes: {
    commands: commandContributions(),
    menus: {
      commandPalette: [
        {
          command: commandIds.toggleOpposite,
          when: "!umbre.systemAware",
        },
      ],
    },
    themes,
  },
});

const readStringField = (
  packageJson: Partial<ExtensionPackageMetadata>,
  field: keyof ExtensionPackageMetadata,
): string => {
  const value = packageJson[field];
  if (typeof value !== "string") {
    throw new Error(`package.json must define a string ${field} field.`);
  }
  return value;
};

const readRepository = (value: unknown): ExtensionPackageMetadata["repository"] => {
  if (!value || typeof value !== "object") {
    throw new Error("package.json must define a repository object.");
  }

  const repository = value as Partial<ExtensionPackageMetadata["repository"]>;
  if (repository.type !== "git" || typeof repository.url !== "string") {
    throw new Error('package.json repository must define type "git" and a url.');
  }

  return typeof repository.directory === "string"
    ? { type: repository.type, url: repository.url, directory: repository.directory }
    : { type: repository.type, url: repository.url };
};

const writeExtensionArtifacts = async (): Promise<void> => {
  const themes = createThemes();
  const packageMetadata = await readPackageMetadata();

  await ensureDir(themesDir);
  await ensureDir(distAssetsDir);
  await Promise.all([
    ...themes.map((theme) => writeJson(new URL(theme.fileName, themesDir), theme.document)),
    copyFile(logoPath, new URL("logo.png", distAssetsDir)),
    copyFile(screenshotsPath, new URL("screenshots.png", distAssetsDir)),
    copyFile(readmePath, new URL("README.md", distDir)),
    copyFile(licensePath, new URL("LICENSE", distDir)),
    writeJson(
      new URL("package.json", distDir),
      createExtensionManifest(
        packageMetadata,
        themes.map((theme) => theme.contribution),
      ),
    ),
  ]);

  console.log(`Built ${themes.length} ${product.displayName} themes in ${distDir.pathname}`);
};

await writeExtensionArtifacts();
