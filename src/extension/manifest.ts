import { extension } from "@/config.ts";
import { commandContributions, type CommandContribution } from "@/extension/contributions.ts";
import type { ThemeContribution } from "@/theme/types.ts";

type ExtensionManifest = {
  name: string;
  displayName: string;
  description: string;
  version: string;
  publisher: string;
  license: string;
  type: "module";
  main: string;
  icon: string;
  activationEvents: string[];
  repository: {
    type: "git";
    url: string;
    directory: string;
  };
  files: string[];
  engines: {
    vscode: string;
  };
  categories: string[];
  keywords: string[];
  contributes: {
    commands: CommandContribution[];
    themes: ThemeContribution[];
  };
};

export const createExtensionManifest = (themes: ThemeContribution[]): ExtensionManifest => ({
  name: extension.name,
  displayName: extension.displayName,
  description: "A quiet, deeply customizable theme for focused coding.",
  version: extension.version,
  publisher: extension.publisher,
  license: "Apache-2.0",
  type: "module",
  main: "./extension.js",
  icon: "assets/logo.png",
  activationEvents: ["onCommand:umbre.configure", "onCommand:umbre.toggleMode", "onStartupFinished"],
  repository: {
    type: "git",
    url: "https://github.com/ohkimur/umbre-theme.git",
    directory: ".",
  },
  files: ["extension.js", "assets/**", "themes/**", "README.md", "LICENSE", "package.json"],
  engines: {
    vscode: "^1.100.0",
  },
  categories: ["Themes"],
  keywords: ["theme", "dark theme", "light theme", "black", "umbre"],
  contributes: {
    commands: commandContributions(),
    themes,
  },
});
