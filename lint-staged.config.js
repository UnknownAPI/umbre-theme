const quote = (file) => JSON.stringify(file);

const scriptFilePattern = /\.(?:cjs|js|jsx|mjs|ts|tsx)$/u;

export default {
  "*.{cjs,css,js,json,jsonc,jsx,md,mdx,mjs,ts,tsx,yaml,yml}": (files) => {
    const formattedFiles = files.map(quote).join(" ");
    const lintableFiles = files
      .filter((file) => scriptFilePattern.test(file))
      .map(quote)
      .join(" ");

    return [
      lintableFiles ? `oxlint --fix --no-error-on-unmatched-pattern ${lintableFiles}` : undefined,
      `oxfmt --write ${formattedFiles}`,
    ].filter(Boolean);
  },
};
