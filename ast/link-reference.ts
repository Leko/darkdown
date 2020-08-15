import { ASTText } from './types.ts'

export interface LinkReference extends ASTText {
  type: 'link_reference'
  identifier: string
}
