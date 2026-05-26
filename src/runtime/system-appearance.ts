import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { Mode } from "@/config.ts";
import { applySettings } from "@/runtime/apply.ts";
import { oppositeSettings } from "@/runtime/opposite-settings.ts";
import { hasStoredSettings, readSettings, updateSettings } from "@/runtime/settings.ts";
import { themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

const execFileAsync = promisify(execFile);
const pollIntervalMs = 2000;

let latestSystemMode: Mode | undefined;
let applyingSystemMode = false;
let suspended = false;

export const setSystemAppearanceSyncSuspended = (value: boolean): void => {
  suspended = value;
};

export const initializeSystemAppearanceSync = (context: vscode.ExtensionContext): void => {
  void syncSystemAppearance({ initialize: true });

  const interval = setInterval(() => {
    void syncSystemAppearance();
  }, pollIntervalMs);

  context.subscriptions.push({
    dispose: () => {
      clearInterval(interval);
    },
  });
};

const syncSystemAppearance = async (options: { initialize?: boolean } = {}): Promise<void> => {
  if (suspended || applyingSystemMode) return;
  if (!activeUmbreMode()) return;

  const systemMode = await detectSystemMode();
  if (!systemMode) return;

  if (options.initialize) {
    latestSystemMode = systemMode;
    return;
  }

  if (!hasStoredSettings()) return;

  const current = readSettings();
  if (!current.systemAware) return;
  if (systemMode === latestSystemMode) return;
  latestSystemMode = systemMode;
  if (current.mode === systemMode) return;

  applyingSystemMode = true;
  try {
    const settings = { ...oppositeSettings(current), mode: systemMode };
    await updateSettings(settings);
    await applySettings(settings);
  } finally {
    applyingSystemMode = false;
  }
};

const activeUmbreMode = (): Mode | undefined => {
  const activeTheme = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  return themeModeFromLabel(activeTheme);
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
