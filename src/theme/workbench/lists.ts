import type { ThemeModel } from "@/theme/model.ts";
import { black, transparent, withAlpha } from "@/theme/palette.ts";
import type { ColorMap } from "@/theme/types.ts";

export const listColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "list.activeSelectionBackground": surfaces.selection,
  "list.activeSelectionForeground": surfaces.fg,
  "list.activeSelectionIconForeground": surfaces.fg,
  "list.dropBackground": withAlpha(surfaces.inverse, surfaces.isDark ? 0.05 : 0.08),
  "list.focusBackground": surfaces.selectionSoft,
  "list.focusForeground": surfaces.fg,
  "list.focusIconForeground": surfaces.fg,
  "list.focusOutline": withAlpha(surfaces.inverse, surfaces.isDark ? 0.14 : 0.1),
  "list.focusHighlightForeground": accent.main,
  "list.highlightForeground": accent.main,
  "list.hoverBackground": surfaces.overlay,
  "list.hoverForeground": surfaces.fg,
  "list.inactiveSelectionBackground": surfaces.selectionSoft,
  "list.inactiveSelectionForeground": surfaces.fg,
  "list.inactiveSelectionIconForeground": surfaces.fg,
  "list.inactiveFocusBackground": surfaces.selectionSoft,
  "list.inactiveFocusOutline": transparent(),
  "list.invalidItemForeground": syntax.invalid,
  "list.errorForeground": syntax.invalid,
  "list.warningForeground": syntax.warning,
  "list.deemphasizedForeground": surfaces.deemphasized,
  "listFilterWidget.background": surfaces.overlay,
  "listFilterWidget.noMatchesOutline": syntax.invalid,
  "listFilterWidget.outline": transparent(),
  "tree.indentGuidesStroke": surfaces.lineStrong,
  "tree.inactiveIndentGuidesStroke": surfaces.line,
  "tree.tableColumnsBorder": surfaces.lineStrong,
});

export const scrollBarColors = ({ surfaces }: ThemeModel): ColorMap => ({
  "scrollbar.shadow": withAlpha(black(), surfaces.isDark ? 0.16 : 0.08),
  "scrollbarSlider.background": withAlpha(surfaces.muted, surfaces.isDark ? 0.22 : 0.18),
  "scrollbarSlider.hoverBackground": withAlpha(surfaces.muted, surfaces.isDark ? 0.38 : 0.28),
  "scrollbarSlider.activeBackground": withAlpha(surfaces.muted, surfaces.isDark ? 0.52 : 0.4),
});
