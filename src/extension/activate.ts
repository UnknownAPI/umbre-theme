import { commandIds } from "@/product.ts";
import { initializeAppearanceSync } from "@/runtime/appearance-sync.ts";
import { initializeThemeApplication } from "@/runtime/apply.ts";
import { registerCommands } from "@/runtime/commands.ts";
import { initializeRecommendedFonts } from "@/runtime/fonts.ts";
import { initializeSettings } from "@/runtime/settings.ts";
import * as vscode from "vscode";

export const activate = (context: vscode.ExtensionContext): void => {
  initializeSettings(context);
  initializeThemeApplication(context);
  initializeRecommendedFonts(context);
  registerCommands(context);
  initializeAppearanceSync(context, {
    onThemeSelected: () => vscode.commands.executeCommand(commandIds.configure, { target: "firstRun" }),
  });
};

export const deactivate = (): void => undefined;
