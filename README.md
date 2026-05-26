<p align="center">
  <img src="./assets/logo.png" width="112" alt="Umbre logo">
</p>

<h1 align="center">Umbre</h1>

<p align="center">
  A quiet theme for VS Code and Cursor.
</p>

<p align="center">
  <strong>Dark and light themes with simple built-in customization.</strong>
</p>

<p align="center">
  <img src="./assets/screenshots.png" alt="Umbre theme screenshot">
</p>

---

Umbre is one calm theme with built-in light, balanced, and dark configurations. You can tune the whole theme from the Command Palette without editing JSON or adding color overrides to your settings.

It also includes three recommended presets:

- **Light**: a bright, soft setup for daytime work.
- **Balanced**: the default Umbre look.
- **Pure black**: a minimal true-black setup for very dark environments.

## Install

Umbre is published on:

- [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ohkimur.umbre-theme)
- [Open VSX](https://open-vsx.org/extension/ohkimur/umbre-theme)

After installing, open **Preferences: Color Theme** and choose **Umbre**. The configuration picker opens when Umbre is selected.

Umbre pairs well with [Symbols](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.symbols), a simple file icon theme that works in both VS Code and Cursor. After installation, Umbre can help you install Symbols and open the icon theme picker.

## Customize

Run **Umbre: Configure Theme** from the Command Palette.

Start with a recommended preset, adjust each part yourself, or run **Umbre: Toggle Opposite Mode** to jump to the matching light/dark opposite of your current setup.

If you enable system appearance sync, Umbre keeps the two sides in parity when macOS or Windows switches light/dark appearance.

You can change:

- **Shade**: choose a softer or deeper editor background.
- **Accent**: pick the highlight color family.
- **Syntax strength**: keep code colors vivid, soften them, or make them nearly monochrome.
- **Panels and sidebars**: control how much the workbench chrome stands apart from the editor.
- **Terminal contrast**: tune the terminal background separately.
- **Borders**: hide separators or make the workspace structure clearer.
- **System appearance sync**: optionally follow macOS or Windows light/dark changes.
- **Recommended fonts**: install and preview a bundled JetBrains Mono, Fira Code, or Hack Nerd Font. Skipping restores your previous font setting.

Changes preview while you choose. When you apply them, Umbre updates its own generated theme files and keeps editor settings clean, except when you explicitly apply a recommended font.

## Commands

- **Umbre: Configure Theme**: customize the active Umbre theme.
- **Umbre: Toggle Opposite Mode**: switch to the calculated light/dark opposite.
- **Umbre: Choose Font**: preview and apply a bundled recommended Nerd Font.
