import { ASTNode } from './types.ts'
import { Str } from './str.ts'

export interface Paragraph extends ASTNode {
  type: 'paragraph'
  children: Str[]
}

export function isParagraph(node: any): node is Paragraph {
  return node?.type === 'paragraph'
}
