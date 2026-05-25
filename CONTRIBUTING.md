# Contributing to Umbre

Thanks for taking the time to improve Umbre. Contributions are welcome, whether they are bug reports, design feedback, documentation updates, or code changes.

## Ways to contribute

- Report bugs with clear steps to reproduce.
- Suggest improvements to theme colors, contrast, commands, or documentation.
- Open pull requests for focused fixes and enhancements.
- Share accessibility or readability feedback from real daily use.

## Development setup

Umbre uses Bun for development.

```bash
bun install
bun run build
bun run typecheck
bun run test
```

Useful local commands:

```bash
bun run dev:code       # build and open a VS Code theme-development window
bun run dev:cursor     # build and open a Cursor theme-development window
bun run package        # create the VSIX package from the existing dist/
```

## Pull request guidelines

- Keep changes focused and easy to review.
- Use conventional commit-style titles when possible, such as `fix:`, `feat:`, `docs:`, or `chore:`.
- Run the relevant checks before opening a pull request.
- Include a short description of what changed and why.
- For visual theme changes, describe the affected mode, surface, token group, or command flow.

## Releasing

Releases are automated with `semantic-release` from conventional commits on `main`. A release builds and packages the theme, publishes the VSIX to the Visual Studio Marketplace and Open VSX, then attaches it to the GitHub Release.

Required GitHub Actions secrets:

- `VSCE_PAT` — Azure DevOps Personal Access Token with **Marketplace: Manage** scope for the Visual Studio Marketplace.
- `OVSX_PAT` — Open VSX access token for Cursor-compatible distribution through Open VSX.

Use `.env.example` as the setup checklist for both tokens. Local previews are available with:

```bash
bun run release:dry
```

## Project guardrails

- Do not write, rewrite, or clean user/editor settings such as `settings.json`, `workbench.colorCustomizations`, token customizations, or `workbench.colorTheme`.
- Store configuration through Umbre-owned generated theme files and extension global state.
- Source theme colors must come from the project color system; do not add manual hex literals in source files.
- Keep generated artifacts such as `dist/` and `.vsix` packages out of commits.

## Licensing

By contributing, you agree that your contribution will be licensed under the Apache License 2.0.
