import type { ThemeModel } from "@/theme/model.ts";
import type { ColorMap } from "@/theme/types.ts";

export const welcomeColors = ({ accent, surfaces }: ThemeModel): ColorMap => ({
  "welcomePage.background": surfaces.editor,
  "welcomePage.tileBackground": surfaces.chrome3,
  "welcomePage.tileHoverBackground": surfaces.overlay,
  "welcomePage.tileBorder": surfaces.line,
  "welcomePage.progress.background": surfaces.line,
  "welcomePage.progress.foreground": accent.main,
});

export const testingColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "testing.iconFailed": syntax.invalid,
  "testing.iconErrored": syntax.invalid,
  "testing.iconPassed": syntax.added,
  "testing.iconQueued": accent.main,
  "testing.iconUnset": surfaces.muted,
  "testing.iconSkipped": surfaces.muted,
});

export const chartColors = ({ surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => ({
  "charts.foreground": surfaces.fg,
  "charts.lines": surfaces.line,
  "charts.red": syntax.invalid,
  "charts.blue": syntax.info,
  "charts.yellow": syntax.warning,
  "charts.orange": syntax.number,
  "charts.green": syntax.added,
  "charts.purple": syntax.class,
});

export const chatColors = ({ surfaces }: ThemeModel): ColorMap => ({
  "chat.requestBackground": surfaces.chrome3,
  "chat.requestBorder": surfaces.line,
});
