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

type FontPick = vscode.QuickPickItem & {
  value?: RecommendedFont;
  skip?: boolean;
};

type FontOptions = {
  allowSkip?: boolean;
};

type FontSnapshot = {
  globalValue: string | undefined;
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

export const chooseRecommendedFont = async (options: FontOptions = {}): Promise<void> => {
  await installAllFonts();

  const snapshot = captureFontSnapshot();
  const picked = await pickFont(snapshot, options);

  if (!picked?.value) {
    await restoreFontSnapshot(snapshot);
    return;
  }

  await applyFont(picked.value.fontFamily);
  await vscode.env.clipboard.writeText(picked.value.fontFamily);
  await vscode.window.showInformationMessage(`${picked.value.label} applied. Font family copied.`);
};

const pickFont = async (snapshot: FontSnapshot, options: FontOptions): Promise<FontPick | undefined> => {
  const picker = vscode.window.createQuickPick<FontPick>();
  picker.title = `${product.displayName}: choose recommended font`;
  picker.placeholder = "Preview a bundled Nerd Font, or keep your current font";
  picker.ignoreFocusOut = true;
  picker.matchOnDescription = true;
  picker.matchOnDetail = true;
  picker.items = fontItems(options);
  const firstItem = picker.items[0];
  if (firstItem) picker.activeItems = [firstItem];

  return new Promise((resolve) => {
    let settled = false;
    let previewQueue: Promise<unknown> = Promise.resolve();

    const preview = (item: FontPick | undefined): void => {
      previewQueue = previewQueue.then(() => previewFont(snapshot, item)).catch(showFontError);
    };

    const done = (value: FontPick | undefined): void => {
      if (settled) return;
      settled = true;
      picker.dispose();
      resolve(value);
    };

    picker.onDidChangeActive(([item]) => {
      preview(item);
    });
    picker.onDidAccept(() => {
      previewQueue.finally(() => {
        const [item] = picker.activeItems;
        done(item);
      });
    });
    picker.onDidHide(() => {
      previewQueue.finally(() => {
        done(undefined);
      });
    });

    picker.show();
    preview(picker.activeItems[0]);
  });
};

const previewFont = async (snapshot: FontSnapshot, item: FontPick | undefined): Promise<void> => {
  if (item?.value) {
    await applyFont(item.value.fontFamily);
    return;
  }

  await restoreFontSnapshot(snapshot);
};

const fontItems = (options: FontOptions): FontPick[] => {
  const items = fonts.map((value) => ({
    ...value,
    value,
  }));

  return options.allowSkip
    ? [
        ...items,
        {
          label: "Skip",
          description: "Keep existing font settings",
          detail: "Restore the font you had before opening this picker.",
          skip: true,
        },
      ]
    : items;
};

const captureFontSnapshot = (): FontSnapshot => {
  const inspected = vscode.workspace.getConfiguration("editor").inspect<string>("fontFamily");
  return { globalValue: inspected?.globalValue };
};

const restoreFontSnapshot = (snapshot: FontSnapshot): Thenable<void> => applyFont(snapshot.globalValue);

const applyFont = (fontFamily: string | undefined): Thenable<void> => {
  return vscode.workspace
    .getConfiguration("editor")
    .update("fontFamily", fontFamily, vscode.ConfigurationTarget.Global);
};

const installAllFonts = async (): Promise<void> => {
  await Promise.all(fonts.map((font) => installFont(font)));
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

const showFontError = async (error: unknown): Promise<void> => {
  const message = error instanceof Error ? error.message : String(error);
  await vscode.window.showErrorMessage(`Unable to apply ${product.displayName} font: ${message}`);
};
