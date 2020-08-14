import { ASTNode } from './types.ts'
import { Str } from './str.ts'

export type Link = ASTNode<{
  type: 'link'
  children: Str[]
  destination: string | null
  title: string
}>
