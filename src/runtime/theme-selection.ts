import { defaultShadeForMode } from "@/config.ts";
import { applySettings, isApplyingSettings } from "@/runtime/apply.ts";
import { readSettings, updateSettings } from "@/runtime/settings.ts";
import { themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

export const applySelectedUmbraTheme = async (): Promise<void> => {
  if (isApplyingSettings()) return;

  const mode = selectedUmbraMode();
  if (!mode) return;

  const current = readSettings();
  const settings = {
    ...current,
    mode,
    shade: current.mode === mode ? current.shade : defaultShadeForMode(mode),
  };
  await updateSettings(settings);
  await applySettings(settings);
};

export const isThemeSelectionChange = (event: vscode.ConfigurationChangeEvent): boolean => {
  return event.affectsConfiguration("workbench.colorTheme");
};

const selectedUmbraMode = () => {
  const theme = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  return themeModeFromLabel(theme);
};
