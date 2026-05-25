import type { ThemeModel } from "@/theme/model.ts";
import { transparent, withAlpha } from "@/theme/palette.ts";
import type { ColorMap } from "@/theme/types.ts";

export const diagnosticsColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "editorError.foreground": syntax.invalid,
  "editorError.border": transparent(),
  "editorWarning.foreground": syntax.warning,
  "editorWarning.border": transparent(),
  "editorInfo.foreground": syntax.info,
  "editorInfo.border": transparent(),
  "editorHint.foreground": syntax.regexp,
  "problemsErrorIcon.foreground": syntax.invalid,
  "problemsWarningIcon.foreground": syntax.warning,
  "problemsInfoIcon.foreground": syntax.info,
  "editorOverviewRuler.border": transparent(),
  "editorOverviewRuler.background": surfaces.editor,
  "editorOverviewRuler.errorForeground": withAlpha(syntax.invalid, 0.42),
  "editorOverviewRuler.warningForeground": withAlpha(syntax.warning, 0.42),
  "editorOverviewRuler.infoForeground": withAlpha(syntax.info, 0.42),
  "editorOverviewRuler.findMatchForeground": withAlpha(accent.main, 0.38),
  "editorOverviewRuler.selectionHighlightForeground": withAlpha(
    surfaces.inverse,
    surfaces.isDark ? 0.14 : 0.1,
  ),
  "editorOverviewRuler.modifiedForeground": withAlpha(syntax.modified, 0.38),
  "editorOverviewRuler.addedForeground": withAlpha(syntax.added, 0.38),
  "editorOverviewRuler.deletedForeground": withAlpha(syntax.removed, 0.38),
});

export const debugColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "debugToolBar.background": surfaces.overlay,
  "debugToolBar.border": surfaces.lineStrong,
  "debugIcon.breakpointForeground": syntax.invalid,
  "debugIcon.breakpointDisabledForeground": withAlpha(syntax.invalid, 0.34),
  "debugIcon.breakpointUnverifiedForeground": syntax.warning,
  "debugIcon.startForeground": syntax.added,
  "debugIcon.pauseForeground": accent.main,
  "debugIcon.stopForeground": syntax.invalid,
  "debugIcon.disconnectForeground": syntax.invalid,
  "debugIcon.restartForeground": syntax.added,
  "debugIcon.stepOverForeground": syntax.info,
  "debugIcon.stepIntoForeground": syntax.info,
  "debugIcon.stepOutForeground": syntax.info,
  "debugIcon.continueForeground": syntax.added,
});
