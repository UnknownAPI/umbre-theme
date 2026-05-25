# Umbra

A quiet Tailwind theme for focused coding in VS Code and Cursor.

Umbra exposes only two editor themes: `Umbra Dark` and `Umbra Light`. The configuration command keeps the theme picker clean while letting you tune shade, accent, editor dimming, panel contrast, terminal contrast, and border intensity. Default Tailwind colors are the only source colors.

## Features

- Dark and light themes with consistent Tailwind-derived color formulas.
- Five shade levels for the base surfaces.
- Seventeen Tailwind accent families.
- Five labeled editor-only dimming levels for syntax colors.
- Five labeled panel contrast levels for sidebars, panels, tabs, and widgets.
- Five labeled terminal contrast levels.
- Five labeled border intensity levels, including hidden borders.
- A recommended defaults reset: level 3 for shade, syntax, panels, and terminal; level 2 borders.
- Generated Umbra-owned theme files instead of `workbench.colorCustomizations` or token customization settings.
- Pairs nicely with the Symbols icon theme (`miguelsolorio.symbols`).

## Commands

```bash
bun install
bun run format      # fixes formatting
bun run lint        # fixes lint issues
bun run typecheck   # TypeScript check
bun run test
bun run build          # create dist/
bun run package        # create umbra-theme.vsix from the existing dist/
bun run dev:cursor     # fresh build and open a new extension-development Cursor window
bun run dev:code       # fresh build and open a new extension-development VS Code window
bun run install:cursor # install the existing VSIX into Cursor
bun run install:vscode # install the existing VSIX into VS Code
```

A full local release loop is: dev, build, package, install. The package script uses the existing `dist/`, and the install scripts install the already-packaged `umbra-theme.vsix`; run `bun run build && bun run package` first after code changes. After installing into an already-open editor window, run `Developer: Reload Window` once so the window uses the new extension build. Umbra never writes editor settings, so select `Umbra Dark` or `Umbra Light` from `Preferences: Color Theme` yourself.

## Editor commands

Run these from the Command Palette:

- `Umbra: Configure Theme` — choose what to edit, preview through generated theme files, then apply once when finished.
- `Umbra: Toggle Opposite Dark/Light Mode` — prepare the opposite Umbra mode without writing editor settings; select `Umbra Dark`/`Umbra Light` in the Color Theme picker to switch the active mode.

## Project layout

```text
umbra-theme/
├── src/                 # runtime extension and theme color model
├── scripts/             # build, package, install, and validation entrypoints
├── test/                # sample files for visual inspection
└── dist/                # generated extension output (ignored)
```

`dist/` and `umbra-theme.vsix` are generated artifacts and stay ignored. Rebuild them with `bun run build && bun run package`. Umbra does not write user/editor settings; configuration is stored in extension global state and applied by writing Umbra-owned generated theme files.
