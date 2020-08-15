import { ASTNode } from './types.ts'

export interface EmptyLine extends ASTNode {
  type: 'empty_line'
  children: never[]
}
