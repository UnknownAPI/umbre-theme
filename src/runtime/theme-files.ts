import type { Mode } from "@/config.ts";
import type { UmbraSettings } from "@/runtime/settings.ts";
import { createThemeDocumentFromInput } from "@/theme/create-theme.ts";
import { themeFileName, themeLabel } from "@/theme/naming.ts";
import { stringifyJson } from "@/utils/json.ts";
import * as vscode from "vscode";

let extensionUri: vscode.Uri | undefined;

export const initializeThemeFiles = (context: vscode.ExtensionContext): void => {
  extensionUri = context.extensionUri;
};

export const copyVariantToTheme = async (
  settings: UmbraSettings,
  targetMode: Mode = settings.mode,
): Promise<void> => {
  await writeThemeFile(targetMode, encodeTheme(settings));
};

export const readThemeFile = async (mode: Mode): Promise<Uint8Array> => {
  return vscode.workspace.fs.readFile(themeUri(mode));
};

export const writeThemeFile = async (mode: Mode, content: Uint8Array): Promise<void> => {
  const uri = themeUri(mode);
  if (await fileContentEquals(uri, content)) return;

  await vscode.workspace.fs.writeFile(uri, content);
};

const encodeTheme = (settings: UmbraSettings): Uint8Array => {
  const document = createThemeDocumentFromInput(themeLabel(settings.mode), {
    mode: settings.mode,
    shade: settings.shade,
    accent: settings.accent,
    dim: settings.dim,
    borders: settings.borders,
  });

  return Buffer.from(stringifyJson(document));
};

const themeUri = (mode: Mode): vscode.Uri => {
  return vscode.Uri.joinPath(themesUri(), themeFileName(mode));
};

const themesUri = (): vscode.Uri => {
  if (!extensionUri) throw new Error("Umbra theme files were used before activation.");
  return vscode.Uri.joinPath(extensionUri, "themes");
};

const fileContentEquals = async (uri: vscode.Uri, content: Uint8Array): Promise<boolean> => {
  try {
    const existing = await vscode.workspace.fs.readFile(uri);
    return Buffer.compare(Buffer.from(existing), Buffer.from(content)) === 0;
  } catch {
    return false;
  }
};
