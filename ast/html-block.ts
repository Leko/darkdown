import { ASTNode } from './types.ts'
import { Paragraph } from './paragraph.ts'

export type HTMLBlock = ASTNode<{
  type: 'html_block'
  children: Paragraph[]
}>
