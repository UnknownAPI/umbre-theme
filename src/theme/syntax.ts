import type { AccentFamily, DimVariant, Mode, SyntaxStyle } from "@/config.ts";
import type { Surfaces, Syntax } from "@/theme/model-types.ts";
import { mix, tw, type Shade } from "@/theme/palette.ts";

const syntaxCache = new Map<string, Syntax>();

export const createSyntax = (
  mode: Mode,
  accentFamily: AccentFamily,
  dim: DimVariant,
  surfaces: Surfaces,
  syntaxStyle: SyntaxStyle,
): Syntax => {
  const cacheKey = [mode, accentFamily, dim.id, surfaces.fg, surfaces.muted, surfaces.subtle, syntaxStyle.id].join(":");
  const cached = syntaxCache.get(cacheKey);
  if (cached) return cached;

  const neutral = mode === "dark" ? tw("zinc", 400) : tw("zinc", 700);
  const chromaShade: Shade = mode === "dark" ? 400 : 700;
  const vividShade: Shade = mode === "dark" ? 500 : 800;
  const softShade: Shade = mode === "dark" ? 300 : 700;
  const syntaxMix = mode === "dark" ? dim.syntaxMix : dim.syntaxMix * 0.72;
  const foregroundMix = mode === "dark" ? dim.syntaxMix * 0.64 : dim.syntaxMix * 0.46;
  const tone = (family: string, shade: Shade = chromaShade): string =>
    mix(tw(family, shade), neutral, syntaxMix);

  const getSyntaxColors = (): Omit<Syntax, "foreground" | "comment"> => {
    if (syntaxStyle.id === "github") {
      // Red-focused keywords, blue strings, purple functions, orange types, green tags
      return {
        keyword: tone("red"),
        storage: tone("red", vividShade),
        operator: tone("sky"),
        string: tone("blue"),
        regexp: tone("teal"),
        number: tone("blue", vividShade),
        constant: tone("blue", vividShade),
        function: tone("purple"),
        method: tone("purple"),
        type: tone("orange"),
        class: tone("orange"),
        interface: tone("orange", softShade),
        tag: tone("green"),
        attribute: tone("blue", softShade),
        property: tone("sky"),
        parameter: mode === "dark" ? tone("orange", softShade) : tone("orange", chromaShade),
        special: tone("amber", softShade),
        markup: tone("rose", softShade),
        invalid: tone("red", vividShade),
        warning: tone("amber", vividShade),
        info: tone("sky", vividShade),
        added: tone("green", vividShade),
        modified: tone("amber", vividShade),
        removed: tone("rose", vividShade),
      };
    }

    if (syntaxStyle.id === "classic") {
      // VS Code Classic: Blue keywords, orange strings, yellow functions, teal types/classes
      return {
        keyword: tone("blue"),
        storage: tone("blue", vividShade),
        operator: mode === "dark" ? tone("zinc", softShade) : tone("zinc", vividShade),
        string: tone("orange"),
        regexp: tone("red"),
        number: tone("emerald"),
        constant: tone("blue", softShade),
        function: tone("yellow"),
        method: tone("yellow"),
        type: tone("teal"),
        class: tone("teal"),
        interface: tone("teal", softShade),
        tag: tone("blue"),
        attribute: tone("sky", softShade),
        property: tone("sky"),
        parameter: mode === "dark" ? tone("zinc", 300) : tone("zinc", 700),
        special: tone("amber", softShade),
        markup: tone("rose", softShade),
        invalid: tone("red", vividShade),
        warning: tone("amber", vividShade),
        info: tone("sky", vividShade),
        added: tone("green", vividShade),
        modified: tone("amber", vividShade),
        removed: tone("rose", vividShade),
      };
    }

    // Default: umbre
    return {
      keyword: tone("orange"),
      storage: tone("orange", vividShade),
      operator: tone("pink"),
      string: tone("green"),
      regexp: tone("teal"),
      number: tone("purple"),
      constant: tone("purple"),
      function: tone("yellow"),
      method: tone("yellow"),
      type: tone("sky"),
      class: tone("sky"),
      interface: tone("cyan"),
      tag: tone("cyan"),
      attribute: tone("yellow", softShade),
      property: tone("rose", softShade),
      parameter: tone("purple", softShade),
      special: tone("amber", softShade),
      markup: tone("rose", softShade),
      invalid: tone("red", vividShade),
      warning: tone("amber", vividShade),
      info: tone("sky", vividShade),
      added: tone("green", vividShade),
      modified: tone("amber", vividShade),
      removed: tone("rose", vividShade),
    };
  };

  const syntax = {
    foreground: mix(surfaces.fg, neutral, foregroundMix),
    comment: mix(surfaces.subtle, surfaces.muted, 0.62),
    ...getSyntaxColors(),
  } satisfies Syntax;

  syntaxCache.set(cacheKey, syntax);
  return syntax;
};
