import { ASTNode } from './types.ts'

export interface LinkDefinition extends ASTNode {
  type: 'link_definition'
  identifier: string
  label: string
  url: string
  title: string
  children: never[]
}
