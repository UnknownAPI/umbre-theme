export const extension = {
  name: "umbra-theme",
  displayName: "Umbra",
  publisher: "ohkimur",
  version: "0.1.0",
  id: "ohkimur.umbra-theme",
} as const;

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

export const dimVariants = [
  {
    id: "1",
    level: 1,
    label: "Balanced",
    syntaxMix: 0.14,
  },
  {
    id: "2",
    level: 2,
    label: "Soft",
    syntaxMix: 0.22,
  },
  {
    id: "3",
    level: 3,
    label: "Dim",
    syntaxMix: 0.3,
  },
  {
    id: "4",
    level: 4,
    label: "Muted",
    syntaxMix: 0.4,
  },
  {
    id: "5",
    level: 5,
    label: "Very dim",
    syntaxMix: 0.5,
  },
] as const;
export type DimVariant = (typeof dimVariants)[number];

export const borderVariants = [
  {
    id: "on",
    label: "Borders",
    description: "Keep subtle UI borders visible.",
    enabled: true,
  },
  {
    id: "off",
    label: "No borders",
    description: "Hide UI borders and outlines.",
    enabled: false,
  },
] as const;
export type BorderVariant = (typeof borderVariants)[number];

export const defaultMode = "dark" satisfies Mode;
export const defaultDarkShade = shadeVariants[2];
export const defaultLightShade = shadeVariants[0];
export const defaultShade = defaultDarkShade;
export const defaultAccent = "amber" satisfies AccentFamily;
export const defaultDimming = dimVariants[0];
export const defaultBorders = borderVariants[0];
export const defaultShadeForMode = (mode: Mode): ShadeVariant => {
  return mode === "dark" ? defaultDarkShade : defaultLightShade;
};
