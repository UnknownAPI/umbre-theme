import type { ThemeModel } from "@/theme/model.ts";
import { readableOn, transparent, withAlpha } from "@/theme/palette.ts";
import type { ColorMap } from "@/theme/types.ts";

export const tabColors = ({ accent, surfaces }: ThemeModel): ColorMap => ({
  "editorGroupHeader.tabsBackground": surfaces.chrome1,
  "editorGroupHeader.noTabsBackground": surfaces.chrome1,
  "editorGroupHeader.tabsBorder": surfaces.line,
  "editorGroup.border": surfaces.line,
  "editorGroup.dropBackground": withAlpha(surfaces.inverse, surfaces.isDark ? 0.05 : 0.08),
  "tab.activeBackground": surfaces.editor,
  "tab.activeBorderTop": accent.border,
  "tab.activeBorder": transparent(),
  "tab.activeForeground": surfaces.fg,
  "tab.inactiveBackground": surfaces.chrome1,
  "tab.inactiveForeground": surfaces.muted,
  "tab.unfocusedActiveBackground": surfaces.editor,
  "tab.unfocusedActiveForeground": surfaces.muted,
  "tab.unfocusedInactiveForeground": surfaces.subtle,
  "tab.border": surfaces.chrome1,
  "tab.hoverBackground": surfaces.chrome3,
  "tab.hoverForeground": surfaces.fg,
});

export const activityBarColors = ({ accent, surfaces }: ThemeModel): ColorMap => ({
  "activityBar.background": surfaces.chrome0,
  "activityBar.border": surfaces.line,
  "activityBar.foreground": surfaces.muted,
  "activityBar.inactiveForeground": surfaces.subtle,
  "activityBar.activeBorder": accent.border,
  "activityBarBadge.background": accent.main,
  "activityBarBadge.foreground": accent.on,
});

export const sideBarColors = ({ surfaces }: ThemeModel): ColorMap => ({
  "sideBar.background": surfaces.chrome2,
  "sideBar.border": surfaces.line,
  "sideBar.foreground": surfaces.muted,
  "sideBar.dropBackground": withAlpha(surfaces.inverse, surfaces.isDark ? 0.05 : 0.08),
  "sideBarTitle.foreground": surfaces.muted,
  "sideBarSectionHeader.background": surfaces.chrome3,
  "sideBarSectionHeader.foreground": surfaces.muted,
  "sideBarSectionHeader.border": transparent(),
});

export const panelColors = ({ accent, surfaces }: ThemeModel): ColorMap => ({
  "panel.background": surfaces.chrome3,
  "panel.border": surfaces.lineStrong,
  "panel.dropBorder": accent.border,
  "panelTitle.activeBorder": accent.border,
  "panelTitle.activeForeground": surfaces.fg,
  "panelTitle.inactiveForeground": surfaces.muted,
  "panelSection.border": surfaces.lineStrong,
  "panelSectionHeader.background": surfaces.overlay,
  "panelSectionHeader.foreground": surfaces.muted,
});

export const titleAndStatusColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "titleBar.activeBackground": surfaces.chrome0,
  "titleBar.inactiveBackground": surfaces.chrome0,
  "titleBar.activeForeground": surfaces.muted,
  "titleBar.inactiveForeground": surfaces.subtle,
  "titleBar.border": surfaces.line,
  "statusBar.background": surfaces.chrome0,
  "statusBar.foreground": surfaces.muted,
  "statusBar.border": surfaces.line,
  "statusBar.noFolderBackground": surfaces.chrome0,
  "statusBar.noFolderForeground": surfaces.muted,
  "statusBar.debuggingBackground": accent.main,
  "statusBar.debuggingForeground": accent.on,
  "statusBarItem.hoverBackground": surfaces.raised,
  "statusBarItem.activeBackground": surfaces.overlay2,
  "statusBarItem.remoteBackground": accent.main,
  "statusBarItem.remoteForeground": accent.on,
  "statusBarItem.errorBackground": syntax.invalid,
  "statusBarItem.errorForeground": readableOn(syntax.invalid),
  "statusBarItem.warningBackground": syntax.warning,
  "statusBarItem.warningForeground": readableOn(syntax.warning),
  "window.activeBorder": surfaces.editor,
  "window.inactiveBorder": surfaces.editor,
});
