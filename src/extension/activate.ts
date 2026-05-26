import { initializeAppearanceSync } from "@/runtime/appearance-sync.ts";
import { initializeThemeApplication } from "@/runtime/apply.ts";
import { registerCommands } from "@/runtime/commands.ts";
import { suggestSymbolsIconTheme } from "@/runtime/icon-theme-recommendation.ts";
import { initializeSettings } from "@/runtime/settings.ts";
import * as vscode from "vscode";

export const activate = (context: vscode.ExtensionContext): void => {
  initializeSettings(context);
  initializeThemeApplication(context);
  registerCommands(context);
  initializeAppearanceSync(context);
  suggestSymbolsIconTheme(context);
};

export const deactivate = (): void => undefined;
