import {
  accentFamilies,
  borderVariants,
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
import type { UmbraSettings } from "@/runtime/settings.ts";
import { titleCase } from "@/utils/text.ts";
import { debounce } from "es-toolkit";
import * as vscode from "vscode";

type PickItem<Value> = vscode.QuickPickItem & {
  value: Value;
  current?: boolean;
};

type ConfigurationTarget = "mode" | "shade" | "accent" | "dimming" | "borders" | "all";
type PreviewSettings = (settings: UmbraSettings) => void;

export const pickSettings = async (
  current: UmbraSettings,
  previewSettings?: PreviewSettings,
): Promise<UmbraSettings | undefined> => {
  const target = await pickConfigurationTarget(current);
  if (!target) return undefined;

  if (target === "all") return pickAllSettings(current, previewSettings);
  return pickSingleSetting(current, target, previewSettings);
};

const pickConfigurationTarget = async (current: UmbraSettings): Promise<ConfigurationTarget | undefined> => {
  return pickValue(
    [
      {
        label: "Mode",
        description: titleCase(current.mode),
        detail: "Switch between Umbra Dark and Umbra Light.",
        value: "mode",
      },
      {
        label: "Surface shade",
        description: `Level ${current.shade.level}: ${shadeLabel(current.mode, current.shade)}`,
        detail: "Adjust the base darkness/lightness for the editor and UI chrome.",
        value: "shade",
      },
      {
        label: "Accent color",
        description: titleCase(current.accent),
        detail: "Change the command, cursor, focus, badge, and active-state accent.",
        value: "accent",
      },
      {
        label: "Editor color dimming",
        description: `Level ${current.dim.level}: ${current.dim.label}`,
        detail: "Balance syntax color intensity without changing the workbench shade.",
        value: "dimming",
      },
      {
        label: "Borders",
        description: current.borders.label,
        detail: "Show or hide subtle outlines between workbench areas.",
        value: "borders",
      },
      {
        label: "Configure all",
        description: "Guided setup",
        detail: "Step through mode, shade, accent, dimming, and borders.",
        value: "all",
      },
    ],
    "Umbra: what would you like to configure?",
  );
};

const pickSingleSetting = async (
  current: UmbraSettings,
  target: Exclude<ConfigurationTarget, "all">,
  previewSettings?: PreviewSettings,
): Promise<UmbraSettings | undefined> => {
  switch (target) {
    case "mode": {
      const mode = await pickMode(current, previewSettings);
      return mode ? { ...current, mode, shade: defaultShadeForMode(mode) } : undefined;
    }
    case "shade": {
      const shade = await pickShade(current, previewSettings);
      return shade ? { ...current, shade } : undefined;
    }
    case "accent": {
      const accent = await pickAccent(current, previewSettings);
      return accent ? { ...current, accent } : undefined;
    }
    case "dimming": {
      const dim = await pickDimming(current, previewSettings);
      return dim ? { ...current, dim } : undefined;
    }
    case "borders": {
      const borders = await pickBorders(current, previewSettings);
      return borders ? { ...current, borders } : undefined;
    }
  }
};

const pickAllSettings = async (
  current: UmbraSettings,
  previewSettings?: PreviewSettings,
): Promise<UmbraSettings | undefined> => {
  const mode = await pickMode(current, previewSettings);
  if (!mode) return undefined;
  const withMode = { ...current, mode, shade: defaultShadeForMode(mode) };

  const shade = await pickShade(withMode, previewSettings);
  if (!shade) return undefined;
  const withShade = { ...withMode, shade };

  const accent = await pickAccent(withShade, previewSettings);
  if (!accent) return undefined;
  const withAccent = { ...withShade, accent };

  const dim = await pickDimming(withAccent, previewSettings);
  if (!dim) return undefined;
  const withDimming = { ...withAccent, dim };

  const borders = await pickBorders(withDimming, previewSettings);
  if (!borders) return undefined;

  return { ...withDimming, borders };
};

const pickMode = async (
  current: UmbraSettings,
  previewSettings?: PreviewSettings,
): Promise<Mode | undefined> => {
  return pickValue(
    modes.map((mode) => ({
      label: itemLabel(titleCase(mode), current.mode === mode),
      description: mode === "dark" ? "Umbra Dark" : "Umbra Light",
      value: mode,
      current: current.mode === mode,
    })),
    "Umbra: select mode",
    (mode) => ({ ...current, mode, shade: defaultShadeForMode(mode) }),
    previewSettings,
  );
};

const pickShade = async (
  current: UmbraSettings,
  previewSettings?: PreviewSettings,
): Promise<ShadeVariant | undefined> => {
  const noun = current.mode === "dark" ? "darkness" : "lightness";

  return pickValue(
    shadeVariants.map((shade) => ({
      label: itemLabel(`Level ${shade.level}`, current.shade.id === shade.id),
      description: shadeLabel(current.mode, shade),
      detail: levelSlider(shade.level),
      value: shade,
      current: current.shade.id === shade.id,
    })),
    `Umbra: select ${noun} level`,
    (shade) => ({ ...current, shade }),
    previewSettings,
  );
};

const pickAccent = async (
  current: UmbraSettings,
  previewSettings?: PreviewSettings,
): Promise<AccentFamily | undefined> => {
  return pickValue(
    accentFamilies.map((accent) => ({
      label: itemLabel(titleCase(accent), current.accent === accent),
      description: "Accent color",
      value: accent,
      current: current.accent === accent,
    })),
    "Umbra: select accent",
    (accent) => ({ ...current, accent }),
    previewSettings,
  );
};

const pickDimming = async (
  current: UmbraSettings,
  previewSettings?: PreviewSettings,
): Promise<DimVariant | undefined> => {
  return pickValue(
    dimVariants.map((dim) => ({
      label: itemLabel(`Level ${dim.level}`, current.dim.id === dim.id),
      description: `${dim.label} dimming`,
      detail: levelSlider(dim.level),
      value: dim,
      current: current.dim.id === dim.id,
    })),
    "Umbra: select editor color dimming",
    (dim) => ({ ...current, dim }),
    previewSettings,
  );
};

const pickBorders = async (
  current: UmbraSettings,
  previewSettings?: PreviewSettings,
): Promise<BorderVariant | undefined> => {
  return pickValue(
    borderVariants.map((borders) => ({
      label: itemLabel(borders.label, current.borders.id === borders.id),
      description: borders.description,
      value: borders,
      current: current.borders.id === borders.id,
    })),
    "Umbra: select borders",
    (borders) => ({ ...current, borders }),
    previewSettings,
  );
};

const pickValue = async <Value>(
  items: PickItem<Value>[],
  title: string,
  preview?: (value: Value) => UmbraSettings,
  previewSettings?: PreviewSettings,
): Promise<Value | undefined> => {
  const picker = vscode.window.createQuickPick<PickItem<Value>>();
  const activeItem = items.find((item) => item.current) ?? items[0];
  picker.title = title;
  picker.ignoreFocusOut = true;
  picker.items = items;
  picker.matchOnDescription = true;
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
  });
};

const itemLabel = (label: string, selected: boolean): string => (selected ? `$(check) ${label}` : label);

const shadeLabel = (mode: Mode, shade: ShadeVariant): string => {
  return mode === "dark" ? shade.darkLabel : shade.lightLabel;
};

const levelSlider = (level: number): string => {
  return Array.from({ length: 5 }, (_value, index) => (index + 1 === level ? "●" : "○")).join(" ");
};
