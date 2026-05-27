import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { rootDir, vsixPath } from "@scripts/build/paths.ts";
import { execa } from "execa";

type GitHubRelease = {
  assets?: Array<{
    name?: unknown;
    url?: unknown;
  }>;
};

const ignoredEntries = new Set(["[Content_Types].xml", "extension.vsixmanifest"]);

const githubHeaders = (token: string): Record<string, string> => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
});

const hash = (content: Buffer): string => createHash("sha256").update(content).digest("base64url");

const requireString = (value: unknown, label: string): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value;
};

const packageJson = JSON.parse(await readFile(new URL("package.json", rootDir), "utf8")) as {
  name?: unknown;
};
const packageName = requireString(packageJson.name, "package.json name");
const assetName = `${packageName}.vsix`;
const localVsixPath = vsixPath.pathname;

const fetchLatestRelease = async (repo: string, token: string): Promise<GitHubRelease | undefined> => {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: githubHeaders(token),
  });

  if (response.status === 404) {
    console.log("No previous GitHub release found; assuming package changed.");
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`Failed to read latest GitHub release: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as GitHubRelease;
};

const downloadAsset = async (url: string, destinationPath: string, token: string): Promise<void> => {
  const response = await fetch(url, {
    headers: {
      ...githubHeaders(token),
      Accept: "application/octet-stream",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download latest ${assetName}: ${response.status} ${response.statusText}`);
  }

  await writeFile(destinationPath, Buffer.from(await response.arrayBuffer()));
};

const payloadEntries = async (path: string): Promise<string[]> => {
  const { stdout } = await execa("unzip", ["-Z1", path]);
  return stdout
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && !ignoredEntries.has(entry))
    .sort();
};

const zipEntry = async (path: string, entry: string): Promise<Buffer> => {
  const { stdout } = await execa("unzip", ["-p", path, entry], { encoding: "buffer" });
  return Buffer.from(stdout);
};

const normalizedZipEntry = async (path: string, entry: string): Promise<Buffer> => {
  const content = await zipEntry(path, entry);
  if (entry !== "extension/package.json") return content;

  const manifest = JSON.parse(content.toString("utf8")) as { version?: unknown };
  delete manifest.version;
  return Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
};

const packagePayloadsMatch = async (previousPath: string, currentPath: string): Promise<boolean> => {
  const [previousEntries, currentEntries] = await Promise.all([
    payloadEntries(previousPath),
    payloadEntries(currentPath),
  ]);

  if (previousEntries.join("\n") !== currentEntries.join("\n")) return false;

  for (const entry of currentEntries) {
    const [previousContent, currentContent] = await Promise.all([
      normalizedZipEntry(previousPath, entry),
      normalizedZipEntry(currentPath, entry),
    ]);
    if (!previousContent.equals(currentContent)) {
      console.log(`Package payload differs at ${entry}.`);
      console.log(`Previous: ${hash(previousContent)}`);
      console.log(`Current:  ${hash(currentContent)}`);
      return false;
    }
  }

  return true;
};

const hasPackageChanges = async (): Promise<boolean> => {
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;

  if (!repo || !token) {
    console.log("GITHUB_REPOSITORY or GITHUB_TOKEN is missing; assuming package changed.");
    return true;
  }

  const release = await fetchLatestRelease(repo, token);
  if (!release) return true;

  const asset = release.assets?.find((candidate) => candidate.name === assetName);
  const assetUrl = typeof asset?.url === "string" ? asset.url : undefined;
  if (!assetUrl) {
    console.log(`Latest release does not include ${assetName}; assuming package changed.`);
    return true;
  }

  const tempDir = await mkdtemp(join(tmpdir(), "umbre-release-"));
  const previousVsixPath = join(tempDir, assetName);

  try {
    await downloadAsset(assetUrl, previousVsixPath, token);
    return !(await packagePayloadsMatch(previousVsixPath, localVsixPath));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

const changed = await hasPackageChanges();
console.log(
  changed
    ? "Package payload changed; release may publish."
    : "Package payload matches latest release; skipping publish.",
);

if (process.env.GITHUB_OUTPUT) {
  await writeFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`, { flag: "a" });
}
