import { ASTNode } from './types.ts'

export type BulletListMarker = ASTNode<{
  type: 'bullet_list_marker'
  char: string
  children: []
}>
