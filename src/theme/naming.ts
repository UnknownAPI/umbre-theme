import type { Mode } from "@/config.ts";
import { product } from "@/product.ts";
import { titleCase } from "@/utils/text.ts";

export const themeLabel = (_mode?: Mode): string => product.displayName;

export const legacyThemeLabel = (mode: Mode): string => `${product.displayName} ${titleCase(mode)}`;

export const themeFileName = (_mode?: Mode): string => `${product.themeFilePrefix}-theme.json`;

export const isThemeLabel = (label: string): boolean => {
  return label === themeLabel() || label === legacyThemeLabel("dark") || label === legacyThemeLabel("light");
};

export const themeModeFromLabel = (label: string): Mode | undefined => {
  if (label === legacyThemeLabel("dark")) return "dark";
  if (label === legacyThemeLabel("light")) return "light";
  return undefined;
};
