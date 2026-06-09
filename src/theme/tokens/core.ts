import type { ThemeModel } from "@/theme/model.ts";
import { withAlpha } from "@/theme/palette.ts";
import { tokenRule } from "@/theme/token-rule.ts";
import type { TokenColor } from "@/theme/types.ts";

export const coreTokenColors = ({ surfaces, syntax }: ThemeModel): TokenColor[] => [
  {
    settings: {
      background: surfaces.editor,
      foreground: syntax.foreground,
    },
  },
  tokenRule("Comment", ["comment"], syntax.comment, "italic"),
  tokenRule("String", ["string", "constant.other.symbol"], syntax.string),
  tokenRule(
    "Regular Expressions",
    ["string.regexp", "constant.character.escape", "constant.other"],
    syntax.regexp,
  ),
  tokenRule("Number", ["constant.numeric"], syntax.constant),
  tokenRule("Built-in Constants", ["constant.language"], syntax.constant),
  tokenRule("Library Constants", ["support.constant"], syntax.operator, "italic"),
  tokenRule("Variable", ["variable"], syntax.foreground),
  tokenRule("Function Call Arguments", ["variable.parameter.function-call"], syntax.parameter),
  tokenRule("Member Variable", ["variable.member", "variable.other.property"], syntax.foreground),
  tokenRule("Language Variable", ["variable.language"], syntax.tag, "italic"),
  tokenRule("Storage", ["storage", "storage.type"], syntax.storage),
  tokenRule("Keyword", ["keyword"], syntax.keyword),
  tokenRule("Operators", ["keyword.operator", "punctuation.accessor"], syntax.operator),
  tokenRule(
    "Separators",
    ["punctuation.separator", "punctuation.terminator"],
    withAlpha(syntax.foreground, 0.72),
  ),
  tokenRule("Punctuation", ["punctuation.section", "punctuation.definition"], syntax.foreground),
  tokenRule(
    "Interpolation",
    ["punctuation.definition.template-expression", "punctuation.section.embedded"],
    syntax.keyword,
  ),
  tokenRule("Embedded Source", ["meta.embedded", "source.embedded"], syntax.foreground),
  tokenRule("Invalid", ["invalid", "message.error"], syntax.invalid),
];
