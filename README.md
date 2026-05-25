# Umbra

A quiet Tailwind theme for focused coding in VS Code and Cursor.

Umbra exposes only two editor themes: `Umbra Dark` and `Umbra Light`. The configuration command keeps the theme picker clean while letting you tune shade, accent, dimming, and border visibility. Default Tailwind colors are the only source colors.

## Features

- Dark and light themes with consistent Tailwind-derived color formulas.
- Five shade levels for the base surfaces.
- Seventeen Tailwind accent families.
- Five editor dimming levels, from balanced to very dim.
- Optional subtle borders.
- Pre-rendered theme variants instead of `workbench.colorCustomizations` or token customization settings.
- Pairs nicely with the Symbols icon theme (`miguelsolorio.symbols`).

## Commands

```bash
bun install
bun run format      # fixes formatting
bun run lint        # fixes lint issues
bun run typecheck   # TypeScript check
bun run test
bun run build
bun run package
bun run dev:cursor    # build and open an extension-development Cursor window
bun run dev:code      # build and open an extension-development VS Code window
bun run package       # create umbra-theme.vsix from the existing dist/
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

`dist/` and `umbra-theme.vsix` are generated artifacts and stay ignored. Rebuild them with `bun run build` or `bun run package`. Umbra does not write user/editor settings; configuration is stored in extension global state and applied by swapping generated theme files.
