import { product } from "@/product.ts";
import type { UmbreSettings } from "@/runtime/settings.ts";
import { createThemeDocumentFromInput } from "@/theme/create-theme.ts";
import { themeFileName, themeLabel } from "@/theme/naming.ts";
import { stringifyJson } from "@/utils/json.ts";
import * as vscode from "vscode";

let extensionUri: vscode.Uri | undefined;

export const initializeThemeFiles = (context: vscode.ExtensionContext): void => {
  extensionUri = context.extensionUri;
};

export const copyVariantToTheme = async (settings: UmbreSettings): Promise<void> => {
  await writeThemeFile(encodeTheme(settings));
};

export const readThemeFile = async (): Promise<Uint8Array> => {
  return vscode.workspace.fs.readFile(themeUri());
};

export const writeThemeFile = async (content: Uint8Array): Promise<void> => {
  const uri = themeUri();
  if (await fileContentEquals(uri, content)) return;

  await vscode.workspace.fs.writeFile(uri, content);
};

const encodeTheme = (settings: UmbreSettings): Uint8Array => {
  const document = createThemeDocumentFromInput(themeLabel(settings.mode), {
    mode: settings.mode,
    shade: settings.shade,
    accent: settings.accent,
    dim: settings.dim,
    panels: settings.panels,
    terminal: settings.terminal,
    borders: settings.borders,
    syntaxVariant: settings.syntaxVariant,
  });

  return Buffer.from(stringifyJson(document));
};

const themeUri = (): vscode.Uri => {
  if (!extensionUri) throw new Error(`${product.displayName} theme files were used before activation.`);
  return vscode.Uri.joinPath(extensionUri, themeFileName());
};

const fileContentEquals = async (uri: vscode.Uri, content: Uint8Array): Promise<boolean> => {
  try {
    const existing = await vscode.workspace.fs.readFile(uri);
    return Buffer.compare(Buffer.from(existing), Buffer.from(content)) === 0;
  } catch {
    return false;
  }
};
