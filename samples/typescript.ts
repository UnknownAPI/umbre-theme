type Status = "idle" | "loading" | "ready" | "error";

interface ThemeState {
  readonly status: Status;
  readonly accent: string;
}

export const loadTheme = async (accent = "amber"): Promise<ThemeState> => {
  await Promise.resolve();
  return { status: "ready", accent };
};
