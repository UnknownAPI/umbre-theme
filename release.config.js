import { readFileSync } from "node:fs";

const isDryRun = process.argv.includes("--dry-run") || process.argv.includes("-d");
const packageJson = JSON.parse(readFileSync(new URL("package.json", import.meta.url), "utf8"));
const vsixFile = `${packageJson.name}.vsix`;

const marketplaceVerification = isDryRun
  ? {}
  : { verifyConditionsCmd: "bun scripts/release/verify-marketplaces.ts" };

/** @type {NonNullable<import('semantic-release').GlobalConfig['plugins']>} */
const releaseOnlyPlugins = isDryRun
  ? []
  : [
      [
        "@semantic-release/git",
        {
          assets: ["CHANGELOG.md"],
          message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
        },
      ],
      [
        "@semantic-release/github",
        {
          assets: [
            {
              path: vsixFile,
              label: "VS Code theme package",
            },
          ],
          successCommentCondition: false,
          failCommentCondition: false,
        },
      ],
    ];

/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ["main"],
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        linkCompare: false,
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/exec",
      {
        ...marketplaceVerification,
        prepareCmd:
          "git tag -d v0.0.0 >/dev/null 2>&1 || true; UMBRE_VERSION=${nextRelease.version} bun run build && bun run package",
        publishCmd: "bun scripts/release/publish-marketplaces.ts",
      },
    ],
    ...releaseOnlyPlugins,
  ],
};
