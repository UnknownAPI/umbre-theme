import {
  borderVariants,
  dimVariants,
  panelVariants,
  shadeVariants,
  terminalVariants,
  type Mode,
} from "@/config.ts";
import type { UmbreSettings } from "@/runtime/settings.ts";

export const oppositeSettings = (settings: UmbreSettings): UmbreSettings => {
  return {
    mode: oppositeMode(settings.mode),
    shade: oppositeVariant(settings.shade, shadeVariants),
    accent: settings.accent,
    dim: oppositeVariant(settings.dim, dimVariants),
    panels: oppositeVariant(settings.panels, panelVariants),
    terminal: oppositeVariant(settings.terminal, terminalVariants),
    borders: oppositeVariant(settings.borders, borderVariants),
    systemAware: settings.systemAware,
    syntaxVariant: settings.syntaxVariant,
  };
};

const oppositeMode = (mode: Mode): Mode => (mode === "dark" ? "light" : "dark");

const oppositeVariant = <Variant extends { level: number }>(
  variant: Variant,
  variants: readonly Variant[],
): Variant => {
  const oppositeLevel = variants.length + 1 - variant.level;
  return variants.find((candidate) => candidate.level === oppositeLevel) ?? variant;
};
