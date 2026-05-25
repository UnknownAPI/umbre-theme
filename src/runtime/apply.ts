import {
  defaultSettings,
  hasStoredSettings,
  readSettings,
  updateSettings,
  type UmbraSettings,
} from "@/runtime/settings.ts";
import { copyVariantToTheme, initializeThemeFiles } from "@/runtime/theme-files.ts";
import { themeLabel, themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

let applyingSettings = false;
let applyGeneration = 0;
let latestApplyRequest = 0;
let applyQueue: Promise<unknown> = Promise.resolve();

export const initializeThemeApplication = (context: vscode.ExtensionContext): void => {
  initializeThemeFiles(context);
};

export const isApplyingSettings = (): boolean => applyingSettings;

export const applySettings = (settings: UmbraSettings = readSettings()): Promise<string> => {
  const request = ++latestApplyRequest;
  const next = applyQueue.then(() => {
    if (request !== latestApplyRequest) return themeLabel(settings.mode);
    return applySettingsNow(settings);
  });
  applyQueue = next.catch(() => undefined);
  return next;
};

export const applySettingsIfActive = async (): Promise<void> => {
  const mode = activeUmbraMode();
  if (!mode) return;

  const stored = hasStoredSettings();
  const settings = stored ? readSettings() : defaultSettings(mode);
  if (!stored) await updateSettings(settings);
  await applySettings(settings);
};

const applySettingsNow = async (settings: UmbraSettings): Promise<string> => {
  const label = themeLabel(settings.mode);
  const generation = ++applyGeneration;

  applyingSettings = true;
  try {
    await copySettingsToActiveTheme(settings);
  } finally {
    setTimeout(() => {
      if (applyGeneration === generation) applyingSettings = false;
    }, 500);
  }

  return label;
};

const copySettingsToActiveTheme = async (settings: UmbraSettings): Promise<void> => {
  const activeMode = activeUmbraMode();
  const targetModes = new Set<UmbraSettings["mode"]>([settings.mode]);
  if (activeMode) targetModes.add(activeMode);

  await Promise.all([...targetModes].map((mode) => copyVariantToTheme(settings, mode)));
};

const activeUmbraMode = () => {
  const activeTheme = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  return themeModeFromLabel(activeTheme);
};
