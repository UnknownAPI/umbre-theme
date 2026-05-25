import { formatHex, formatHex8, interpolate, parse, wcagContrast, type Color } from "culori";
import { clamp } from "es-toolkit";
import tailwindColors from "tailwindcss/colors";

export const shadeSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Shade = (typeof shadeSteps)[number];

type Scale = Partial<Record<Shade, string>>;
type FlatTailwindColor = "black" | "white";

const colorCache = new Map<string, string>();
const alphaCache = new Map<string, string>();
const mixCache = new Map<string, string>();

export const tw = (family: string, shade: Shade): string => {
  const key = `${family}-${shade}`;
  const cached = colorCache.get(key);
  if (cached) return cached;

  const raw = (tailwindColors as Record<string, Scale>)[family]?.[shade];
  if (!raw) throw new Error(`Unknown palette color: ${family}-${shade}`);

  const hex = parseTailwindColor(raw, key);
  colorCache.set(key, hex);
  return hex;
};

export const twFlat = (name: FlatTailwindColor): string => {
  const cached = colorCache.get(name);
  if (cached) return cached;

  const raw = (tailwindColors as Record<FlatTailwindColor, string>)[name];
  const hex = parseTailwindColor(raw, name);
  colorCache.set(name, hex);
  return hex;
};

export const black = (): string => twFlat("black");

export const white = (): string => twFlat("white");

export const transparent = (): string => withAlpha(black(), 0);

export const withAlpha = (hex: string, opacity: number): string => {
  const alpha = clamp(opacity, 0, 1);
  const key = `${hex}:${alpha}`;
  const cached = alphaCache.get(key);
  if (cached) return cached;

  const parsed = parseColor(hex, hex);
  const value = formatHex8({ ...parsed, alpha }).toLowerCase();
  alphaCache.set(key, value);
  return value;
};

export const mix = (from: string, to: string, amount: number): string => {
  const clampedAmount = clamp(amount, 0, 1);
  const key = `${from}:${to}:${clampedAmount}`;
  const cached = mixCache.get(key);
  if (cached) return cached;

  const mixer = interpolate([parseColor(from, from), parseColor(to, to)], "oklab");
  const value = toHex(mixer(clampedAmount), `${from} mixed with ${to}`).toLowerCase();
  mixCache.set(key, value);
  return value;
};

export const darken = (hex: string, amount: number): string => mix(hex, black(), amount);

export const lighten = (hex: string, amount: number): string => mix(hex, white(), amount);

export const readableOn = (hex: string): string => {
  return wcagContrast(hex, black()) >= wcagContrast(hex, white()) ? black() : white();
};

const parseTailwindColor = (raw: string, label: string): string => toHex(parseColor(raw, label), label);

const parseColor = (raw: string, label: string): Color => {
  const parsed = parse(raw);
  if (!parsed) throw new Error(`Unable to parse color: ${label} = ${raw}`);
  return parsed;
};

const toHex = (color: Color | undefined, label: string): string => {
  const hex = formatHex(color);
  if (!hex) throw new Error(`Unable to format color: ${label}`);
  return hex.toLowerCase();
};
