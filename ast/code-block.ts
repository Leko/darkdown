import { ASTText } from './types.ts'

export interface CodeBlock extends ASTText {
  type: 'code_block'
  language: string | null
  // https://spec.commonmark.org/0.29/#info-string
  info: string | null
}
