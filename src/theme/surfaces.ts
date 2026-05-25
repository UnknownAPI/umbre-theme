import type { Mode, ShadeVariant } from "@/config.ts";
import type { Surfaces } from "@/theme/model-types.ts";
import { black, mix, tw, white, withAlpha } from "@/theme/palette.ts";

type SurfaceLayers = Pick<
  Surfaces,
  "chrome0" | "chrome1" | "chrome2" | "chrome3" | "overlay" | "overlay2" | "raised"
>;

export const createSurfaces = (mode: Mode, shade: ShadeVariant): Surfaces => {
  return mode === "dark" ? createDarkSurfaces(shade) : createLightSurfaces(shade);
};

const createDarkSurfaces = (shade: ShadeVariant): Surfaces => {
  const depth = shadeDepth(shade);
  const bg = shade.level === 5 ? black() : mix(tw("zinc", 900), tw("zinc", 950), 0.18 + depth * 0.72);
  const layers = shade.level === 5 ? createPureBlackLayers(bg) : createDarkLayers(bg, depth);
  const muted = tw("zinc", 500);
  const subtle = mix(tw("zinc", 600), bg, 0.2 + depth * 0.18);

  return {
    bg,
    editor: bg,
    ...layers,
    line: withAlpha(mix(tw("zinc", 700), bg, 0.2 + depth * 0.1), 0.32),
    lineStrong: withAlpha(mix(tw("zinc", 600), bg, 0.18 + depth * 0.1), 0.42),
    fg: tw("zinc", 200),
    muted,
    subtle,
    deemphasized: createDeemphasized(muted, subtle),
    ghost: withAlpha(mix(tw("zinc", 600), bg, 0.22 + depth * 0.18), 0.42),
    selection: withAlpha(white(), 0.085 + depth * 0.025),
    selectionSoft: withAlpha(white(), 0.045 + depth * 0.015),
    shadow: withAlpha(black(), 0.36),
    inverse: white(),
    isDark: true,
  };
};

const createDarkLayers = (bg: string, depth: number): SurfaceLayers => ({
  chrome0: mix(bg, tw("zinc", 950), 0.24 + depth * 0.08),
  chrome1: mix(bg, tw("zinc", 900), 0.12 + (1 - depth) * 0.08),
  chrome2: mix(bg, tw("zinc", 900), 0.16 + (1 - depth) * 0.08),
  chrome3: mix(bg, tw("zinc", 800), 0.1 + (1 - depth) * 0.04),
  overlay: mix(bg, tw("zinc", 800), 0.18 + (1 - depth) * 0.04),
  overlay2: mix(bg, tw("zinc", 700), 0.16 + (1 - depth) * 0.05),
  raised: mix(bg, tw("zinc", 700), 0.22 + (1 - depth) * 0.06),
});

const createPureBlackLayers = (bg: string): SurfaceLayers => ({
  chrome0: mix(bg, tw("zinc", 900), 0.36),
  chrome1: mix(bg, tw("zinc", 900), 0.42),
  chrome2: mix(bg, tw("zinc", 900), 0.46),
  chrome3: mix(bg, tw("zinc", 800), 0.38),
  overlay: mix(bg, tw("zinc", 800), 0.5),
  overlay2: mix(bg, tw("zinc", 700), 0.5),
  raised: mix(bg, tw("zinc", 700), 0.62),
});

const createLightSurfaces = (shade: ShadeVariant): Surfaces => {
  const depth = shadeDepth(shade);
  const bg = mix(white(), tw("zinc", 200), depth);
  const muted = tw("zinc", 600);
  const subtle = tw("zinc", 500);

  return {
    bg,
    editor: bg,
    ...createLightLayers(bg, depth),
    line: withAlpha(mix(tw("zinc", 300), tw("zinc", 500), depth * 0.36), 0.44),
    lineStrong: withAlpha(mix(tw("zinc", 400), tw("zinc", 600), depth * 0.34), 0.54),
    fg: tw("zinc", 950),
    muted,
    subtle,
    deemphasized: createDeemphasized(muted, subtle),
    ghost: withAlpha(tw("zinc", 400), 0.42),
    selection: withAlpha(black(), 0.1 + depth * 0.04),
    selectionSoft: withAlpha(black(), 0.055 + depth * 0.02),
    shadow: withAlpha(black(), 0.12),
    inverse: black(),
    isDark: false,
  };
};

const createLightLayers = (bg: string, depth: number): SurfaceLayers => ({
  chrome0: mix(bg, tw("zinc", 300), 0.08 + depth * 0.07),
  chrome1: mix(bg, tw("zinc", 300), 0.05 + depth * 0.05),
  chrome2: mix(bg, tw("zinc", 300), 0.08 + depth * 0.07),
  chrome3: mix(bg, tw("zinc", 300), 0.1 + depth * 0.08),
  overlay: mix(bg, white(), 0.82 - depth * 0.22),
  overlay2: mix(bg, tw("zinc", 300), 0.08 + depth * 0.08),
  raised: mix(mix(bg, white(), 0.82 - depth * 0.22), tw("zinc", 300), 0.24 + depth * 0.1),
});

const createDeemphasized = (muted: string, subtle: string): string => mix(muted, subtle, 0.58);

const shadeDepth = (shade: ShadeVariant): number => (shade.level - 1) / 4;
