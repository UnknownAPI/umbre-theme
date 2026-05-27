import type { Mode } from "@/config.ts";
import { isThemeLabel, themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

const themeConfigurationKeys = [
  "workbench.colorTheme",
  "workbench.preferredDarkColorTheme",
  "workbench.preferredLightColorTheme",
] as const;

export const isUmbreThemeConfigured = (): boolean =>
  workbenchThemeLabels().some((label) => isThemeLabel(label));

export const configuredUmbreThemeMode = (): Mode | undefined => {
  const [colorTheme, preferredDark, preferredLight] = workbenchThemeLabels();
  return (
    themeModeFromLabel(colorTheme) ??
    (isThemeLabel(preferredDark) ? "dark" : undefined) ??
    (isThemeLabel(preferredLight) ? "light" : undefined)
  );
};

export const affectsUmbreThemeConfiguration = (event: vscode.ConfigurationChangeEvent): boolean =>
  themeConfigurationKeys.some((key) => event.affectsConfiguration(key));

const workbenchThemeLabels = (): [string, string, string] => {
  const workbench = vscode.workspace.getConfiguration("workbench");
  return [
    workbench.get<string>("colorTheme", ""),
    workbench.get<string>("preferredDarkColorTheme", ""),
    workbench.get<string>("preferredLightColorTheme", ""),
  ];
};
