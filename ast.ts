// [line, col]
export type Position = [number, number]

// [start, end]
export type TextRange = [Position, Position]

export type LoC = {
  start: number
  length: number
}

export type ASTText<T> = T &
  LoC & {
    text: string
  }
export type ASTNode<T extends { children: any[] }> = T & LoC

export type Text = ASTText<{
  type: 'text'
}>
export type SoftBreak = ASTText<{
  type: 'softbreak'
}>
export type LineBreak = ASTText<{
  type: 'linebreak'
}>
export type Emphasis = ASTText<{
  type: 'emph'
}>
export type Strong = ASTText<{
  type: 'strong'
}>
export type Code = ASTText<{
  type: 'code'
}>
export type HTML = ASTText<{
  type: 'html'
}>
export type LinkReference = ASTText<{
  type: 'link_reference'
  identifier: string
}>

// It's not defined in spec
export type Str = ASTNode<{
  type: 'str'
  children: (
    | Text
    | SoftBreak
    | LineBreak
    | Emphasis
    | Strong
    | Code
    | HTML
    | LinkReference
  )[]
}>

export type LinkDefinition = ASTNode<{
  type: 'link_definition'
  identifier: string
  label: string
  url: string
  title: string
  children: never[]
}>

export type EmptyLine = ASTNode<{
  type: 'empty_line'
  children: never[]
}>

export type Link = ASTNode<{
  type: 'link'
  children: Str[]
  destination: string | null
  title: string
}>

export type Image = ASTNode<{
  type: 'image'
  children: Str[]
  title: string
}>

export type Paragraph = ASTNode<{
  type: 'paragraph'
  children: Str[]
}>

export type BlockQuote = ASTNode<{
  type: 'block_quote'
  children: Paragraph[]
}>

export type BulletListMarker = ASTNode<{
  type: 'bullet_list_marker'
  char: string
  children: []
}>
export type OrderedListMarker = ASTNode<{
  type: 'ordered_list_marker'
  number: number
  delimiter: string
  text: string
  children: []
}>
export type ListType = BulletListMarker['type'] | OrderedListMarker['type']

export type ListItem = ASTNode<{
  type: 'list_item'
  children: Paragraph[]
  indent: number
  marker: BulletListMarker | OrderedListMarker
}>

export type List = ASTNode<{
  type: 'list'
  listType: ListType
  children: ListItem[]
}>

export type Heading = ASTNode<{
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: Str[]
}>

export type CodeBlock = ASTText<{
  type: 'code_block'
  language: string | null
  // https://spec.commonmark.org/0.29/#info-string
  info: string | null
}>

export type HTMLBlock = ASTNode<{
  type: 'html_block'
  children: Paragraph[]
}>

// https://spec.commonmark.org/0.29/#thematic-break
export type ThematicBreak = ASTText<{
  type: 'thematic_break'
}>

export type FIXME_All_Nodes =
  | Str
  | EmptyLine
  | Link
  | HTML
  | Image
  | Paragraph
  | BlockQuote
  | ListItem
  | List
  | Heading
  | CodeBlock
  | HTMLBlock
  | ThematicBreak
  | LinkDefinition

export type Document = ASTNode<{
  type: 'document'
  children: FIXME_All_Nodes[]
}>
