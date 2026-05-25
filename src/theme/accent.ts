import type { AccentFamily, Mode } from "@/config.ts";
import type { Accent } from "@/theme/model-types.ts";
import { mix, readableOn, tw, withAlpha, type Shade } from "@/theme/palette.ts";

export const createAccent = (mode: Mode, family: AccentFamily): Accent => {
  const mainShade: Shade = mode === "dark" ? 500 : 600;
  const hoverShade: Shade = mode === "dark" ? 400 : 700;
  const neutral = mode === "dark" ? tw("zinc", 400) : tw("zinc", 700);
  const main = mix(tw(family, mainShade), neutral, 0.08);
  const hover = mix(tw(family, hoverShade), neutral, 0.06);

  return {
    family,
    main,
    hover,
    subdued: withAlpha(main, mode === "dark" ? 0.22 : 0.14),
    faint: withAlpha(main, mode === "dark" ? 0.09 : 0.07),
    border: withAlpha(main, mode === "dark" ? 0.3 : 0.24),
    on: readableOn(main),
  };
};
