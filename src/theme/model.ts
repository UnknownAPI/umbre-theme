import {
  defaultDimming,
  type AccentFamily,
  type BorderVariant,
  type DimVariant,
  type Mode,
  type PanelVariant,
  type ShadeVariant,
  type SyntaxVariant,
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
  syntaxVariant: SyntaxVariant;
};

export const createThemeModel = ({
  mode,
  shade,
  accentFamily,
  dim,
  panels,
  terminal,
  borders,
  syntaxVariant,
}: ThemeModelInput): ThemeModel => {
  const surfaces = createSurfaces(mode, shade, panels);
  const syntax = createSyntax(mode, dim, surfaces, syntaxVariant);

  return {
    mode,
    shade,
    accentFamily,
    dim,
    panels,
    terminal,
    borders,
    syntaxVariant,
    accent: createAccent(mode, accentFamily),
    surfaces,
    syntax,
    uiSyntax:
      dim.id === defaultDimming.id ? syntax : createSyntax(mode, defaultDimming, surfaces, syntaxVariant),
  };
};
