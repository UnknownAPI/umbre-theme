import type { ThemeModel } from "@/theme/model.ts";
import { withAlpha } from "@/theme/palette.ts";
import { tokenRule } from "@/theme/token-rule.ts";
import type { TokenColor } from "@/theme/types.ts";

export const codeTokenColors = ({ syntax }: ThemeModel): TokenColor[] => [
  tokenRule("Types", ["entity.name.type"], syntax.type),
  tokenRule("Inherited Class", ["entity.other.inherited-class"], syntax.tag),
  tokenRule("Library Type", ["support.type", "source.go storage.type"], syntax.tag),
  tokenRule("Classes", ["entity.name.class", "entity.name.struct", "support.class.component"], syntax.class),
  tokenRule("Interfaces", ["entity.name.interface"], syntax.interface),
  tokenRule("Function Name", ["entity.name.function"], syntax.function),
  tokenRule("Library Function", ["support.function", "support.macro"], syntax.markup),
  tokenRule(
    "Function Call",
    ["variable.function", "meta.function-call.generic", "support.function.go"],
    syntax.method,
  ),
  tokenRule("Function Arguments", ["variable.parameter", "meta.parameter"], syntax.foreground),
  tokenRule("Imports and Packages", ["entity.name.import", "entity.name.package"], syntax.foreground),
  tokenRule("Entity Name", ["entity.name"], syntax.class),
  tokenRule("Tag", ["entity.name.tag", "meta.tag.sgml"], syntax.tag),
  tokenRule(
    "Tag Delimiters",
    ["punctuation.definition.tag.end", "punctuation.definition.tag.begin", "punctuation.definition.tag"],
    withAlpha(syntax.tag, 0.55),
  ),
  tokenRule("Tag Attribute", ["entity.other.attribute-name"], syntax.attribute),
  tokenRule("CSS Pseudo Class", ["entity.other.attribute-name.pseudo-class"], syntax.regexp),
  tokenRule(
    "Decorators",
    [
      "meta.decorator variable.other",
      "meta.decorator punctuation.decorator",
      "storage.type.annotation",
      "entity.name.function.decorator",
    ],
    syntax.special,
  ),
  tokenRule(
    "CSS Tag Names",
    [
      "source.css entity.name.tag",
      "source.sass entity.name.tag",
      "source.scss entity.name.tag",
      "source.less entity.name.tag",
      "source.stylus entity.name.tag",
    ],
    syntax.type,
  ),
  tokenRule("CSS Properties", ["support.type.property-name"], syntax.tag),
  tokenRule(
    "CSS Browser Prefix",
    [
      "source.css support.type",
      "source.sass support.type",
      "source.scss support.type",
      "source.less support.type",
      "source.stylus support.type",
    ],
    syntax.comment,
  ),
];
