import type { Mode } from "@/config.ts";
import { product } from "@/product.ts";
import { configuredUmbreThemeMode } from "@/runtime/active-theme.ts";
import type { UmbreSettings } from "@/runtime/settings.ts";
import { copyVariantToTheme, readThemeFile, writeThemeFile } from "@/runtime/theme-files.ts";
import * as vscode from "vscode";

type PreviewSnapshot = {
  activeMode?: Mode;
  themeFile: Uint8Array;
};

export type ThemePreview = {
  preview(settings: UmbreSettings): void;
  settle(): Promise<void>;
  finish(settings: UmbreSettings): Promise<void>;
  cancel(): Promise<void>;
};

export const createThemePreview = async (): Promise<ThemePreview> => {
  const snapshot = await captureSnapshot();
  let request = 0;
  let queue: Promise<void> = Promise.resolve();
  let lastKey = "";
  let previewErrorShown = false;

  const preview = (settings: UmbreSettings): void => {
    const key = previewKey(snapshot, settings);
    if (key === lastKey) return;
    lastKey = key;
    const currentRequest = ++request;

    queue = queue
      .then(async () => {
        if (currentRequest !== request) return;
        await copyVariantToTheme(settings);
      })
      .catch(async (error: unknown) => {
        if (previewErrorShown) return;
        previewErrorShown = true;
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.setStatusBarMessage(`Unable to preview ${product.displayName} theme: ${message}`, 7000);
      });
  };

  const settle = async (): Promise<void> => {
    request += 1;
    await queue.catch(() => undefined);
  };

  const finish = async (_settings: UmbreSettings): Promise<void> => {
    await settle();
  };

  const cancel = async (): Promise<void> => {
    await settle();
    await restoreThemeFiles(snapshot);
  };

  return { preview, settle, finish, cancel };
};

const captureSnapshot = async (): Promise<PreviewSnapshot> => {
  const themeFile = await readThemeFile();
  const activeMode = configuredUmbreThemeMode();

  return {
    ...(activeMode ? { activeMode } : {}),
    themeFile,
  };
};

const restoreThemeFiles = async (snapshot: PreviewSnapshot): Promise<void> => {
  await writeThemeFile(snapshot.themeFile);
};

const previewTargetMode = (snapshot: PreviewSnapshot, settings: UmbreSettings): Mode => {
  return snapshot.activeMode ?? settings.mode;
};

const previewKey = (snapshot: PreviewSnapshot, settings: UmbreSettings): string =>
  [
    previewTargetMode(snapshot, settings),
    settings.mode,
    settings.shade.id,
    settings.accent,
    settings.dim.id,
    settings.panels.id,
    settings.terminal.id,
    settings.borders.id,
    settings.syntaxVariant.id,
  ].join(":");
