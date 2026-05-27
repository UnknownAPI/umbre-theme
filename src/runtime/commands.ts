import { commandIds, product } from "@/product.ts";
import { isUmbreThemeConfigured } from "@/runtime/active-theme.ts";
import { setAppearanceSyncSuspended } from "@/runtime/appearance-sync.ts";
import { applySettings } from "@/runtime/apply.ts";
import { chooseRecommendedFont } from "@/runtime/fonts.ts";
import { suggestSymbolsIconTheme } from "@/runtime/icon-theme-recommendation.ts";
import { oppositeSettings } from "@/runtime/opposite-settings.ts";
import { pickSettings } from "@/runtime/picker.ts";
import { createThemePreview } from "@/runtime/preview.ts";
import { hasStoredSettings, readSettings, updateSettings, type UmbreSettings } from "@/runtime/settings.ts";
import { detectSystemMode } from "@/runtime/system-mode.ts";
import * as vscode from "vscode";

export const registerCommands = (context: vscode.ExtensionContext): void => {
  context.subscriptions.push(
    vscode.commands.registerCommand(commandIds.configure, (options?: ConfigureThemeOptions) =>
      configureTheme(context, options),
    ),
    vscode.commands.registerCommand(commandIds.toggleOpposite, toggleOppositeTheme),
    vscode.commands.registerCommand(commandIds.chooseFont, chooseFont),
  );
};

type ConfigureThemeOptions = {
  target?: "all" | "recommended" | "firstRun";
};

let configuringTheme = false;

const configureTheme = async (
  context: vscode.ExtensionContext,
  options: ConfigureThemeOptions = {},
): Promise<void> => {
  if (configuringTheme) return;
  configuringTheme = true;
  if (!(await ensureActiveUmbreTheme())) {
    configuringTheme = false;
    return;
  }
  const target = await configurationTarget(options);
  if (target === "cancel") {
    configuringTheme = false;
    return;
  }

  const wasActiveTheme = isActiveUmbreTheme();
  let preview: Awaited<ReturnType<typeof createThemePreview>> | undefined;
  let picked: UmbreSettings | undefined;
  let previewFinished = false;

  setAppearanceSyncSuspended(true);
  try {
    preview = await createThemePreview();
    const current = readSettings();
    picked = await pickSettings(current, preview.preview, target ?? undefined);
    if (!picked) return;

    await preview.finish(picked);
    previewFinished = true;
    await updateSettings(picked);
    const label = await applySettings(picked);
    await showAppliedMessage(label, wasActiveTheme);
    await suggestSymbolsIconTheme(context);
  } finally {
    if (preview && !previewFinished) await preview.cancel();
    setAppearanceSyncSuspended(false);
    configuringTheme = false;
  }
};

const configurationTarget = async (
  options: ConfigureThemeOptions,
): Promise<"all" | "recommended" | "cancel" | undefined> => {
  if (options.target === "all" || options.target === "recommended") return options.target;
  if (options.target !== "firstRun") return undefined;
  if (hasStoredSettings()) return "cancel";

  const action = await vscode.window.showQuickPick(
    [
      {
        label: "Use Preset",
        description: "Light, Balanced, or Pure black",
        detail: "Choose one of the built-in Umbre presets.",
        value: "recommended" as const,
      },
      {
        label: "Configure",
        description: "Guided setup",
        detail: "Step through all Umbre theme controls.",
        value: "all" as const,
      },
      {
        label: "Not now",
        description: "Skip setup",
        detail: "You can run Umbre: Configure Theme any time.",
        value: "cancel" as const,
      },
    ],
    {
      title: `${product.displayName}: setup`,
      placeHolder: "Choose how to set up Umbre",
      matchOnDescription: true,
      matchOnDetail: true,
    },
  );

  return action?.value ?? "cancel";
};

const toggleOppositeTheme = async (): Promise<void> => {
  if (!(await ensureActiveUmbreTheme())) return;
  const wasActiveTheme = isActiveUmbreTheme();
  const current = readSettings();

  if (current.systemAware) {
    vscode.window.setStatusBarMessage(
      `${product.displayName} is following system appearance. Turn off system sync to toggle manually.`,
      5000,
    );
    return;
  }

  const action = await vscode.window.showQuickPick(
    [
      {
        label: "Toggle Manually",
        description: "Switch once",
        detail: "Jump to the matching light or dark opposite.",
        value: "manual" as const,
      },
      {
        label: "Follow System",
        description: "Sync automatically",
        detail: "Mirror your system light or dark appearance.",
        value: "system" as const,
      },
    ],
    {
      title: `${product.displayName}: toggle mode`,
      placeHolder: "Choose how Umbre should switch mode",
      matchOnDescription: true,
      matchOnDetail: true,
    },
  );
  if (!action) return;

  const settings = action.value === "system" ? await systemAwareSettings(current) : oppositeSettings(current);

  await updateSettings(settings);
  const label = await applySettings(settings);
  await showAppliedMessage(label, wasActiveTheme);
};

const chooseFont = async (): Promise<void> => {
  if (!(await ensureActiveUmbreTheme())) return;
  await chooseRecommendedFont();
};

const systemAwareSettings = async (current: UmbreSettings): Promise<UmbreSettings> => {
  const mode = (await detectSystemMode()) ?? current.mode;
  if (current.mode === mode) return { ...current, systemAware: true };
  return { ...oppositeSettings(current), mode, systemAware: true };
};

const ensureActiveUmbreTheme = async (): Promise<boolean> => {
  if (isUmbreThemeConfigured()) return true;

  vscode.window.setStatusBarMessage(
    `${product.displayName} settings are available after you select the ${product.displayName} theme.`,
    5000,
  );
  await vscode.commands.executeCommand("workbench.action.selectTheme");
  return false;
};

const isActiveUmbreTheme = (): boolean => isUmbreThemeConfigured();

const showAppliedMessage = async (label: string, wasActiveTheme: boolean): Promise<void> => {
  if (wasActiveTheme) {
    vscode.window.setStatusBarMessage(`${product.displayName} theme applied: ${label}`, 5000);
    return;
  }

  vscode.window.setStatusBarMessage(
    `${product.displayName} configured: ${label}. Select ${label} in Preferences: Color Theme.`,
    7000,
  );
};
