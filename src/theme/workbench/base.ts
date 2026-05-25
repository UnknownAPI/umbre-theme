import type { ThemeModel } from "@/theme/model.ts";
import { mix, transparent, withAlpha } from "@/theme/palette.ts";
import type { ColorMap } from "@/theme/types.ts";

export const baseColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  foreground: surfaces.fg,
  disabledForeground: withAlpha(surfaces.muted, 0.55),
  focusBorder: surfaces.isDark ? mix(accent.main, surfaces.muted, 0.38) : accent.main,
  contrastBorder: transparent(),
  contrastActiveBorder: transparent(),
  "widget.shadow": surfaces.shadow,
  "widget.border": surfaces.lineStrong,
  "selection.background": surfaces.selection,
  "icon.foreground": surfaces.muted,
  errorForeground: syntax.invalid,
  descriptionForeground: surfaces.muted,
});
