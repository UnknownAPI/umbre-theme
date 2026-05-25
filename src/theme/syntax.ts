import type { AccentFamily, DimVariant, Mode } from "@/config.ts";
import type { Surfaces, Syntax } from "@/theme/model-types.ts";
import { mix, tw, type Shade } from "@/theme/palette.ts";

const syntaxCache = new Map<string, Syntax>();

export const createSyntax = (
  mode: Mode,
  accentFamily: AccentFamily,
  dim: DimVariant,
  surfaces: Surfaces,
): Syntax => {
  const cacheKey = [mode, accentFamily, dim.id, surfaces.fg, surfaces.muted, surfaces.subtle].join(":");
  const cached = syntaxCache.get(cacheKey);
  if (cached) return cached;

  const neutral = mode === "dark" ? tw("zinc", 400) : tw("zinc", 700);
  const chromaShade: Shade = mode === "dark" ? 400 : 700;
  const vividShade: Shade = mode === "dark" ? 500 : 800;
  const softShade: Shade = mode === "dark" ? 300 : 700;
  const syntaxMix = mode === "dark" ? dim.syntaxMix : dim.syntaxMix * 0.72;
  const tone = (family: AccentFamily, shade: Shade = chromaShade): string =>
    mix(tw(family, shade), neutral, syntaxMix);

  const syntax = {
    foreground: surfaces.fg,
    comment: mix(surfaces.subtle, surfaces.muted, 0.62),
    keyword: tone(accentFamily, mode === "dark" ? 500 : 700),
    storage: tone(accentFamily, vividShade),
    operator: tone("cyan"),
    string: tone("green"),
    regexp: tone("teal"),
    number: tone("orange"),
    constant: tone("amber"),
    function: tone("sky"),
    method: tone("blue"),
    type: tone("violet"),
    class: tone("purple"),
    interface: tone("indigo"),
    tag: tone("rose"),
    attribute: tone("fuchsia", softShade),
    property: tone("pink", softShade),
    parameter: tone("yellow", softShade),
    special: tone("lime", softShade),
    markup: tone("blue", softShade),
    invalid: tone("red", vividShade),
    warning: tone("amber", vividShade),
    info: tone("sky", vividShade),
    added: tone("green", vividShade),
    modified: tone("amber", vividShade),
    removed: tone("rose", vividShade),
  } satisfies Syntax;

  syntaxCache.set(cacheKey, syntax);
  return syntax;
};
