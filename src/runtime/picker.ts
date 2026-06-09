import {
  accentFamilies,
  borderVariants,
  defaultAccent,
  defaultBorders,
  defaultDimming,
  defaultMode,
  defaultPanels,
  defaultShadeForMode,
  defaultSyntax,
  defaultTerminal,
  dimVariants,
  modes,
  panelVariants,
  shadeVariants,
  syntaxVariants,
  terminalVariants,
  type AccentFamily,
  type BorderVariant,
  type DimVariant,
  type Mode,
  type PanelVariant,
  type ShadeVariant,
  type SyntaxVariant,
  type TerminalVariant,
} from "@/config.ts";
import { product } from "@/product.ts";
import { chooseRecommendedFont } from "@/runtime/fonts.ts";
import { sameSettings, type UmbreSettings } from "@/runtime/settings.ts";
import { detectSystemMode } from "@/runtime/system-mode.ts";
import { titleCase } from "@/utils/text.ts";
import { debounce } from "es-toolkit";
import * as vscode from "vscode";

type PickItem<Value> = vscode.QuickPickItem & {
  value: Value;
  current?: boolean;
};

type ConfigurationTarget =
  | "all"
  | "recommended"
  | "mode"
  | "shade"
  | "accent"
  | "dimming"
  | "panels"
  | "terminal"
  | "borders"
  | "systemAware"
  | "font"
  | "syntaxVariant";
type PreviewSettings = (settings: UmbreSettings) => void;

export const pickSettings = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
  initialTarget?: ConfigurationTarget,
): Promise<UmbreSettings | undefined> => {
  const target = initialTarget ?? (await pickConfigurationTarget(current));
  if (!target) return undefined;

  if (target === "all") return pickAllSettings(current, previewSettings);
  if (target === "recommended") return pickRecommendedSettings(current, previewSettings);
  return pickSingleSetting(current, target, previewSettings);
};

const pickConfigurationTarget = async (current: UmbreSettings): Promise<ConfigurationTarget | undefined> => {
  return pickValue(
    [
      {
        label: "Configure all",
        description: "Guided setup",
        detail: `Step through all ${product.displayName} theme controls.`,
        value: "all",
      },
      {
        label: "Recommended presets",
        description: "Light, balanced, or pure black",
        detail: "Choose one of three polished Umbre starting points across the full brightness spectrum.",
        value: "recommended",
      },
      {
        label: "Mode",
        description: titleCase(current.mode),
        detail: "Switch between dark and light mode when system sync is off.",
        value: "mode",
      },
      {
        label: "Surface shade",
        description: `Level ${current.shade.level}: ${shadeLabel(current.mode, current.shade)}`,
        detail: "Set the editor base darkness/lightness.",
        value: "shade",
      },
      {
        label: "Accent color",
        description: titleCase(current.accent),
        detail: "Change command, cursor, focus, badge, and active states.",
        value: "accent",
      },
      {
        label: "Syntax color scheme",
        description: current.syntaxVariant.label,
        detail: current.syntaxVariant.detail,
        value: "syntaxVariant",
      },
      {
        label: "Editor dimming",
        description: settingSummary(current.dim),
        detail: "Tune syntax color intensity in the editor only.",
        value: "dimming",
      },
      {
        label: "Panel contrast",
        description: settingSummary(current.panels),
        detail: "Tune sidebar, panel, tabs, and widget contrast against the editor.",
        value: "panels",
      },
      {
        label: "Terminal contrast",
        description: settingSummary(current.terminal),
        detail: "Tune terminal background contrast independently.",
        value: "terminal",
      },
      {
        label: "Border intensity",
        description: settingSummary(current.borders),
        detail: "Tune outlines between workbench areas.",
        value: "borders",
      },
      {
        label: "System appearance sync",
        description: current.systemAware ? "On" : "Off",
        detail: "Automatically mirror your Umbre setup when the OS switches light or dark.",
        value: "systemAware",
      },
      {
        label: "Recommended font",
        description: "JetBrains Mono, Fira Code, or Hack Nerd Font",
        detail: "Preview and choose a calm coding font for your editor.",
        value: "font",
      },
    ],
    `${product.displayName}: what would you like to configure?`,
  );
};

