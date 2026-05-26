import { product } from "@/product.ts";

export type CommandContribution = {
  command: string;
  title: string;
  category: string;
};

export const commandContributions = (): CommandContribution[] => [
  {
    command: product.commands.configure.id,
    title: product.commands.configure.title,
    category: product.displayName,
  },
  {
    command: product.commands.toggleOpposite.id,
    title: product.commands.toggleOpposite.title,
    category: product.displayName,
  },
];
