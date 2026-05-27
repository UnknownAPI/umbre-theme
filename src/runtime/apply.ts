import { isUmbreThemeConfigured } from "@/runtime/active-theme.ts";
import {
  defaultSettings,
  hasStoredSettings,
  readSettings,
  updateSettings,
  type UmbreSettings,
} from "@/runtime/settings.ts";
import { copyVariantToTheme, initializeThemeFiles } from "@/runtime/theme-files.ts";
import { themeLabel } from "@/theme/naming.ts";
import type * as vscode from "vscode";

let applyingSettings = false;
let applyGeneration = 0;
let latestApplyRequest = 0;
let applyQueue: Promise<unknown> = Promise.resolve();

export const initializeThemeApplication = (context: vscode.ExtensionContext): void => {
  initializeThemeFiles(context);
};

export const isApplyingSettings = (): boolean => applyingSettings;

export const applySettings = (settings: UmbreSettings = readSettings()): Promise<string> => {
  const request = ++latestApplyRequest;
  const next = applyQueue.then(() => {
    if (request !== latestApplyRequest) return themeLabel(settings.mode);
    return applySettingsNow(settings);
  });
  applyQueue = next.catch(() => undefined);
  return next;
};

export const applySettingsIfActive = async (): Promise<void> => {
  if (!isActiveUmbreTheme()) return;

  const stored = hasStoredSettings();
  const settings = stored ? readSettings() : defaultSettings();
  if (!stored) await updateSettings(settings);
  await applySettings(settings);
};

const applySettingsNow = async (settings: UmbreSettings): Promise<string> => {
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

const copySettingsToActiveTheme = async (settings: UmbreSettings): Promise<void> => {
  await copyVariantToTheme(settings);
};

const isActiveUmbreTheme = (): boolean => isUmbreThemeConfigured();
