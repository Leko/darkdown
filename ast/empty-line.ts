import { ASTNode } from './types.ts'

export type EmptyLine = ASTNode<{
  type: 'empty_line'
  children: never[]
}>
