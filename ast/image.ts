import { ASTNode } from './types.ts'
import { Str } from './str.ts'

export interface Image extends ASTNode {
  type: 'image'
  children: Str[]
  title: string
}
