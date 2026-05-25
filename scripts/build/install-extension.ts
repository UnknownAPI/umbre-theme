import { access } from "node:fs/promises";

import { runCommand } from "@/utils/process.ts";
import { checkbox, confirm } from "@inquirer/prompts";
import { vsixPath } from "@scripts/build/paths.ts";
import { execa } from "execa";

const editors = {
  cursor: {
    label: "Cursor",
    command: "cursor",
  },
  code: {
    label: "VS Code",
    command: "code",
  },
} as const;

const symbolsExtension = {
  id: "miguelsolorio.symbols",
  label: "Symbols icon theme",
} as const;

type EditorId = keyof typeof editors;
type Editor = (typeof editors)[EditorId];
type EditorState = Editor & {
  id: EditorId;
  available: boolean;
};

export const installExtension = async (args: string[] = []): Promise<void> => {
  const requestedTargets = selectedEditors(args);
  const editorStates = await detectEditors();
  const targetIds = requestedTargets.length > 0 ? requestedTargets : await promptForEditors(editorStates);
  const targets = targetIds.map((id) => requireAvailableEditor(id, editorStates));
  await requirePackagedVsix();
  const shouldPromptForIcons = requestedTargets.length === 0 && process.stdout.isTTY;

  for (const editor of targets) {
    await runCommand(editor.command, ["--install-extension", vsixPath.pathname, "--force"]);
    console.log(
      `Installed Umbra in ${editor.label}. Reload open ${editor.label} windows to activate this build.`,
    );
    await suggestSymbols(editor, shouldPromptForIcons);
  }
};

const requirePackagedVsix = async (): Promise<void> => {
  try {
    await access(vsixPath);
  } catch {
    throw new Error("umbra-theme.vsix was not found. Run `bun run package` before installing.");
  }
};

const selectedEditors = (args: string[]): EditorId[] => {
  const selected = new Set<EditorId>();

  for (const arg of args.filter((value) => value !== "--")) {
    if (arg === "--cursor") selected.add("cursor");
    else if (arg === "--code" || arg === "--vscode") selected.add("code");
    else if (arg === "--all") {
      selected.add("cursor");
      selected.add("code");
    } else {
      throw new Error(`Unknown install option: ${arg}. Use --cursor, --code, --vscode, or --all.`);
    }
  }

  return [...selected];
};

const detectEditors = async (): Promise<EditorState[]> => {
  return Promise.all(
    Object.entries(editors).map(async ([id, editor]) => ({
      id: id as EditorId,
      ...editor,
      available: await commandExists(editor.command),
    })),
  );
};

const promptForEditors = async (editorStates: EditorState[]): Promise<EditorId[]> => {
  const choices = editorStates
    .filter((editor) => editor.available)
    .map((editor) => ({
      name: editor.label,
      value: editor.id,
    }));

  if (choices.length === 0) {
    throw new Error(
      "No supported editor CLI was found. Install the `cursor` or `code` command and try again.",
    );
  }

  const selected = await checkbox<EditorId>({
    message: "Install Umbra in which editor?",
    required: true,
    choices,
  });

  return [...selected];
};

const requireAvailableEditor = (id: EditorId, editorStates: EditorState[]): EditorState => {
  const editor = editorStates.find((state) => state.id === id);
  if (!editor?.available) {
    const label = editors[id].label;
    const command = editors[id].command;
    throw new Error(`${label} was requested, but the \`${command}\` CLI was not found.`);
  }
  return editor;
};

const suggestSymbols = async (editor: Editor, shouldPrompt: boolean): Promise<void> => {
  if (await hasExtension(editor.command, symbolsExtension.id)) return;

  if (shouldPrompt) {
    const shouldInstall = await confirm({
      message: `Install ${symbolsExtension.label} for ${editor.label}?`,
      default: true,
    });

    if (shouldInstall) {
      await runCommand(editor.command, ["--install-extension", symbolsExtension.id]);
      console.log(`Installed ${symbolsExtension.label} in ${editor.label}.`);
      return;
    }
  }

  console.log(
    `Tip: pair Umbra with ${symbolsExtension.label}: ${editor.command} --install-extension ${symbolsExtension.id}`,
  );
};

const hasExtension = async (command: string, extensionId: string): Promise<boolean> => {
  const result = await readCommandOutput(command, ["--list-extensions"]);
  if (result.exitCode !== 0) return false;
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase())
    .includes(extensionId.toLowerCase());
};

const commandExists = async (command: string): Promise<boolean> => {
  const result = await readCommandOutput(command, ["--version"]);
  return result.exitCode === 0;
};

const readCommandOutput = async (
  command: string,
  args: string[],
): Promise<{
  exitCode: number | null;
  stdout: string;
}> => {
  try {
    const result = await execa(command, args, { reject: false });
    return { exitCode: result.exitCode ?? null, stdout: result.stdout };
  } catch {
    return { exitCode: null, stdout: "" };
  }
};
