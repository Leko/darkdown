import { ASTNode } from './types.ts'

export type OrderedListMarker = ASTNode<{
  type: 'ordered_list_marker'
  number: number
  delimiter: string
  text: string
  children: []
}>
