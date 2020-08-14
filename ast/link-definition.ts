import { ASTNode } from './types.ts'

export type LinkDefinition = ASTNode<{
  type: 'link_definition'
  identifier: string
  label: string
  url: string
  title: string
  children: never[]
}>
