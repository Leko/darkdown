import { ASTNode } from './types.ts'
import { Str } from './str.ts'

export interface Heading extends ASTNode {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: Str[]
}
