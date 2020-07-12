// [line, col]
export type Position = [number, number]

// [start, end]
export type TextRange = [Position, Position]

export type ASTLeaf<T> = T & {
  text: string
  sourcepos: TextRange
}
export type ASTNode<T extends { children: any[] }> = T & {
  sourcepos: TextRange
}

export type Text = ASTLeaf<{
  type: 'text'
}>
export type SoftBreak = ASTLeaf<{
  type: 'softbreak'
}>
export type LineBreak = ASTLeaf<{
  type: 'linebreak'
}>
export type Emphasis = ASTLeaf<{
  type: 'emph'
}>
export type Strong = ASTLeaf<{
  type: 'strong'
}>
export type Code = ASTLeaf<{
  type: 'code'
}>
export type HTMLInline = ASTLeaf<{
  type: 'html_inline'
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
    | HTMLInline
  )[]
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

export type ListItem = ASTNode<{
  type: 'item'
  children: Paragraph[]
}>

export type List = ASTNode<{
  type: 'list'
  listType: 'Bullet' | 'Ordered'
  listTight: boolean
  listStart: number
  listDelimiter: ')' | '.' | null
  children: Paragraph[]
}>

export type Heading = ASTNode<{
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: Paragraph[]
}>

export type CodeBlock = ASTLeaf<{
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
export type ThematicBreak = ASTLeaf<{
  type: 'thematic_break'
}>

export type FIXME_All_Notes =
  | Str
  | Link
  | Image
  | Paragraph
  | BlockQuote
  | ListItem
  | List
  | Heading
  | CodeBlock
  | HTMLBlock
  | ThematicBreak

//-----------------------------------------
//-----------------------------------------
//-----------------------------------------

export type Document = ASTNode<{
  type: 'document'
  children: FIXME_All_Notes[]
}>