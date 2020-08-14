import { ASTNode } from './types.ts'
import { Str } from './str.ts'

export type Image = ASTNode<{
  type: 'image'
  children: Str[]
  title: string
}>
