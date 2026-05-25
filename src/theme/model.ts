import {
  defaultDimming,
  type AccentFamily,
  type BorderVariant,
  type DimVariant,
  type Mode,
  type ShadeVariant,
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
  borders: BorderVariant;
};

export const createThemeModel = ({
  mode,
  shade,
  accentFamily,
  dim,
  borders,
}: ThemeModelInput): ThemeModel => {
  const surfaces = createSurfaces(mode, shade);
  const syntax = createSyntax(mode, accentFamily, dim, surfaces);

  return {
    mode,
    shade,
    accentFamily,
    dim,
    borders,
    accent: createAccent(mode, accentFamily),
    surfaces,
    syntax,
    uiSyntax:
      dim.id === defaultDimming.id ? syntax : createSyntax(mode, accentFamily, defaultDimming, surfaces),
  };
};
