type Status = "idle" | "loading" | "ready" | "error";

interface ThemeState {
  readonly status: Status;
  readonly accent: string;
  readonly retries: number;
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const loadTheme = async (accent = "amber"): Promise<ThemeState> => {
  await delay(120);
  return { status: "ready", accent, retries: 0 };
};
