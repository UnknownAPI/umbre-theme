import * as vscode from "vscode";

export type QuickValueItem<Value> = vscode.QuickPickItem & {
  value: Value;
};

export const pickQuickValue = async <Value>(
  items: QuickValueItem<Value>[],
  options: vscode.QuickPickOptions,
): Promise<Value | undefined> => {
  const picked = await vscode.window.showQuickPick(items, {
    matchOnDescription: true,
    matchOnDetail: true,
    ...options,
  });

  return picked?.value;
};
