import { ASTNode } from './types.ts'
import { Paragraph } from './paragraph.ts'
import { BulletListMarker } from './bullet-list-marker.ts'
import { OrderedListMarker } from './ordered-list-marker.ts'

export interface ListItem extends ASTNode {
  type: 'list_item'
  children: Paragraph[]
  indent: number
  marker: BulletListMarker | OrderedListMarker
}
