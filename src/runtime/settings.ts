import {
  accentFamilies,
  borderVariants,
  defaultAccent,
  defaultBorders,
  defaultDimming,
  defaultMode,
  defaultShadeForMode,
  dimVariants,
  modes,
  shadeVariants,
  type AccentFamily,
  type BorderVariant,
  type DimVariant,
  type Mode,
  type ShadeVariant,
} from "@/config.ts";
import * as vscode from "vscode";

export type UmbraSettings = {
  mode: Mode;
  shade: ShadeVariant;
  accent: AccentFamily;
  dim: DimVariant;
  borders: BorderVariant;
};

type StoredUmbraSettings = {
  mode?: unknown;
  shade?: unknown;
  accent?: unknown;
  dimming?: unknown;
  borders?: unknown;
};

const storageKey = "umbra.themeSettings";
let state: vscode.Memento | undefined;

export const initializeSettings = (context: vscode.ExtensionContext): void => {
  state = context.globalState;
};

export const defaultSettings = (mode: Mode = defaultMode): UmbraSettings => ({
  mode,
  shade: defaultShadeForMode(mode),
  accent: defaultAccent,
  dim: defaultDimming,
  borders: defaultBorders,
});

export const hasStoredSettings = (): boolean => state?.get<StoredUmbraSettings>(storageKey) !== undefined;

export const readSettings = (): UmbraSettings => {
  const stored = state?.get<StoredUmbraSettings>(storageKey);
  const mode = parseMode(stored?.mode);

  return {
    mode,
    shade: parseShade(stored?.shade, mode),
    accent: parseAccent(stored?.accent),
    dim: parseDim(stored?.dimming),
    borders: parseBorders(stored?.borders),
  };
};

export const updateSettings = async (settings: UmbraSettings): Promise<void> => {
  await state?.update(storageKey, {
    mode: settings.mode,
    shade: settings.shade.id,
    accent: settings.accent,
    dimming: settings.dim.id,
    borders: settings.borders.id,
  } satisfies StoredUmbraSettings);
};

const parseMode = (value: unknown): Mode => {
  return isOneOf(value, modes) ? value : defaultMode;
};

const parseShade = (value: unknown, mode: Mode): ShadeVariant => {
  return shadeVariants.find((shade) => shade.id === value) ?? defaultShadeForMode(mode);
};

const parseAccent = (value: unknown): AccentFamily => {
  return isOneOf(value, accentFamilies) ? value : defaultAccent;
};

const parseDim = (value: unknown): DimVariant => {
  return dimVariants.find((dim) => dim.id === value) ?? defaultDimming;
};

const parseBorders = (value: unknown): BorderVariant => {
  return borderVariants.find((borders) => borders.id === value) ?? defaultBorders;
};

const isOneOf = <Value extends string>(value: unknown, values: readonly Value[]): value is Value => {
  return typeof value === "string" && values.includes(value as Value);
};
