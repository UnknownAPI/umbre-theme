import type { Mode } from "@/config.ts";
import { titleCase } from "@/utils/text.ts";

export const themeLabel = (mode: Mode): string => `Umbra ${titleCase(mode)}`;

export const themeFileName = (mode: Mode): string => `umbra-${mode}-color-theme.json`;

export const themeModeFromLabel = (label: string): Mode | undefined => {
  if (label === themeLabel("dark")) return "dark";
  if (label === themeLabel("light")) return "light";
  return undefined;
};
