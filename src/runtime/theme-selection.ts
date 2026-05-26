import { defaultShadeForMode, type Mode } from "@/config.ts";
import { applySettings, isApplyingSettings } from "@/runtime/apply.ts";
import { oppositeSettings } from "@/runtime/opposite-settings.ts";
import { hasStoredSettings, readSettings, updateSettings } from "@/runtime/settings.ts";
import { themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

export type ThemeSelectionResult = {
  applied: boolean;
  shouldConfigure: boolean;
};

export const applySelectedUmbreTheme = async (): Promise<ThemeSelectionResult> => {
  if (isApplyingSettings()) return { applied: false, shouldConfigure: false };

  const mode = selectedUmbreMode();
  if (!mode) return { applied: false, shouldConfigure: false };

  const stored = hasStoredSettings();
  const current = readSettings();
  const settings = selectedSettings(current, mode, stored);

  await updateSettings(settings);
  await applySettings(settings);

  return { applied: true, shouldConfigure: !stored };
};

export const isThemeSelectionChange = (event: vscode.ConfigurationChangeEvent): boolean => {
  return event.affectsConfiguration("workbench.colorTheme");
};

const selectedSettings = (
  current: ReturnType<typeof readSettings>,
  mode: Mode,
  stored: boolean,
): ReturnType<typeof readSettings> => {
  if (current.mode === mode) return current;
  if (stored) return { ...oppositeSettings(current), mode };

  return {
    ...current,
    mode,
    shade: defaultShadeForMode(mode),
  };
};

const selectedUmbreMode = () => {
  const theme = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  return themeModeFromLabel(theme);
};
