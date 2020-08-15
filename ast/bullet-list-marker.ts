import { ASTNode } from './types.ts'

export interface BulletListMarker extends ASTNode {
  type: 'bullet_list_marker'
  char: string
  children: []
}
