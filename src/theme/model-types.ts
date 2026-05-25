import type { AccentFamily, BorderVariant, DimVariant, Mode, ShadeVariant } from "@/config.ts";

export type Accent = {
  family: AccentFamily;
  main: string;
  hover: string;
  subdued: string;
  faint: string;
  border: string;
  on: string;
};

export type Surfaces = {
  bg: string;
  editor: string;
  chrome0: string;
  chrome1: string;
  chrome2: string;
  chrome3: string;
  overlay: string;
  overlay2: string;
  raised: string;
  line: string;
  lineStrong: string;
  fg: string;
  muted: string;
  subtle: string;
  deemphasized: string;
  ghost: string;
  selection: string;
  selectionSoft: string;
  shadow: string;
  inverse: string;
  isDark: boolean;
};

export type Syntax = {
  foreground: string;
  comment: string;
  keyword: string;
  storage: string;
  operator: string;
  string: string;
  regexp: string;
  number: string;
  constant: string;
  function: string;
  method: string;
  type: string;
  class: string;
  interface: string;
  tag: string;
  attribute: string;
  property: string;
  parameter: string;
  special: string;
  markup: string;
  invalid: string;
  warning: string;
  info: string;
  added: string;
  modified: string;
  removed: string;
};

export type ThemeModel = {
  mode: Mode;
  accentFamily: AccentFamily;
  shade: ShadeVariant;
  dim: DimVariant;
  borders: BorderVariant;
  accent: Accent;
  surfaces: Surfaces;
  syntax: Syntax;
  uiSyntax: Syntax;
};