const pickSingleSetting = async (
  current: UmbreSettings,
  target: Exclude<ConfigurationTarget, "all" | "recommended">,
  previewSettings?: PreviewSettings,
): Promise<UmbreSettings | undefined> => {
  switch (target) {
    case "mode": {
      const manual = { ...current, systemAware: false };
      const mode = await pickMode(manual, previewSettings);
      return mode ? { ...manual, mode, shade: defaultShadeForMode(mode) } : undefined;
    }
    case "shade": {
      const shade = await pickShade(current, previewSettings);
      return shade ? { ...current, shade } : undefined;
    }
    case "accent": {
      const accent = await pickAccent(current, previewSettings);
      return accent ? { ...current, accent } : undefined;
    }
    case "syntaxVariant": {
      const syntaxVariant = await pickSyntaxVariant(current, previewSettings);
      return syntaxVariant ? { ...current, syntaxVariant } : undefined;
    }
    case "dimming": {
      const dim = await pickDimming(current, previewSettings);
      return dim ? { ...current, dim } : undefined;
    }
    case "panels": {
      const panels = await pickPanels(current, previewSettings);
      return panels ? { ...current, panels } : undefined;
    }
    case "terminal": {
      const terminal = await pickTerminal(current, previewSettings);
      return terminal ? { ...current, terminal } : undefined;
    }
    case "borders": {
      const borders = await pickBorders(current, previewSettings);
      return borders ? { ...current, borders } : undefined;
    }
    case "systemAware": {
      const systemAware = await pickSystemAware(current);
      return systemAware === undefined
        ? undefined
        : settingsWithSystemAware(current, systemAware, previewSettings);
    }
    case "font": {
      await chooseRecommendedFont();
      return undefined;
    }
  }
};

const pickAllSettings = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<UmbreSettings | undefined> => {
  const systemAware = await pickSystemAware(current);
  if (systemAware === undefined) return undefined;

  const withSync = await settingsWithSystemAware(current, systemAware, previewSettings);
  if (!withSync) return undefined;

  const shade = await pickShade(withSync, previewSettings);
  if (!shade) return undefined;
  const withShade = { ...withSync, shade };

  const accent = await pickAccent(withShade, previewSettings);
  if (!accent) return undefined;
  const withAccent = { ...withShade, accent };

  const syntaxVariant = await pickSyntaxVariant(withAccent, previewSettings);
  if (!syntaxVariant) return undefined;
  const withSyntaxVariant = { ...withAccent, syntaxVariant };

  const dim = await pickDimming(withSyntaxVariant, previewSettings);
  if (!dim) return undefined;
  const withDimming = { ...withSyntaxVariant, dim };

  const panels = await pickPanels(withDimming, previewSettings);
  if (!panels) return undefined;
  const withPanels = { ...withDimming, panels };

  const terminal = await pickTerminal(withPanels, previewSettings);
  if (!terminal) return undefined;
  const withTerminal = { ...withPanels, terminal };

  const borders = await pickBorders(withTerminal, previewSettings);
  if (!borders) return undefined;
  const withBorders = { ...withTerminal, borders };

  await chooseRecommendedFont({ allowSkip: true });

  return withBorders;
};

type RecommendedPreset = {
  id: "light" | "balanced" | "pure-black";
  label: string;
  description: string;
  detail: string;
  settings: Omit<UmbreSettings, "systemAware">;
};

const defaultOptionBadge = "[default option]";

const recommendedPresets = [
  {
    id: "light",
    label: "Light",
    description: "Beautiful light setup",
    detail: "Light surface with balanced syntax, panels, terminal, and soft hairline borders.",
    settings: {
      mode: "light",
      shade: shadeVariants[0],
      accent: defaultAccent,
      dim: defaultDimming,
      panels: defaultPanels,
      terminal: defaultTerminal,
      borders: defaultBorders,
      syntaxVariant: defaultSyntax,
    },
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Balanced setup",
    detail: `Middle shade with balanced syntax, panels, terminal, and soft hairline borders. ${defaultOptionBadge}`,
    settings: {
      mode: "dark",
      shade: defaultShadeForMode("dark"),
      accent: defaultAccent,
      dim: defaultDimming,
      panels: defaultPanels,
      terminal: defaultTerminal,
      borders: defaultBorders,
      syntaxVariant: defaultSyntax,
    },
  },
  {
    id: "pure-black",
    label: "Pure black",
    description: "Very dark minimal setup",
    detail: "True black surface with balanced syntax, panels, terminal, and soft hairline borders.",
    settings: {
      mode: "dark",
      shade: shadeVariants[4],
      accent: defaultAccent,
      dim: defaultDimming,
      panels: defaultPanels,
      terminal: defaultTerminal,
      borders: defaultBorders,
      syntaxVariant: defaultSyntax,
    },
  },
] satisfies RecommendedPreset[];

