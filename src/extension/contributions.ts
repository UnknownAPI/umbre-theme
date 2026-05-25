export type CommandContribution = {
  command: string;
  title: string;
  category: string;
};

export const commandContributions = (): CommandContribution[] => [
  {
    command: "umbra.configure",
    title: "Configure Theme",
    category: "Umbra",
  },
  {
    command: "umbra.toggleMode",
    title: "Toggle Opposite Dark/Light Mode",
    category: "Umbra",
  },
];
