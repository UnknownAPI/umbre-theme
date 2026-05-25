import { runCommand } from "@/utils/process.ts";
import { vsixPath } from "@scripts/build/paths.ts";

const requireEnv = (name: string, service: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Add a GitHub Actions secret for ${service} publishing.`);
  }
  return value;
};

const vscePat = requireEnv("VSCE_PAT", "Visual Studio Marketplace");
const ovsxPat = requireEnv("OVSX_PAT", "Open VSX");

await runCommand("bun", ["x", "vsce", "publish", "--packagePath", vsixPath.pathname, "-p", vscePat]);
await runCommand("bun", ["x", "ovsx", "publish", vsixPath.pathname, "-p", ovsxPat]);
