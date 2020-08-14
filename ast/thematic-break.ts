import { ASTText } from './types.ts'

// https://spec.commonmark.org/0.29/#thematic-break
export type ThematicBreak = ASTText<{
  type: 'thematic_break'
}>