const pickRecommendedSettings = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<UmbreSettings | undefined> => {
  const presets = recommendedPresets.map((preset) => ({
    ...preset,
    settings: { ...preset.settings, systemAware: false },
  }));
  const selectedPreset = presets.find((preset) => sameSettings(preset.settings, current));

  return pickValue(
    presets.map((preset) => ({
      label: itemLabel(preset.label, preset.id === selectedPreset?.id),
      description: preset.description,
      detail: preset.detail,
      value: preset.settings,
      current: preset.id === selectedPreset?.id,
    })),
    `${product.displayName}: select recommended preset`,
    (settings) => settings,
    previewSettings,
  );
};

const pickMode = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<Mode | undefined> => {
  return pickValue(
    modes.map((mode) => ({
      label: itemLabel(titleCase(mode), current.mode === mode),
      description: `${titleCase(mode)} mode`,
      ...(mode === defaultMode ? { detail: defaultOptionBadge } : {}),
      value: mode,
      current: current.mode === mode,
    })),
    `${product.displayName}: select mode`,
    (mode) => ({ ...current, mode, shade: defaultShadeForMode(mode) }),
    previewSettings,
  );
};

const pickShade = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<ShadeVariant | undefined> => {
  const noun = current.mode === "dark" ? "darkness" : "lightness";

  return pickValue(
    shadeVariants.map((shade) => ({
      label: itemLabel(`Level ${shade.level}`, current.shade.id === shade.id),
      description: shadeLabel(current.mode, shade),
      detail: shadeDetail(current.mode, shade),
      value: shade,
      current: current.shade.id === shade.id,
    })),
    `${product.displayName}: select ${noun} level`,
    (shade) => ({ ...current, shade }),
    previewSettings,
  );
};

const pickAccent = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<AccentFamily | undefined> => {
  return pickValue(
    accentFamilies.map((accent) => ({
      label: itemLabel(titleCase(accent), current.accent === accent),
      description: "Accent color",
      ...(accent === defaultAccent ? { detail: defaultOptionBadge } : {}),
      value: accent,
      current: current.accent === accent,
    })),
    `${product.displayName}: select accent`,
    (accent) => ({ ...current, accent }),
    previewSettings,
  );
};

const pickSyntaxVariant = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<SyntaxVariant | undefined> => {
  return pickValue(
    syntaxVariants.map((variant) => ({
      label: itemLabel(variant.label, current.syntaxVariant.id === variant.id),
      description: variant.detail,
      value: variant,
      current: current.syntaxVariant.id === variant.id,
    })),
    `${product.displayName}: select syntax color scheme`,
    (syntaxVariant) => ({ ...current, syntaxVariant }),
    previewSettings,
  );
};

const pickDimming = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<DimVariant | undefined> => {
  return pickValue(
    dimVariants.map((dim) => ({
      label: itemLabel(`Level ${dim.level}`, current.dim.id === dim.id),
      description: dim.label,
      detail: settingDetail(dim),
      value: dim,
      current: current.dim.id === dim.id,
    })),
    `${product.displayName}: select editor dimming`,
    (dim) => ({ ...current, dim }),
    previewSettings,
  );
};

const pickPanels = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<PanelVariant | undefined> => {
  return pickValue(
    panelVariants.map((panels) => ({
      label: itemLabel(`Level ${panels.level}`, current.panels.id === panels.id),
      description: panels.label,
      detail: settingDetail(panels),
      value: panels,
      current: current.panels.id === panels.id,
    })),
    `${product.displayName}: select panel contrast`,
    (panels) => ({ ...current, panels }),
    previewSettings,
  );
};

