import { copyFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, join } from "node:path";

import { product } from "@/product.ts";
import * as vscode from "vscode";

type RecommendedFont = {
  id: "jetbrains-mono" | "fira-code" | "hack";
  label: string;
  description: string;
  detail: string;
  fontFamily: string;
  files: string[];
};

const fonts = [
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono Nerd Font",
    description: "Recommended",
    detail: "Clean, modern, and excellent for code, terminals, and icons.",
    fontFamily: "'JetBrainsMono Nerd Font Mono', 'JetBrainsMono Nerd Font', 'JetBrains Mono', monospace",
    files: [
      "JetBrainsMonoNerdFontMono-Regular.ttf",
      "JetBrainsMonoNerdFontMono-Bold.ttf",
      "JetBrainsMonoNerdFontMono-Italic.ttf",
      "JetBrainsMonoNerdFontMono-BoldItalic.ttf",
    ],
  },
  {
    id: "fira-code",
    label: "FiraCode Nerd Font",
    description: "Ligature favorite",
    detail: "A popular coding font with readable ligatures and broad Nerd Font support.",
    fontFamily: "'FiraCode Nerd Font Mono', 'FiraCode Nerd Font', 'Fira Code', monospace",
    files: [
      "FiraCodeNerdFontMono-Regular.ttf",
      "FiraCodeNerdFontMono-Bold.ttf",
      "FiraCodeNerdFontMono-Medium.ttf",
      "FiraCodeNerdFontMono-SemiBold.ttf",
      "FiraCodeNerdFontMono-Light.ttf",
    ],
  },
  {
    id: "hack",
    label: "Hack Nerd Font",
    description: "Classic terminal feel",
    detail: "Highly legible, compact, and familiar for editor and terminal work.",
    fontFamily: "'Hack Nerd Font Mono', 'Hack Nerd Font', Hack, monospace",
    files: [
      "HackNerdFontMono-Regular.ttf",
      "HackNerdFontMono-Bold.ttf",
      "HackNerdFontMono-Italic.ttf",
      "HackNerdFontMono-BoldItalic.ttf",
    ],
  },
] satisfies RecommendedFont[];

let extensionUri: vscode.Uri | undefined;

export const initializeRecommendedFonts = (context: vscode.ExtensionContext): void => {
  extensionUri = context.extensionUri;
};

export const chooseRecommendedFont = async (): Promise<void> => {
  const font = await vscode.window.showQuickPick(
    fonts.map((value) => ({
      ...value,
      value,
    })),
    {
      title: `${product.displayName}: choose recommended font`,
      placeHolder: "Choose a bundled Nerd Font to install",
      matchOnDescription: true,
      matchOnDetail: true,
    },
  );
  if (!font) return;

  await installFont(font.value);
  await vscode.env.clipboard.writeText(font.value.fontFamily);

  const action = await vscode.window.showInformationMessage(
    `${font.value.label} installed. Font family copied for editor.fontFamily.`,
    "Open Font Settings",
  );
  if (action === "Open Font Settings") {
    await vscode.commands.executeCommand("workbench.action.openSettings", "editor.fontFamily");
  }
};

const installFont = async (font: RecommendedFont): Promise<void> => {
  if (!extensionUri) throw new Error(`${product.displayName} fonts were used before activation.`);

  const targetDir = userFontDir();
  await mkdir(targetDir, { recursive: true });

  await Promise.all(
    font.files.map(async (file) => {
      const source = vscode.Uri.joinPath(extensionUri!, "assets", "fonts", font.id, file).fsPath;
      await copyFile(source, join(targetDir, basename(file)));
    }),
  );
};

const userFontDir = (): string => {
  const home = homedir();

  if (process.platform === "darwin") return join(home, "Library", "Fonts");
  if (process.platform === "win32")
    return join(process.env.LOCALAPPDATA ?? home, "Microsoft", "Windows", "Fonts");
  return join(home, ".local", "share", "fonts");
};
