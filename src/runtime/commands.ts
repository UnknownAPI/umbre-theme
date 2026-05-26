import { commandIds, product } from "@/product.ts";
import { setAppearanceSyncSuspended } from "@/runtime/appearance-sync.ts";
import { applySettings } from "@/runtime/apply.ts";
import { oppositeSettings } from "@/runtime/opposite-settings.ts";
import { pickSettings } from "@/runtime/picker.ts";
import { createThemePreview } from "@/runtime/preview.ts";
import { readSettings, updateSettings, type UmbreSettings } from "@/runtime/settings.ts";
import { themeModeFromLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

export const registerCommands = (context: vscode.ExtensionContext): void => {
  context.subscriptions.push(
    vscode.commands.registerCommand(commandIds.configure, configureTheme),
    vscode.commands.registerCommand(commandIds.toggleOpposite, toggleOppositeTheme),
  );
};

const configureTheme = async (): Promise<void> => {
  const activeMode = currentColorThemeMode();
  let preview: Awaited<ReturnType<typeof createThemePreview>> | undefined;
  let picked: UmbreSettings | undefined;
  let previewFinished = false;

  setAppearanceSyncSuspended(true);
  try {
    preview = await createThemePreview();
    picked = await pickSettings(readSettings(), preview.preview);
    if (!picked) return;

    await preview.finish(picked);
    previewFinished = true;
    await updateSettings(picked);
    const label = await applySettings(picked);
    await showAppliedMessage(label, activeMode, picked.mode);
  } finally {
    if (preview && !previewFinished) await preview.cancel();
    setAppearanceSyncSuspended(false);
  }
};

const toggleOppositeTheme = async (): Promise<void> => {
  const activeMode = currentColorThemeMode();
  const settings = oppositeSettings(readSettings());

  await updateSettings(settings);
  const label = await applySettings(settings);
  await showAppliedMessage(label, activeMode, settings.mode);
};

const currentColorThemeMode = () => {
  const theme = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  return themeModeFromLabel(theme);
};

const showAppliedMessage = async (
  label: string,
  activeMode: UmbreSettings["mode"] | undefined,
  appliedMode: UmbreSettings["mode"],
): Promise<void> => {
  if (activeMode === appliedMode) {
    await vscode.window.showInformationMessage(`${product.displayName} theme applied: ${label}`);
    return;
  }

  await vscode.window.showInformationMessage(
    `${product.displayName} configured: ${label}. Select ${label} in Preferences: Color Theme to switch modes.`,
  );
};
