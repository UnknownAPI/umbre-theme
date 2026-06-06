import {
  defaultDimming,
  type AccentFamily,
  type BorderVariant,
  type DimVariant,
  type Mode,
  type PanelVariant,
  type ShadeVariant,
  type SyntaxStyle,
  type TerminalVariant,
} from "@/config.ts";
import { createAccent } from "@/theme/accent.ts";
import type { ThemeModel } from "@/theme/model-types.ts";
import { createSurfaces } from "@/theme/surfaces.ts";
import { createSyntax } from "@/theme/syntax.ts";

export type { Accent, Surfaces, Syntax, ThemeModel } from "@/theme/model-types.ts";

export type ThemeModelInput = {
  mode: Mode;
  shade: ShadeVariant;
  accentFamily: AccentFamily;
  dim: DimVariant;
  panels: PanelVariant;
  terminal: TerminalVariant;
  borders: BorderVariant;
  syntaxStyle: SyntaxStyle;
};

export const createThemeModel = ({
  mode,
  shade,
  accentFamily,
  dim,
  panels,
  terminal,
  borders,
  syntaxStyle,
}: ThemeModelInput): ThemeModel => {
  const surfaces = createSurfaces(mode, shade, panels);
  const syntax = createSyntax(mode, accentFamily, dim, surfaces, syntaxStyle);

  return {
    mode,
    shade,
    accentFamily,
    dim,
    panels,
    terminal,
    borders,
    syntaxStyle,
    accent: createAccent(mode, accentFamily),
    surfaces,
    syntax,
    uiSyntax:
      dim.id === defaultDimming.id ? syntax : createSyntax(mode, accentFamily, defaultDimming, surfaces, syntaxStyle),
  };
};
