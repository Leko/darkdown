import { ASTText } from './types.ts'

export type LinkReference = ASTText<{
  type: 'link_reference'
  identifier: string
}>
