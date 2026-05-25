import type { ThemeModel } from "@/theme/model.ts";
import { black, white, withAlpha } from "@/theme/palette.ts";
import type { ColorMap } from "@/theme/types.ts";

export const minimapColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "minimap.background": surfaces.editor,
  "minimap.foregroundOpacity": withAlpha(surfaces.isDark ? black() : white(), surfaces.isDark ? 0.73 : 0.67),
  "minimap.selectionHighlight": withAlpha(surfaces.inverse, surfaces.isDark ? 0.2 : 0.14),
  "minimap.findMatchHighlight": withAlpha(accent.main, 0.38),
  "minimap.errorHighlight": withAlpha(syntax.invalid, 0.36),
  "minimap.warningHighlight": withAlpha(syntax.warning, 0.36),
  "minimapSlider.background": withAlpha(surfaces.muted, 0.14),
  "minimapSlider.hoverBackground": withAlpha(surfaces.muted, 0.24),
  "minimapSlider.activeBackground": withAlpha(surfaces.muted, 0.34),
  "minimapGutter.addedBackground": withAlpha(syntax.added, 0.38),
  "minimapGutter.modifiedBackground": withAlpha(syntax.modified, 0.38),
  "minimapGutter.deletedBackground": withAlpha(syntax.removed, 0.38),
});
