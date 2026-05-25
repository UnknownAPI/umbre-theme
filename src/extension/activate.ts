import { applySettingsIfActive, initializeThemeApplication } from "@/runtime/apply.ts";
import { registerCommands } from "@/runtime/commands.ts";
import { initializeSettings } from "@/runtime/settings.ts";
import { applySelectedUmbraTheme, isThemeSelectionChange } from "@/runtime/theme-selection.ts";
import * as vscode from "vscode";

export const activate = (context: vscode.ExtensionContext): void => {
  initializeSettings(context);
  initializeThemeApplication(context);
  registerCommands(context);
  void applySettingsIfActive();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (isThemeSelectionChange(event)) void applySelectedUmbraTheme();
    }),
  );
};

export const deactivate = (): void => undefined;
