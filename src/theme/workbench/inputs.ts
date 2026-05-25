import type { ThemeModel } from "@/theme/model.ts";
import { withAlpha } from "@/theme/palette.ts";
import type { ColorMap } from "@/theme/types.ts";

export const inputColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "dropdown.background": surfaces.overlay,
  "dropdown.listBackground": surfaces.overlay,
  "dropdown.border": surfaces.lineStrong,
  "dropdown.foreground": surfaces.fg,
  "input.background": surfaces.chrome1,
  "input.border": surfaces.lineStrong,
  "input.foreground": surfaces.fg,
  "input.placeholderForeground": surfaces.subtle,
  "inputOption.activeBackground": withAlpha(accent.main, surfaces.isDark ? 0.16 : 0.12),
  "inputOption.activeBorder": accent.border,
  "inputOption.activeForeground": accent.main,
  "inputOption.hoverBackground": surfaces.raised,
  "inputValidation.errorBackground": surfaces.overlay,
  "inputValidation.errorBorder": syntax.invalid,
  "inputValidation.errorForeground": syntax.invalid,
  "inputValidation.infoBackground": surfaces.overlay,
  "inputValidation.infoBorder": syntax.info,
  "inputValidation.warningBackground": surfaces.overlay,
  "inputValidation.warningBorder": syntax.warning,
});
