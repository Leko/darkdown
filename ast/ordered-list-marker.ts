import { ASTNode } from './types.ts'

export interface OrderedListMarker extends ASTNode {
  type: 'ordered_list_marker'
  number: number
  delimiter: string
  text: string
  children: []
}
