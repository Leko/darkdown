import { ASTNode } from './types.ts'
import { Paragraph } from './paragraph.ts'

export interface HTMLBlock extends ASTNode {
  type: 'html_block'
  children: Paragraph[]
}
