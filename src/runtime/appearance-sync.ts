import { execFile } from "node:child_process";
import { promisify } from "node:util";

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
import { themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

const execFileAsync = promisify(execFile);
const pollIntervalMs = 2000;

let suspended = false;
let syncing = false;
let lastSystemMode: Mode | undefined;

export const setAppearanceSyncSuspended = (value: boolean): void => {
  suspended = value;
};

export const initializeAppearanceSync = (context: vscode.ExtensionContext): void => {
  void rememberSystemMode();

  const interval = setInterval(() => {
    void syncSystemAppearance();
  }, pollIntervalMs);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("workbench.colorTheme")) void syncActiveUmbreTheme();
    }),
    vscode.window.onDidChangeActiveColorTheme(() => {
      void syncActiveUmbreTheme();
    }),
    {
      dispose: () => {
        clearInterval(interval);
      },
    },
  );
};

const syncActiveUmbreTheme = async (): Promise<void> => {
  const activeMode = activeUmbreMode();
  if (!activeMode) return;
  await syncToMode(activeMode);
};

const syncSystemAppearance = async (): Promise<void> => {
  if (suspended || syncing || !hasStoredSettings() || !readSettings().systemAware) return;
  if (!activeUmbreMode()) return;

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

const activeUmbreMode = (): Mode | undefined => {
  const theme = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  return themeModeFromLabel(theme);
};

const detectSystemMode = async (): Promise<Mode | undefined> => {
  if (process.platform === "darwin") return detectMacosMode();
  if (process.platform === "win32") return detectWindowsMode();
  return undefined;
};

const detectMacosMode = async (): Promise<Mode> => {
  try {
    const { stdout } = await execFileAsync("defaults", ["read", "-g", "AppleInterfaceStyle"]);
    return stdout.trim() === "Dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

const detectWindowsMode = async (): Promise<Mode | undefined> => {
  try {
    const { stdout } = await execFileAsync("reg", [
      "query",
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize",
      "/v",
      "AppsUseLightTheme",
    ]);
    return /AppsUseLightTheme\s+REG_DWORD\s+0x0/i.test(stdout) ? "dark" : "light";
  } catch {
    return undefined;
  }
};

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
