import { commandIds } from "@/product.ts";
import { applySettingsIfActive, initializeThemeApplication } from "@/runtime/apply.ts";
import { registerCommands } from "@/runtime/commands.ts";
import { suggestSymbolsIconTheme } from "@/runtime/icon-theme-recommendation.ts";
import { initializeSettings } from "@/runtime/settings.ts";
import { initializeSystemAppearanceSync } from "@/runtime/system-appearance.ts";
import { applySelectedUmbreTheme, isThemeSelectionChange } from "@/runtime/theme-selection.ts";
import * as vscode from "vscode";

export const activate = (context: vscode.ExtensionContext): void => {
  initializeSettings(context);
  initializeThemeApplication(context);
  registerCommands(context);
  void applySettingsIfActive();
  initializeSystemAppearanceSync(context);
  suggestSymbolsIconTheme(context);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (isThemeSelectionChange(event)) void applyAndConfigureSelectedTheme();
    }),
  );
};

const applyAndConfigureSelectedTheme = async (): Promise<void> => {
  const result = await applySelectedUmbreTheme();
  if (result.applied && result.shouldConfigure) await vscode.commands.executeCommand(commandIds.configure);
};

export const deactivate = (): void => undefined;
