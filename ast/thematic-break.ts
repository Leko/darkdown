import { ASTText } from './types.ts'

// https://spec.commonmark.org/0.29/#thematic-break
export interface ThematicBreak extends ASTText {
  type: 'thematic_break'
}
