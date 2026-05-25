import { defaultShadeForMode } from "@/config.ts";
import { applySettings } from "@/runtime/apply.ts";
import { pickSettings } from "@/runtime/picker.ts";
import { createThemePreview } from "@/runtime/preview.ts";
import { readSettings, updateSettings, type UmbraSettings } from "@/runtime/settings.ts";
import { themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

export const registerCommands = (context: vscode.ExtensionContext): void => {
  context.subscriptions.push(
    vscode.commands.registerCommand("umbra.configure", configureTheme),
    vscode.commands.registerCommand("umbra.toggleMode", toggleMode),
  );
};

const configureTheme = async (): Promise<void> => {
  const activeMode = currentColorThemeMode();
  const preview = await createThemePreview();
  let picked: UmbraSettings | undefined;
  let previewFinished = false;

  try {
    picked = await pickSettings(readSettings(), preview.preview);
    if (!picked) return;

    await preview.finish(picked);
    previewFinished = true;
  } finally {
    if (!previewFinished) await preview.cancel();
  }

  await updateSettings(picked);
  const label = await applySettings(picked);
  await showAppliedMessage(label, activeMode, picked.mode);
};

const toggleMode = async (): Promise<void> => {
  const current = readSettings();
  const mode = current.mode === "dark" ? "light" : "dark";
  const next: UmbraSettings = {
    ...current,
    mode,
    shade: defaultShadeForMode(mode),
  };

  await updateSettings(next);
  const label = await applySettings(next);
  await showAppliedMessage(label, currentColorThemeMode(), next.mode);
};

const currentColorThemeMode = () => {
  const theme = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  return themeModeFromLabel(theme);
};

const showAppliedMessage = async (
  label: string,
  activeMode: UmbraSettings["mode"] | undefined,
  appliedMode: UmbraSettings["mode"],
): Promise<void> => {
  if (activeMode === appliedMode) {
    await vscode.window.showInformationMessage(`Umbra theme applied: ${label}`);
    return;
  }

  await vscode.window.showInformationMessage(
    `Umbra configured: ${label}. Select ${label} in Preferences: Color Theme to switch modes.`,
  );
};
