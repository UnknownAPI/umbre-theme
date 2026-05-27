import {
  accentFamilies,
  borderVariants,
  defaultAccent,
  defaultBorders,
  defaultDimming,
  defaultMode,
  defaultPanels,
  defaultShadeForMode,
  defaultTerminal,
  dimVariants,
  modes,
  panelVariants,
  shadeVariants,
  terminalVariants,
  type AccentFamily,
  type BorderVariant,
  type DimVariant,
  type Mode,
  type PanelVariant,
  type ShadeVariant,
  type TerminalVariant,
} from "@/config.ts";
import { product } from "@/product.ts";
import * as vscode from "vscode";

export type UmbreSettings = {
  mode: Mode;
  shade: ShadeVariant;
  accent: AccentFamily;
  dim: DimVariant;
  panels: PanelVariant;
  terminal: TerminalVariant;
  borders: BorderVariant;
  systemAware: boolean;
};

type StoredUmbreSettings = {
  mode?: unknown;
  shade?: unknown;
  accent?: unknown;
  dimming?: unknown;
  panels?: unknown;
  terminal?: unknown;
  borders?: unknown;
  systemAware?: unknown;
};

const storageKey = product.settingsStorageKey;
const systemAwareContextKey = "umbre.systemAware";
let state: vscode.Memento | undefined;

export const initializeSettings = (context: vscode.ExtensionContext): void => {
  state = context.globalState;
  void updateSystemAwareContext(readSettings().systemAware);
};

export const defaultSettings = (mode: Mode = defaultMode): UmbreSettings => ({
  mode,
  shade: defaultShadeForMode(mode),
  accent: defaultAccent,
  dim: defaultDimming,
  panels: defaultPanels,
  terminal: defaultTerminal,
  borders: defaultBorders,
  systemAware: false,
});

export const hasStoredSettings = (): boolean => state?.get<StoredUmbreSettings>(storageKey) !== undefined;

export const readSettings = (): UmbreSettings => {
  const stored = state?.get<StoredUmbreSettings>(storageKey);
  const mode = parseMode(stored?.mode);

  return {
    mode,
    shade: parseShade(stored?.shade, mode),
    accent: parseAccent(stored?.accent),
    dim: parseDim(stored?.dimming),
    panels: parsePanels(stored?.panels),
    terminal: parseTerminal(stored?.terminal),
    borders: parseBorders(stored?.borders),
    systemAware: parseSystemAware(stored?.systemAware),
  };
};

export const updateSettings = async (settings: UmbreSettings): Promise<void> => {
  await state?.update(storageKey, {
    mode: settings.mode,
    shade: settings.shade.id,
    accent: settings.accent,
    dimming: settings.dim.id,
    panels: settings.panels.id,
    terminal: settings.terminal.id,
    borders: settings.borders.id,
    systemAware: settings.systemAware,
  } satisfies StoredUmbreSettings);
  await updateSystemAwareContext(settings.systemAware);
};

export const sameSettings = (left: UmbreSettings, right: UmbreSettings): boolean => {
  return (
    left.mode === right.mode &&
    left.shade.id === right.shade.id &&
    left.accent === right.accent &&
    left.dim.id === right.dim.id &&
    left.panels.id === right.panels.id &&
    left.terminal.id === right.terminal.id &&
    left.borders.id === right.borders.id &&
    left.systemAware === right.systemAware
  );
};

const updateSystemAwareContext = (systemAware: boolean): Thenable<void> => {
  return vscode.commands.executeCommand("setContext", systemAwareContextKey, systemAware);
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

const parsePanels = (value: unknown): PanelVariant => {
  return panelVariants.find((panels) => panels.id === value) ?? defaultPanels;
};

const parseTerminal = (value: unknown): TerminalVariant => {
  return terminalVariants.find((terminal) => terminal.id === value) ?? defaultTerminal;
};

const parseBorders = (value: unknown): BorderVariant => {
  if (value === "off") return borderVariants[0];
  return borderVariants.find((borders) => borders.id === value) ?? defaultBorders;
};

const parseSystemAware = (value: unknown): boolean => value === true;

const isOneOf = <Value extends string>(value: unknown, values: readonly Value[]): value is Value => {
  return typeof value === "string" && values.includes(value as Value);
};
