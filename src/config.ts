export const modes = ["dark", "light"] as const;
export type Mode = (typeof modes)[number];

export const shadeVariants = [
  {
    id: "1",
    level: 1,
    darkLabel: "Soft charcoal",
    lightLabel: "Paper white",
  },
  {
    id: "2",
    level: 2,
    darkLabel: "Deep graphite",
    lightLabel: "Mist",
  },
  {
    id: "3",
    level: 3,
    darkLabel: "Balanced black",
    lightLabel: "Balanced grey",
  },
  {
    id: "4",
    level: 4,
    darkLabel: "Near black",
    lightLabel: "Dimmed light",
  },
  {
    id: "5",
    level: 5,
    darkLabel: "Pure black",
    lightLabel: "Shadow light",
  },
] as const;
export type ShadeVariant = (typeof shadeVariants)[number];

export const accentFamilies = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;
export type AccentFamily = (typeof accentFamilies)[number];

const defaultOptionDetail = (detail: string): string => `${detail}. [default option]`;

export const dimVariants = [
  {
    id: "1",
    level: 1,
    label: "Vivid syntax",
    detail: "Keeps code colors at their strongest.",
    syntaxMix: 0.14,
  },
  {
    id: "2",
    level: 2,
    label: "Balanced syntax",
    detail: "Colorful, but calm enough for long sessions.",
    syntaxMix: 0.22,
  },
  {
    id: "3",
    level: 3,
    label: "Soft syntax",
    detail: defaultOptionDetail("Reduces color contrast while preserving token distinction"),
    syntaxMix: 0.3,
  },
  {
    id: "4",
    level: 4,
    label: "Muted syntax",
    detail: "Pushes syntax colors closer to the foreground.",
    syntaxMix: 0.4,
  },
  {
    id: "5",
    level: 5,
    label: "Faint syntax",
    detail: "Minimizes color for a nearly monochrome editor.",
    syntaxMix: 0.5,
  },
] as const;
export type DimVariant = (typeof dimVariants)[number];

export const panelVariants = [
  {
    id: "1",
    level: 1,
    label: "Unified panels",
    detail: "Panels stay closest to the editor surface.",
    surfaceContrast: 0.45,
  },
  {
    id: "2",
    level: 2,
    label: "Quiet panels",
    detail: "Slight separation with a very soft workspace frame.",
    surfaceContrast: 0.64,
  },
  {
    id: "3",
    level: 3,
    label: "Balanced panels",
    detail: defaultOptionDetail("Moderate panel separation without strong blocks"),
    surfaceContrast: 0.82,
  },
  {
    id: "4",
    level: 4,
    label: "Defined panels",
    detail: "Clearer sidebars and bottom panels.",
    surfaceContrast: 1,
  },
  {
    id: "5",
    level: 5,
    label: "Separated panels",
    detail: "Maximum workbench structure around the editor.",
    surfaceContrast: 1.2,
  },
] as const;
export type PanelVariant = (typeof panelVariants)[number];

export const terminalVariants = [
  {
    id: "1",
    level: 1,
    label: "Merged terminal",
    detail: "Terminal background matches the editor.",
    backgroundMix: 0,
  },
  {
    id: "2",
    level: 2,
    label: "Quiet terminal",
    detail: defaultOptionDetail("A small lift from the editor background"),
    backgroundMix: 0.25,
  },
  {
    id: "3",
    level: 3,
    label: "Balanced terminal",
    detail: "Enough contrast to read as a separate tool area.",
    backgroundMix: 0.5,
  },
  {
    id: "4",
    level: 4,
    label: "Clear terminal",
    detail: "Strong terminal separation.",
    backgroundMix: 0.75,
  },
  {
    id: "5",
    level: 5,
    label: "Raised terminal",
    detail: "Terminal uses the strongest raised surface.",
    backgroundMix: 1,
  },
] as const;
export type TerminalVariant = (typeof terminalVariants)[number];

export const borderVariants = [
  {
    id: "1",
    level: 1,
    label: "Hidden borders",
    detail: "Removes most workbench outlines.",
    opacity: 0,
  },
  {
    id: "2",
    level: 2,
    label: "Hairline borders",
    detail: defaultOptionDetail("Barely visible separators for a softer layout"),
    opacity: 0.24,
  },
  {
    id: "3",
    level: 3,
    label: "Subtle borders",
    detail: "Visible structure without drawing attention.",
    opacity: 0.42,
  },
  {
    id: "4",
    level: 4,
    label: "Clear borders",
    detail: "More readable pane and widget boundaries.",
    opacity: 0.62,
  },
  {
    id: "5",
    level: 5,
    label: "Strong borders",
    detail: "Maximum separation between workbench areas.",
    opacity: 0.82,
  },
] as const;
export type BorderVariant = (typeof borderVariants)[number];

export const syntaxVariants = [
  {
    id: "ember",
    label: "Ember",
    detail: defaultOptionDetail("Warm-toned"),
  },
  {
    id: "flare",
    label: "Flare",
    detail: "Bold token contrast.",
  },
  {
    id: "frost",
    label: "Frost",
    detail: "Cool-toned throughout.",
  },
] as const;
export type SyntaxVariant = (typeof syntaxVariants)[number];

export const defaultMode = "dark" satisfies Mode;
export const defaultDarkShade = shadeVariants[2];
export const defaultLightShade = shadeVariants[2];
export const defaultShade = defaultDarkShade;
export const defaultAccent = "amber" satisfies AccentFamily;
export const defaultDimming = dimVariants[2];
export const defaultPanels = panelVariants[2];
export const defaultTerminal = terminalVariants[1];
export const defaultBorders = borderVariants[1];
export const defaultSyntax = syntaxVariants[0];
export const defaultShadeForMode = (mode: Mode): ShadeVariant => {
  return mode === "dark" ? defaultDarkShade : defaultLightShade;
};
