import { ASTNode } from './types.ts'
import { Str } from './str.ts'

export interface Link extends ASTNode {
  type: 'link'
  children: Str[]
  destination: string | null
  title: string
}
