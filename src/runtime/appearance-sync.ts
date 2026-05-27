import type { Mode } from "@/config.ts";
import {
  affectsUmbreThemeConfiguration,
  configuredUmbreThemeMode,
  isUmbreThemeConfigured,
} from "@/runtime/active-theme.ts";
import { applySettings, isApplyingSettings } from "@/runtime/apply.ts";
import { oppositeSettings } from "@/runtime/opposite-settings.ts";
import {
  defaultSettings,
  hasStoredSettings,
  readSettings,
  sameSettings,
  updateSettings,
  type UmbreSettings,
} from "@/runtime/settings.ts";
import { detectSystemMode } from "@/runtime/system-mode.ts";
import * as vscode from "vscode";

const pollIntervalMs = 2000;
const activeThemeContextKey = "umbre.active";

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
  void updateActiveThemeContext();
  void syncActiveUmbreTheme().then(() => {
    if (isUmbreThemeConfigured() && !hasStoredSettings()) void options.onThemeSelected?.();
  });

  const interval = setInterval(() => {
    void syncSystemAppearance();
  }, pollIntervalMs);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (!affectsUmbreThemeConfiguration(event)) return;
      void updateActiveThemeContext();
      if (!isUmbreThemeConfigured()) return;

      void syncActiveUmbreTheme().then(() => {
        if (!hasStoredSettings()) void options.onThemeSelected?.();
      });
    }),
    {
      dispose: () => {
        clearInterval(interval);
      },
    },
  );
};

const syncActiveUmbreTheme = async (): Promise<void> => {
  if (!isUmbreThemeConfigured()) return;
  await syncToMode(activeThemeMode() ?? readSettings().mode);
};

const syncSystemAppearance = async (): Promise<void> => {
  if (suspended || syncing || isApplyingSettings() || !hasStoredSettings() || !readSettings().systemAware)
    return;
  if (!isUmbreThemeConfigured()) return;

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
    if (hasStoredSettings()) await persistIfChanged(settings);
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

const updateActiveThemeContext = (): Thenable<void> => {
  return vscode.commands.executeCommand("setContext", activeThemeContextKey, isUmbreThemeConfigured());
};

const activeThemeMode = (): Mode | undefined => configuredUmbreThemeMode();
