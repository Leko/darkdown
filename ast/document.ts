import { ASTNode } from './types.ts'
import { HTML } from './html.ts'
import { CodeBlock } from './code-block.ts'
import { ThematicBreak } from './thematic-break.ts'
import { Str } from './str.ts'
import { EmptyLine } from './empty-line.ts'
import { Link } from './link.ts'
import { Image } from './image.ts'
import { Paragraph } from './paragraph.ts'
import { BlockQuote } from './block-quote.ts'
import { ListItem } from './list-item.ts'
import { List } from './list.ts'
import { Heading } from './heading.ts'
import { HTMLBlock } from './html-block.ts'
import { LinkDefinition } from './link-definition.ts'

export type FIXME_All_Nodes =
  | HTML
  | CodeBlock
  | ThematicBreak
  | LinkDefinition
  | Str
  | EmptyLine
  | Link
  | Image
  | Paragraph
  | BlockQuote
  | ListItem
  | List
  | Heading
  | HTMLBlock

export type Document = ASTNode<{
  type: 'document'
  children: FIXME_All_Nodes[]
}>
