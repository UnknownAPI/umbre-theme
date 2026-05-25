import { readFileSync } from "node:fs";

export const rootDir = new URL("../../", import.meta.url);

const packageJson = JSON.parse(readFileSync(new URL("package.json", rootDir), "utf8")) as { name: string };

export const distDir = new URL("dist/", rootDir);
export const themesDir = new URL("themes/", distDir);
export const assetsDir = new URL("assets/", rootDir);
export const distAssetsDir = new URL("assets/", distDir);
export const logoPath = new URL("logo.png", assetsDir);
export const logoSourcePath = new URL("logo.svg", assetsDir);
export const readmePath = new URL("README.md", rootDir);
export const licensePath = new URL("LICENSE", rootDir);
export const vsixPath = new URL(`${packageJson.name}.vsix`, rootDir);
