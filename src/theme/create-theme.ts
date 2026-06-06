import type {
  AccentFamily,
  BorderVariant,
  DimVariant,
  Mode,
  PanelVariant,
  ShadeVariant,
  SyntaxStyle,
  TerminalVariant,
} from "@/config.ts";
import {
  defaultAccent,
  defaultBorders,
  defaultDimming,
  defaultPanels,
  defaultShadeForMode,
  defaultSyntaxStyle,
  defaultTerminal,
} from "@/config.ts";
import { createThemeModel } from "@/theme/model.ts";
import { themeFileName, themeLabel } from "@/theme/naming.ts";
import { semanticTokenColors } from "@/theme/semantic.ts";
import { tokenColors } from "@/theme/tokens/index.ts";
import type { BuiltTheme, ThemeDocument } from "@/theme/types.ts";
import { workbenchColors } from "@/theme/workbench/index.ts";

export type ThemeDocumentInput = {
  mode: Mode;
  shade: ShadeVariant;
  accent: AccentFamily;
  dim: DimVariant;
  panels: PanelVariant;
  terminal: TerminalVariant;
  borders: BorderVariant;
  syntaxStyle: SyntaxStyle;
};

export const createTheme = (mode: Mode): BuiltTheme => {
  const label = themeLabel(mode);
  const fileName = themeFileName(mode);
  const document = createThemeDocumentFromInput(label, {
    mode,
    shade: defaultShadeForMode(mode),
    accent: defaultAccent,
    dim: defaultDimming,
    panels: defaultPanels,
    terminal: defaultTerminal,
    borders: defaultBorders,
    syntaxStyle: defaultSyntaxStyle,
  });

  return {
    fileName,
    document,
    contribution: {
      id: label,
      label,
      uiTheme: mode === "dark" ? "vs-dark" : "vs",
      path: `./themes/${fileName}`,
      _watch: true,
    },
  };
};

export const createThemeDocumentFromInput = (name: string, input: ThemeDocumentInput): ThemeDocument => {
  const model = createThemeModel({
    mode: input.mode,
    shade: input.shade,
    accentFamily: input.accent,
    dim: input.dim,
    panels: input.panels,
    terminal: input.terminal,
    borders: input.borders,
    syntaxStyle: input.syntaxStyle,
  });

  return createThemeDocument(name, model);
};

export const createThemeDocument = (
  name: string,
  model: ReturnType<typeof createThemeModel>,
): ThemeDocument => ({
  name,
  type: model.mode,
  semanticHighlighting: true,
  colors: workbenchColors(model),
  tokenColors: tokenColors(model),
  semanticTokenColors: semanticTokenColors(model),
});
