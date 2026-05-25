import type { ThemeModel } from "@/theme/model.ts";
import type { ColorMap } from "@/theme/types.ts";

export const editorWidgetColors = ({ accent, surfaces }: ThemeModel): ColorMap => ({
  "editorWidget.background": surfaces.overlay,
  "editorWidget.foreground": surfaces.fg,
  "editorWidget.border": surfaces.lineStrong,
  "editorWidget.resizeBorder": surfaces.ghost,
  "editorHoverWidget.background": surfaces.overlay,
  "editorHoverWidget.foreground": surfaces.fg,
  "editorHoverWidget.border": surfaces.lineStrong,
  "editorHoverWidget.highlightForeground": accent.main,
  "editorHoverWidget.statusBarBackground": surfaces.chrome3,
  "editorSuggestWidget.background": surfaces.overlay,
  "editorSuggestWidget.foreground": surfaces.fg,
  "editorSuggestWidget.border": surfaces.lineStrong,
  "editorSuggestWidget.selectedBackground": surfaces.raised,
  "editorSuggestWidget.selectedForeground": surfaces.fg,
  "editorSuggestWidget.highlightForeground": accent.main,
  "editorSuggestWidget.focusHighlightForeground": accent.main,
});

export const quickInputColors = ({ surfaces }: ThemeModel): ColorMap => ({
  "quickInput.background": surfaces.overlay,
  "quickInput.foreground": surfaces.fg,
  "quickInputTitle.background": surfaces.chrome3,
  "quickInputList.focusBackground": surfaces.raised,
  "quickInputList.focusForeground": surfaces.fg,
  "quickInputList.focusIconForeground": surfaces.fg,
  "pickerGroup.border": surfaces.line,
  "pickerGroup.foreground": surfaces.muted,
  "keybindingLabel.background": surfaces.raised,
  "keybindingLabel.foreground": surfaces.fg,
  "keybindingLabel.border": surfaces.lineStrong,
  "keybindingLabel.bottomBorder": surfaces.lineStrong,
});

export const notificationColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "notifications.background": surfaces.overlay,
  "notifications.foreground": surfaces.fg,
  "notifications.border": surfaces.lineStrong,
  "notificationCenterHeader.background": surfaces.chrome3,
  "notificationCenterHeader.foreground": surfaces.muted,
  "notificationCenter.border": surfaces.lineStrong,
  "notificationToast.border": surfaces.lineStrong,
  "notificationsErrorIcon.foreground": syntax.invalid,
  "notificationsWarningIcon.foreground": syntax.warning,
  "notificationsInfoIcon.foreground": syntax.info,
  "notificationLink.foreground": accent.main,
});
