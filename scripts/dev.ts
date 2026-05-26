import { runCommand } from "@/utils/process.ts";
import { distDir } from "@scripts/build/paths.ts";

const editors = {
  cursor: "cursor",
  code: "code",
} as const;

type EditorId = keyof typeof editors;

const parseEditor = (args: string[]): EditorId => {
  const normalized = args.filter((arg) => arg !== "--");
  const [target] = normalized;

  if (target === "--cursor" || target === "cursor") return "cursor";
  if (target === "--code" || target === "--vscode" || target === "code" || target === "vscode") {
    return "code";
  }

  throw new Error("Choose an editor: bun scripts/dev.ts --cursor or bun scripts/dev.ts --code");
};

const editor = parseEditor(process.argv.slice(2));

await runCommand("bun", ["x", "tsdown"]);
await runCommand(editors[editor], ["--new-window", `--extensionDevelopmentPath=${distDir.pathname}`]);
