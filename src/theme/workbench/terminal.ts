import type { ThemeModel } from "@/theme/model.ts";
import { darken, lighten, tw, white } from "@/theme/palette.ts";
import type { ColorMap } from "@/theme/types.ts";

export const terminalColors = ({ accent, surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => {
  const lift = (hex: string): string => (surfaces.isDark ? lighten(hex, 0.12) : darken(hex, 0.08));

  return {
    "terminal.background": surfaces.chrome3,
    "terminal.foreground": surfaces.fg,
    "terminal.ansiBlack": surfaces.isDark ? tw("zinc", 900) : tw("zinc", 800),
    "terminal.ansiBrightBlack": surfaces.isDark ? tw("zinc", 600) : tw("zinc", 500),
    "terminal.ansiWhite": surfaces.isDark ? tw("zinc", 300) : tw("zinc", 100),
    "terminal.ansiBrightWhite": white(),
    "terminal.ansiRed": syntax.invalid,
    "terminal.ansiBrightRed": lift(syntax.invalid),
    "terminal.ansiGreen": syntax.added,
    "terminal.ansiBrightGreen": lift(syntax.added),
    "terminal.ansiYellow": syntax.warning,
    "terminal.ansiBrightYellow": lift(syntax.warning),
    "terminal.ansiBlue": syntax.method,
    "terminal.ansiBrightBlue": lift(syntax.method),
    "terminal.ansiMagenta": syntax.class,
    "terminal.ansiBrightMagenta": lift(syntax.class),
    "terminal.ansiCyan": syntax.operator,
    "terminal.ansiBrightCyan": lift(syntax.operator),
    "terminal.selectionBackground": surfaces.selection,
    "terminalCursor.foreground": accent.main,
  };
};
