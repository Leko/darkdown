import { ASTNode } from './types.ts'
import { Text } from './text.ts'
import { SoftBreak } from './soft-break.ts'
import { LineBreak } from './line-break.ts'
import { Emphasis } from './emphasis.ts'
import { Strong } from './strong.ts'
import { Code } from './code.ts'
import { HTML } from './html.ts'
import { LinkReference } from './link-reference.ts'

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

export function isStr(node: any): node is Str {
  return node?.type === 'str'
}
