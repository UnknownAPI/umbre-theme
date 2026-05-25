import type { ThemeModel } from "@/theme/model.ts";
import { mix, withAlpha } from "@/theme/palette.ts";
import type { ColorMap } from "@/theme/types.ts";

export const vcsColors = ({ surfaces, uiSyntax: syntax }: ThemeModel): ColorMap => {
  const diffAlpha = surfaces.isDark ? 0.24 : 0.16;
  const decorationMix = surfaces.isDark ? 0.42 : 0.48;

  return {
    "gitDecoration.untrackedResourceForeground": mix(syntax.added, surfaces.muted, decorationMix),
    "gitDecoration.modifiedResourceForeground": mix(syntax.modified, surfaces.muted, decorationMix),
    "gitDecoration.deletedResourceForeground": mix(syntax.removed, surfaces.muted, 0.36),
    "gitDecoration.addedResourceForeground": syntax.added,
    "gitDecoration.stageModifiedResourceForeground": syntax.modified,
    "gitDecoration.stageDeletedResourceForeground": syntax.removed,
    "gitDecoration.renamedResourceForeground": syntax.operator,
    "gitDecoration.conflictingResourceForeground": syntax.number,
    "gitDecoration.ignoredResourceForeground": surfaces.deemphasized,
    "gitDecoration.submoduleResourceForeground": mix(syntax.class, surfaces.muted, decorationMix),
    "editorGutter.addedBackground": withAlpha(syntax.added, diffAlpha),
    "editorGutter.modifiedBackground": withAlpha(syntax.modified, diffAlpha),
    "editorGutter.deletedBackground": withAlpha(syntax.removed, diffAlpha),
    "editorGutter.commentRangeForeground": surfaces.subtle,
    "editorGutter.foldingControlForeground": surfaces.muted,
    "diffEditor.insertedTextBackground": withAlpha(syntax.added, surfaces.isDark ? 0.16 : 0.12),
    "diffEditor.removedTextBackground": withAlpha(syntax.removed, surfaces.isDark ? 0.16 : 0.12),
    "diffEditor.insertedLineBackground": withAlpha(syntax.added, surfaces.isDark ? 0.08 : 0.06),
    "diffEditor.removedLineBackground": withAlpha(syntax.removed, surfaces.isDark ? 0.08 : 0.06),
    "diffEditorGutter.insertedLineBackground": withAlpha(syntax.added, surfaces.isDark ? 0.18 : 0.12),
    "diffEditorGutter.removedLineBackground": withAlpha(syntax.removed, surfaces.isDark ? 0.18 : 0.12),
  };
};
