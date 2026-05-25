import { accentFamilies, borderVariants, dimVariants, modes, shadeVariants } from "@/config.ts";
import { createTheme, createThemeDocumentFromInput } from "@/theme/create-theme.ts";
import { themeLabel, variantFileName } from "@/theme/naming.ts";
import type { BuiltTheme, ThemeDocument } from "@/theme/types.ts";

export type BuiltThemeFile = {
  document: ThemeDocument;
  fileName: string;
};

export const createThemes = (): BuiltTheme[] => modes.map((mode) => createTheme(mode));

export const createThemeVariants = (): BuiltThemeFile[] => {
  const variants: BuiltThemeFile[] = [];

  for (const mode of modes) {
    for (const shade of shadeVariants) {
      for (const accent of accentFamilies) {
        for (const dim of dimVariants) {
          for (const borders of borderVariants) {
            variants.push({
              fileName: variantFileName(mode, shade, accent, dim, borders),
              document: createThemeDocumentFromInput(themeLabel(mode), {
                mode,
                shade,
                accent,
                dim,
                borders,
              }),
            });
          }
        }
      }
    }
  }

  return variants;
};
