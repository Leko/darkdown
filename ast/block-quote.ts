import { ASTNode } from './types.ts'
import { Paragraph } from './paragraph.ts'

export interface BlockQuote extends ASTNode {
  type: 'block_quote'
  // FIXME: Not only Paragraph
  children: Paragraph[]
}
