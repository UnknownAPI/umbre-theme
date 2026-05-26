import { commandIds, product } from "@/product.ts";
import { setAppearanceSyncSuspended } from "@/runtime/appearance-sync.ts";
import { applySettings } from "@/runtime/apply.ts";
import { chooseRecommendedFont } from "@/runtime/fonts.ts";
import { oppositeSettings } from "@/runtime/opposite-settings.ts";
import { pickSettings } from "@/runtime/picker.ts";
import { createThemePreview } from "@/runtime/preview.ts";
import { readSettings, updateSettings, type UmbreSettings } from "@/runtime/settings.ts";
import { detectSystemMode } from "@/runtime/system-mode.ts";
import { isThemeLabel } from "@/theme/naming.ts";
import * as vscode from "vscode";

export const registerCommands = (context: vscode.ExtensionContext): void => {
  context.subscriptions.push(
    vscode.commands.registerCommand(commandIds.configure, configureTheme),
    vscode.commands.registerCommand(commandIds.toggleOpposite, toggleOppositeTheme),
    vscode.commands.registerCommand(commandIds.chooseFont, chooseRecommendedFont),
  );
};

type ConfigureThemeOptions = {
  target?: "all";
};

const configureTheme = async (options: ConfigureThemeOptions = {}): Promise<void> => {
  const wasActiveTheme = isActiveUmbreTheme();
  let preview: Awaited<ReturnType<typeof createThemePreview>> | undefined;
  let picked: UmbreSettings | undefined;
  let previewFinished = false;

  setAppearanceSyncSuspended(true);
  try {
    preview = await createThemePreview();
    const current = readSettings();
    picked =
      options.target === "all"
        ? await pickSettings(current, preview.preview, "all")
        : await pickSettings(current, preview.preview);
    if (!picked) return;

    await preview.finish(picked);
    previewFinished = true;
    await updateSettings(picked);
    const label = await applySettings(picked);
    await showAppliedMessage(label, wasActiveTheme);
  } finally {
    if (preview && !previewFinished) await preview.cancel();
    setAppearanceSyncSuspended(false);
  }
};

const toggleOppositeTheme = async (): Promise<void> => {
  const wasActiveTheme = isActiveUmbreTheme();
  const current = readSettings();

  if (current.systemAware) {
    await vscode.window.showInformationMessage(
      `${product.displayName} is following system appearance. Turn off system sync to toggle manually.`,
    );
    return;
  }

  const action = await vscode.window.showInformationMessage(
    `${product.displayName} can follow your system appearance automatically, or toggle once manually.`,
    { modal: true },
    "Toggle Manually",
    "Follow System",
  );
  if (!action) return;

  const settings =
    action === "Follow System" ? await systemAwareSettings(current) : oppositeSettings(current);

  await updateSettings(settings);
  const label = await applySettings(settings);
  await showAppliedMessage(label, wasActiveTheme);
};

const systemAwareSettings = async (current: UmbreSettings): Promise<UmbreSettings> => {
  const mode = (await detectSystemMode()) ?? current.mode;
  if (current.mode === mode) return { ...current, systemAware: true };
  return { ...oppositeSettings(current), mode, systemAware: true };
};

const isActiveUmbreTheme = (): boolean => {
  const theme = vscode.workspace.getConfiguration("workbench").get<string>("colorTheme", "");
  return isThemeLabel(theme);
};

const showAppliedMessage = async (label: string, wasActiveTheme: boolean): Promise<void> => {
  if (wasActiveTheme) {
    await vscode.window.showInformationMessage(`${product.displayName} theme applied: ${label}`);
    return;
  }

  await vscode.window.showInformationMessage(
    `${product.displayName} configured: ${label}. Select ${label} in Preferences: Color Theme.`,
  );
};
