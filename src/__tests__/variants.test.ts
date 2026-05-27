import { describe, expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";

import {
  accentFamilies,
  borderVariants,
  defaultBorders,
  defaultDarkShade,
  defaultDimming,
  defaultLightShade,
  defaultPanels,
  defaultTerminal,
  dimVariants,
  modes,
  panelVariants,
  shadeVariants,
  terminalVariants,
} from "@/config.ts";
import { oppositeSettings } from "@/runtime/opposite-settings.ts";
import { createThemeModel, type ThemeModel } from "@/theme/model.ts";
import { transparent, white } from "@/theme/palette.ts";
import { semanticTokenColors } from "@/theme/semantic.ts";
import { tokenColors } from "@/theme/tokens/index.ts";
import { workbenchColors } from "@/theme/workbench/index.ts";
import { createThemes } from "@scripts/build/themes.ts";
import { wcagContrast } from "culori";

const expectedVariantCount =
  modes.length *
  shadeVariants.length *
  accentFamilies.length *
  dimVariants.length *
  panelVariants.length *
  terminalVariants.length *
  borderVariants.length;
const validatedCoreVariantCount =
  modes.length * shadeVariants.length * accentFamilies.length * dimVariants.length * borderVariants.length;

describe("Umbre generated theme inventory", () => {
  test("contributes one picker theme", () => {
    const themes = createThemes();

    expect(themes).toHaveLength(1);
    expect(themes.map((theme) => theme.contribution.label)).toEqual(["Umbre"]);
    expect(themes.every((theme) => theme.contribution._watch)).toBe(true);
  });

  test("keeps variants generated on demand instead of contributed to the picker", () => {
    expect(expectedVariantCount).toBe(106250);
    expect(createThemes().flatMap((theme) => theme.contribution)).toHaveLength(1);
  });
});

describe("Umbre recommended defaults", () => {
  test("use balanced levels with quiet terminal and quieter borders", () => {
    expect(defaultDarkShade.level).toBe(3);
    expect(defaultLightShade.level).toBe(3);
    expect(defaultDimming.level).toBe(3);
    expect(defaultPanels.level).toBe(3);
    expect(defaultTerminal.level).toBe(2);
    expect(defaultBorders.level).toBe(2);
  });
});

describe("Umbre opposite settings", () => {
  test("flip modes and mirror each level-based control", () => {
    const opposite = oppositeSettings({
      mode: "dark",
      shade: shadeVariants[4],
      accent: "amber",
      dim: dimVariants[1],
      panels: panelVariants[0],
      terminal: terminalVariants[3],
      borders: borderVariants[2],
      systemAware: true,
    });

    expect(opposite.mode).toBe("light");
    expect(opposite.accent).toBe("amber");
    expect(opposite.shade.level).toBe(1);
    expect(opposite.dim.level).toBe(4);
    expect(opposite.panels.level).toBe(5);
    expect(opposite.terminal.level).toBe(2);
    expect(opposite.borders.level).toBe(3);
    expect(opposite.systemAware).toBe(true);
  });
});

describe("Umbre surface recipes", () => {
  test("shade levels move progressively farther from paper white", () => {
    for (const mode of modes) {
      let previousContrast: number | undefined;

      for (const shade of shadeVariants) {
        const model = createThemeModel({
          mode,
          shade,
          accentFamily: "amber",
          dim: dimVariants[0],
          panels: defaultPanels,
          terminal: defaultTerminal,
          borders: borderVariants[2],
        });
        const contrastFromPaper = contrastRatio(model.surfaces.editor, white());

        if (previousContrast !== undefined) {
          expect(contrastFromPaper).toBeGreaterThan(previousContrast);
        }

        previousContrast = contrastFromPaper;
      }
    }
  });

  test("light shades visibly progress from paper white to shadow light", () => {
    const lightSurfaceSpread = shadeVariants.map((shade) => {
      const model = createThemeModel({
        mode: "light",
        shade,
        accentFamily: "amber",
        dim: dimVariants[0],
        panels: defaultPanels,
        terminal: defaultTerminal,
        borders: borderVariants[2],
      });
      return contrastRatio(model.surfaces.editor, white());
    });

    const firstLightSurface = lightSurfaceSpread[0];
    const lastLightSurface = lightSurfaceSpread.at(-1);
    expect(firstLightSurface).toBeDefined();
    expect(lastLightSurface).toBeDefined();
    expect(lastLightSurface! - firstLightSurface!).toBeGreaterThanOrEqual(0.2);
  });

  test("pure black still has usable raised surfaces", () => {
    const pureBlackShade = shadeVariants.find((shade) => shade.level === 5);
    expect(pureBlackShade).toBeDefined();

    const pureBlack = createThemeModel({
      mode: "dark",
      shade: pureBlackShade!,
      accentFamily: "amber",
      dim: dimVariants[0],
      panels: defaultPanels,
      terminal: defaultTerminal,
      borders: borderVariants[2],
    });

    expect(contrastRatio(pureBlack.surfaces.raised, pureBlack.surfaces.overlay)).toBeGreaterThanOrEqual(1.08);
    expect(contrastRatio(pureBlack.surfaces.raised, pureBlack.surfaces.editor)).toBeGreaterThanOrEqual(1.2);
  });

  test("editor dimming changes syntax without changing workbench colors", () => {
    for (const mode of modes) {
      const shade = mode === "dark" ? shadeVariants[2] : shadeVariants[0];
      const fullColor = createThemeModel({
        mode,
        shade,
        accentFamily: "amber",
        dim: dimVariants[0],
        panels: defaultPanels,
        terminal: defaultTerminal,
        borders: borderVariants[2],
      });
      const faintColor = createThemeModel({
        mode,
        shade,
        accentFamily: "amber",
        dim: dimVariants[4],
        panels: defaultPanels,
        terminal: defaultTerminal,
        borders: borderVariants[2],
      });

      expect(faintColor.syntax.keyword).not.toBe(fullColor.syntax.keyword);
      expect(faintColor.syntax.foreground).not.toBe(fullColor.syntax.foreground);
      expect(faintColor.surfaces).toEqual(fullColor.surfaces);
      expect(faintColor.accent).toEqual(fullColor.accent);
      expect(workbenchColors(faintColor)).toEqual(workbenchColors(fullColor));
    }
  });

  test("panel contrast changes chrome without moving the editor surface", () => {
    const lowContrast = createThemeModel({
      mode: "dark",
      shade: shadeVariants[4],
      accentFamily: "amber",
      dim: dimVariants[1],
      panels: panelVariants[0],
      terminal: defaultTerminal,
      borders: borderVariants[2],
    });
    const highContrast = createThemeModel({
      mode: "dark",
      shade: shadeVariants[4],
      accentFamily: "amber",
      dim: dimVariants[1],
      panels: panelVariants[4],
      terminal: defaultTerminal,
      borders: borderVariants[2],
    });

    expect(highContrast.surfaces.editor).toBe(lowContrast.surfaces.editor);
    expect(highContrast.surfaces.chrome3).not.toBe(lowContrast.surfaces.chrome3);
  });

  test("terminal contrast changes only terminal background", () => {
    for (const mode of modes) {
      const quietTerminal = createThemeModel({
        mode,
        shade: shadeVariants[4],
        accentFamily: "amber",
        dim: dimVariants[1],
        panels: defaultPanels,
        terminal: terminalVariants[0],
        borders: borderVariants[2],
      });
      const strongTerminal = createThemeModel({
        mode,
        shade: shadeVariants[4],
        accentFamily: "amber",
        dim: dimVariants[1],
        panels: defaultPanels,
        terminal: terminalVariants[4],
        borders: borderVariants[2],
      });

      expect(quietTerminal.surfaces).toEqual(strongTerminal.surfaces);
      expect(workbenchColors(quietTerminal)["terminal.background"]).not.toBe(
        workbenchColors(strongTerminal)["terminal.background"],
      );
    }
  });

  test("terminal contrast levels progress in dark and light modes", () => {
    for (const mode of modes) {
      let previousContrast: number | undefined;

      for (const terminal of terminalVariants) {
        const model = createThemeModel({
          mode,
          shade: shadeVariants[2],
          accentFamily: "amber",
          dim: dimVariants[1],
          panels: defaultPanels,
          terminal,
          borders: borderVariants[2],
        });
        const colors = workbenchColors(model);
        const terminalBackground = colors["terminal.background"];
        expect(terminalBackground).toBeTruthy();
        const contrast = contrastRatio(terminalBackground!, model.surfaces.editor);

        if (previousContrast !== undefined) {
          expect(contrast).toBeGreaterThan(previousContrast);
        }

        previousContrast = contrast;
      }
    }
  });
});

describe("Umbre variant colors", () => {
  test("core generated variants include valid workbench, token, semantic, and border colors", () => {
    let variantCount = 0;

    for (const mode of modes) {
      for (const shade of shadeVariants) {
        for (const accentFamily of accentFamilies) {
          for (const dim of dimVariants) {
            for (const borders of borderVariants) {
              const model = createThemeModel({
                mode,
                shade,
                accentFamily,
                dim,
                panels: defaultPanels,
                terminal: defaultTerminal,
                borders,
              });
              const colors = workbenchColors(model);
              const tokens = tokenColors(model);
              const semanticTokens = semanticTokenColors(model);

              expect(colors["editor.background"]).toBeTruthy();
              expect(tokens.length).toBeGreaterThan(0);
              expect(Object.keys(semanticTokens).length).toBeGreaterThan(0);
              expect(colors["panel.border"] === transparent()).toBe(borders.opacity === 0);

              expect(colors["window.activeBorder"]).toBe(colors["sideBar.background"]);
              expect(colors["window.inactiveBorder"]).toBe(colors["sideBar.background"]);

              assertModelContrast(model);
              variantCount += 1;
            }
          }
        }
      }
    }

    expect(variantCount).toBe(validatedCoreVariantCount);
  });
});

describe("Umbre source hygiene", () => {
  test("source files do not contain manual hex literals", async () => {
    const files = await sourceFiles(new URL("../../src/", import.meta.url));
    const hexLiteral = /#(?:[\dA-Fa-f]{3,8})\b/;

    for (const file of files) {
      const source = await readFile(file, "utf8");
      expect(
        hexLiteral.test(source),
        `${file.pathname} should use Tailwind colors instead of hex literals`,
      ).toBe(false);
    }
  });
});

const assertModelContrast = (model: ThemeModel): void => {
  const bg = model.surfaces.editor;
  assertContrast(model.surfaces.fg, bg, 4.5, `${model.mode} foreground`);
  assertContrast(model.surfaces.muted, bg, 3, `${model.mode} muted foreground`);
  assertContrast(model.syntax.comment, bg, 2, `${model.mode} comment`);

  for (const [key, value] of Object.entries(model.syntax)) {
    if (key === "comment") continue;
    assertContrast(value, bg, 4, `${model.mode} syntax ${key}`);
  }
};

const assertContrast = (foreground: string, background: string, minimum: number, label: string): void => {
  const ratio = contrastRatio(foreground, background);
  expect(ratio, `${label} contrast ${ratio.toFixed(2)} should be >= ${minimum}`).toBeGreaterThanOrEqual(
    minimum,
  );
};

const contrastRatio = (foreground: string, background: string): number =>
  wcagContrast(foreground, background);

const sourceFiles = async (directory: URL): Promise<URL[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const url = new URL(entry.name, directory);
      if (entry.isDirectory()) return sourceFiles(new URL(`${entry.name}/`, directory));
      return Promise.resolve(entry.isFile() && entry.name.endsWith(".ts") ? [url] : []);
    }),
  );
  return files.flat();
};
