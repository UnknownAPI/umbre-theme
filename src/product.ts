export const product = {
  displayName: "Umbre",
  themeFilePrefix: "umbre",
  settingsStorageKey: "umbre.themeSettings",
  recommendedExtensions: {
    symbols: {
      id: "miguelsolorio.symbols",
      name: "Symbols",
      iconThemeId: "symbols",
      promptStorageKey: "umbre.symbolsIconThemePromptDismissed",
      url: "https://marketplace.visualstudio.com/items?itemName=miguelsolorio.symbols",
    },
  },
  commands: {
    configure: {
      id: "umbre.configure",
      title: "Configure Theme",
    },
    toggleOpposite: {
      id: "umbre.toggleOpposite",
      title: "Toggle Opposite Mode",
    },
    chooseFont: {
      id: "umbre.chooseFont",
      title: "Choose Font",
    },
  },
} as const;

export const commandIds = {
  configure: product.commands.configure.id,
  toggleOpposite: product.commands.toggleOpposite.id,
  chooseFont: product.commands.chooseFont.id,
} as const;
