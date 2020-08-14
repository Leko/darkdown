import { ASTNode } from './types.ts'
import { Str } from './str.ts'

export type Paragraph = ASTNode<{
  type: 'paragraph'
  children: Str[]
}>