const pickTerminal = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<TerminalVariant | undefined> => {
  return pickValue(
    terminalVariants.map((terminal) => ({
      label: itemLabel(`Level ${terminal.level}`, current.terminal.id === terminal.id),
      description: terminal.label,
      detail: settingDetail(terminal),
      value: terminal,
      current: current.terminal.id === terminal.id,
    })),
    `${product.displayName}: select terminal contrast`,
    (terminal) => ({ ...current, terminal }),
    previewSettings,
  );
};

const pickBorders = async (
  current: UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<BorderVariant | undefined> => {
  return pickValue(
    borderVariants.map((borders) => ({
      label: itemLabel(`Level ${borders.level}`, current.borders.id === borders.id),
      description: borders.label,
      detail: settingDetail(borders),
      value: borders,
      current: current.borders.id === borders.id,
    })),
    `${product.displayName}: select border intensity`,
    (borders) => ({ ...current, borders }),
    previewSettings,
  );
};

const settingsWithSystemAware = async (
  current: UmbreSettings,
  systemAware: boolean,
  previewSettings?: PreviewSettings,
): Promise<UmbreSettings | undefined> => {
  if (systemAware) {
    const mode = (await detectSystemMode()) ?? current.mode;
    const settings = {
      ...current,
      systemAware,
      mode,
      shade: current.mode === mode ? current.shade : defaultShadeForMode(mode),
    };
    previewSettings?.(settings);
    return settings;
  }

  const manual = { ...current, systemAware };
  const mode = await pickMode(manual, previewSettings);
  return mode ? { ...manual, mode, shade: defaultShadeForMode(mode) } : undefined;
};

const pickSystemAware = async (current: UmbreSettings): Promise<boolean | undefined> => {
  return pickValue(
    [
      {
        label: itemLabel("On", current.systemAware),
        description: "Follow system appearance",
        detail:
          "When macOS or Windows changes light/dark appearance, Umbre applies the matching opposite mode.",
        value: true,
        current: current.systemAware,
      },
      {
        label: itemLabel("Off", !current.systemAware),
        description: "Manual only",
        detail: "Keep Umbre on the mode you choose until you change it yourself.",
        value: false,
        current: !current.systemAware,
      },
    ],
    `${product.displayName}: system appearance sync`,
  );
};

const pickValue = async <Value>(
  items: PickItem<Value>[],
  title: string,
  preview?: (value: Value) => UmbreSettings,
  previewSettings?: PreviewSettings,
): Promise<Value | undefined> => {
  const picker = vscode.window.createQuickPick<PickItem<Value>>();
  const activeItem = items.find((item) => item.current) ?? items[0];
  picker.title = title;
  picker.ignoreFocusOut = true;
  picker.items = items;
  picker.matchOnDescription = true;
  picker.matchOnDetail = true;
  if (activeItem) picker.activeItems = [activeItem];

  return new Promise((resolve) => {
    let settled = false;
    const done = (value: Value | undefined): void => {
      if (settled) return;
      settled = true;
      picker.dispose();
      resolve(value);
    };

    const previewNow = (item: PickItem<Value> | undefined): void => {
      if (item && preview) previewSettings?.(preview(item.value));
    };
    const previewLater = debounce(previewNow, 160);

    picker.onDidChangeActive((active) => {
      const [item] = active;
      previewLater(item);
    });
    picker.onDidAccept(() => {
      previewLater.flush();
      const [item] = picker.activeItems;
      done(item?.value);
    });
    picker.onDidHide(() => {
      previewLater.cancel();
      done(undefined);
    });
    picker.show();
    previewNow(activeItem);
  });
};

const itemLabel = (label: string, selected: boolean): string => (selected ? `$(check) ${label}` : label);

const settingSummary = (setting: { level: number; label: string }): string => {
  return `Level ${setting.level}: ${setting.label}`;
};

const settingDetail = (setting: { level: number; detail: string }): string => {
  return `${levelSlider(setting.level)}  ${setting.detail}`;
};

const shadeLabel = (mode: Mode, shade: ShadeVariant): string => {
  return mode === "dark" ? shade.darkLabel : shade.lightLabel;
};

const shadeDetail = (mode: Mode, shade: ShadeVariant): string => {
  const slider = levelSlider(shade.level);
  return shade.id === defaultShadeForMode(mode).id ? `${slider}  ${defaultOptionBadge}` : slider;
};

const levelSlider = (level: number): string => {
  return Array.from({ length: 5 }, (_value, index) => (index + 1 === level ? "●" : "○")).join(" ");
};
