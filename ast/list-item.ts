import { BulletListMarker } from './bullet-list-marker.ts'
import { CodeBlock } from './code-block.ts'
import { EmptyLine } from './empty-line.ts'
import { List } from './list.ts'
import { OrderedListMarker } from './ordered-list-marker.ts'
import { Paragraph } from './paragraph.ts'
import { Str } from './str.ts'
import { ASTNode } from './types.ts'

export interface ListItem extends ASTNode {
  type: 'list_item'
  children: (List | Paragraph | CodeBlock | Str | EmptyLine)[]
  indent: number
  marker: BulletListMarker | OrderedListMarker
}
