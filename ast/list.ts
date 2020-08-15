import { ASTNode } from './types.ts'
import { BulletListMarker } from './bullet-list-marker.ts'
import { OrderedListMarker } from './ordered-list-marker.ts'
import { ListItem } from './list-item.ts'

export type ListType = BulletListMarker['type'] | OrderedListMarker['type']

export interface List extends ASTNode {
  type: 'list'
  listType: ListType
  children: ListItem[]
}
