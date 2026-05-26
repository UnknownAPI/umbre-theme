import { cp, copyFile as copyNodeFile, mkdir, rm, writeFile } from "node:fs/promises";

export const ensureDir = async (path: URL): Promise<void> => {
  await mkdir(path, { recursive: true });
};

export const remove = async (path: URL): Promise<void> => {
  await rm(path, { force: true, recursive: true });
};

export const removeFile = async (path: URL): Promise<void> => {
  await rm(path, { force: true });
};

export const writeText = async (path: URL, content: string): Promise<void> => {
  await writeFile(path, content);
};

export const copyFile = async (from: URL, to: URL): Promise<void> => {
  await copyNodeFile(from, to);
};

export const copyDir = async (from: URL, to: URL): Promise<void> => {
  await cp(from, to, { recursive: true });
};
