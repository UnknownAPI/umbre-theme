import { product } from "@/product.ts";
import * as vscode from "vscode";

const installAction = `Install ${product.recommendedExtensions.symbols.name}`;
const chooseAction = "Choose Icon Theme";
const dismissAction = "Not now";

export const suggestSymbolsIconTheme = async (context: vscode.ExtensionContext): Promise<void> => {
  if (context.globalState.get<boolean>(product.recommendedExtensions.symbols.promptStorageKey)) return;
  if (activeIconTheme() === product.recommendedExtensions.symbols.iconThemeId) return;

  if (!isSymbolsInstalled()) {
    await suggestInstall(context);
    return;
  }

  await suggestChooseIconTheme(context);
};

const suggestInstall = async (context: vscode.ExtensionContext): Promise<void> => {
  const symbols = product.recommendedExtensions.symbols;
  const choice = await vscode.window.showQuickPick(
    [
      {
        label: installAction,
        description: "Recommended icon theme",
        detail: `${product.displayName} pairs well with ${symbols.name}, a simple file icon theme.`,
        value: "install" as const,
      },
      {
        label: dismissAction,
        description: "Skip Symbols",
        detail: "Keep your current file icon theme.",
        value: "dismiss" as const,
      },
    ],
    {
      title: `${product.displayName}: file icons`,
      placeHolder: `Install ${symbols.name} icon theme?`,
      matchOnDescription: true,
      matchOnDetail: true,
    },
  );

  if (choice?.value === "install") {
    await vscode.commands.executeCommand("workbench.extensions.installExtension", symbols.id, {
      justification: {
        reason: `${product.displayName} recommends ${symbols.name} as a matching file icon theme.`,
        action: installAction,
      },
    });
    await suggestChooseIconTheme(context);
    return;
  }

  if (choice?.value === "dismiss") await dismissPrompt(context);
};

const suggestChooseIconTheme = async (context: vscode.ExtensionContext): Promise<void> => {
  const symbols = product.recommendedExtensions.symbols;
  const choice = await vscode.window.showQuickPick(
    [
      {
        label: chooseAction,
        description: symbols.name,
        detail: `Open the icon theme picker and choose ${symbols.name}.`,
        value: "choose" as const,
      },
      {
        label: dismissAction,
        description: "Keep current icons",
        detail: "Leave your file icon theme unchanged.",
        value: "dismiss" as const,
      },
    ],
    {
      title: `${product.displayName}: file icons`,
      placeHolder: `Choose ${symbols.name} as your file icon theme?`,
      matchOnDescription: true,
      matchOnDetail: true,
    },
  );

  if (choice?.value === "choose") {
    await dismissPrompt(context);
    await vscode.commands.executeCommand("workbench.action.selectIconTheme");
    return;
  }

  if (choice?.value === "dismiss") await dismissPrompt(context);
};

const dismissPrompt = async (context: vscode.ExtensionContext): Promise<void> => {
  await context.globalState.update(product.recommendedExtensions.symbols.promptStorageKey, true);
};

const isSymbolsInstalled = (): boolean => {
  return vscode.extensions.getExtension(product.recommendedExtensions.symbols.id) !== undefined;
};

const activeIconTheme = (): string => {
  return vscode.workspace.getConfiguration("workbench").get<string>("iconTheme", "");
};
