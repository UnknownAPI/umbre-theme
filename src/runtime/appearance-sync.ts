import type { Mode } from "@/config.ts";
import { applySettings, isApplyingSettings } from "@/runtime/apply.ts";
import { oppositeSettings } from "@/runtime/opposite-settings.ts";
import {
  defaultSettings,
  hasStoredSettings,
  readSettings,
  updateSettings,
  type UmbreSettings,
} from "@/runtime/settings.ts";
import { detectSystemMode } from "@/runtime/system-mode.ts";
import { isThemeLabel, themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

const pollIntervalMs = 2000;

let suspended = false;
let syncing = false;
let lastSystemMode: Mode | undefined;

export const setAppearanceSyncSuspended = (value: boolean): void => {
  suspended = value;
  if (!value) lastSystemMode = undefined;
};

export type AppearanceSyncOptions = {
  onThemeSelected?: () => void | Thenable<void>;
};

export const initializeAppearanceSync = (
  context: vscode.ExtensionContext,
  options: AppearanceSyncOptions = {},
): void => {
  void rememberSystemMode();
  void syncActiveUmbreTheme();

  const interval = setInterval(() => {
    void syncSystemAppearance();
  }, pollIntervalMs);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (!event.affectsConfiguration("workbench.colorTheme")) return;
      if (!isActiveUmbreTheme()) return;

      void syncActiveUmbreTheme();
      void options.onThemeSelected?.();
    }),
    {
      dispose: () => {
        clearInterval(interval);
      },
    },
  );
};

const syncActiveUmbreTheme = async (): Promise<void> => {
  if (!isActiveUmbreTheme()) return;
  await syncToMode(activeThemeMode() ?? readSettings().mode);
};

const syncSystemAppearance = async (): Promise<void> => {
  if (suspended || syncing || isApplyingSettings() || !hasStoredSettings() || !readSettings().systemAware)
    return;
  if (!isActiveUmbreTheme()) return;

  const systemMode = await detectSystemMode();
  if (!systemMode || suspended) return;

  if (systemMode === lastSystemMode) return;
  lastSystemMode = systemMode;

  await syncToMode(systemMode);
};

const syncToMode = async (mode: Mode): Promise<void> => {
  if (suspended || syncing || isApplyingSettings()) return;

  syncing = true;
  try {
    const settings = nextSettings(mode);
    await persistIfChanged(settings);
    await applySettings(settings);
  } finally {
    syncing = false;
  }
};

const nextSettings = (mode: Mode): UmbreSettings => {
  if (!hasStoredSettings()) return defaultSettings(mode);

  const current = readSettings();
  if (current.mode === mode) return current;
  if (!current.systemAware) return current;

  return { ...oppositeSettings(current), mode };
};

const persistIfChanged = async (settings: UmbreSettings): Promise<void> => {
  if (!hasStoredSettings() || !sameSettings(settings, readSettings())) await updateSettings(settings);
};

const rememberSystemMode = async (): Promise<void> => {
  lastSystemMode = await detectSystemMode();
};

const isActiveUmbreTheme = (): boolean => isThemeLabel(activeThemeLabel());

const activeThemeMode = (): Mode | undefined => themeModeFromLabel(activeThemeLabel());

const activeThemeLabel = (): string =>
  vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");

const sameSettings = (left: UmbreSettings, right: UmbreSettings): boolean => {
  return (
    left.mode === right.mode &&
    left.shade.id === right.shade.id &&
    left.accent === right.accent &&
    left.dim.id === right.dim.id &&
    left.panels.id === right.panels.id &&
    left.terminal.id === right.terminal.id &&
    left.borders.id === right.borders.id &&
    left.systemAware === right.systemAware
  );
};
