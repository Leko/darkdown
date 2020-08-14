import { ASTNode } from './types.ts'
import { Paragraph } from './paragraph.ts'

export type BlockQuote = ASTNode<{
  type: 'block_quote'
  // FIXME: Not only Paragraph
  children: Paragraph[]
}>
