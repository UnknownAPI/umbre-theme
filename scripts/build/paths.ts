export const rootDir = new URL("../../", import.meta.url);
export const distDir = new URL("dist/", rootDir);
export const themesDir = new URL("themes/", distDir);
export const readmePath = new URL("README.md", rootDir);
export const licensePath = new URL("LICENSE", rootDir);
export const vsixPath = new URL("umbra-theme.vsix", rootDir);
